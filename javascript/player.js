import { Rectangle } from "./rectangle.js";

const rightKeys = [39, 68];
const leftKeys = [37, 65];
const upKeys = [38, 87];
const downKeys = [40, 83];

const jumpKeys = ["Space"];

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.acceleration = 3;
        this.deceleration = 1;
        this.images = {
            frame: 0,
            state: "idle"
        }
        this.dx = 0;
        this.dy = 1;
        this.framessincegrounded = 0
        this.facing_right = true;
        this.dashes_left = 0;
        this.dash_timer = 0;
        this.anim_speed = 0.04;

        // load up the images
        let image_states = {
            "idle": ["idle.png"],
            "jump": ["jump.png"],
            "fall": ["fall.png"],
            "run": ["run0.png", "run1.png", "run2.png", "run3.png", "run4.png"]
        }
        let images;
        for (var state in image_states) {
            images = [];
            for (var name in image_states[state]) {
                images.push(loadImage("./javascript/images/character/" + image_states[state][name]));
            }
            this.images[state] = images;
        }

        // private game settings
        this.max_speed = 12;
        this.gravity = 0.75;
        this.jump_height = 16;
        this.max_dashes = 2;
        this.dash_length = 0.2;
        this.dash_speed = 13;
    }

    get dashing() {
        return this.dash_timer > 0;
    }

    get rect() {
        return new Rectangle(this.x, this.y, 100, 60);
    }

    jump(event) {
        function dashDirection() {
            let direction = [0, 0];
            for (var upKey in upKeys) {
                if (keyIsDown(upKeys[upKey])) {
                    direction[1] -= 1;
                    break;
                }
            }
            for (var downKey in downKeys) {
                if (keyIsDown(downKeys[downKey])) {
                    direction[1] += 1;
                    break;
                }
            }
            for (var rightKey in rightKeys) {
                if (keyIsDown(rightKeys[rightKey])) {
                    direction[0] += 1;
                    break;
                }
            }
            for (var leftKey in leftKeys) {
                if (keyIsDown(leftKeys[leftKey])) {
                    direction[0] -= 1;
                    break;
                }
            }
            return direction;
        }

        if (jumpKeys.includes(event.code)) {
    		if (this.grounded) {
    			this.dy = -this.jump_height;
    		} else {
                if (this.dashes_left > 0) {
                    let dir = dashDirection();
                    if (!(dir[0] == 0 && dir[1] == 0)) {
                        this.dashes_left -= 1;
                        this.dash_timer = 60*this.dash_length;
                        this.dx = dir[0]*this.dash_speed;
                        this.dy = dir[1]*this.dash_speed;
                    }
                }
            }
    	}
    }

    draw() {
        // clamp dx value
        this.images.frame += this.dx*this.anim_speed;
        this.dash_timer -= 1;
        if (!this.dashing) {
            if (this.dx > this.max_speed) {
                this.dx = this.max_speed;
            } else if (this.dx < -this.max_speed) {
                this.dx = -this.max_speed;
            }
        }

        push();
        translate(this.x, this.y);
        if (!this.facing_right) {
            scale(-1, 1);
            image(this.image, -100, 0);
        } else {
            image(this.image, 0, 0);
        }
        pop();
        if (!this.dashing) {
            this.dy += this.gravity;
        }
        this.move(this.dx, this.dy, [new Rectangle(0, 500, 600, 100), new Rectangle(100, 400, 100, 100)]);
        rect(0, 500, 600, 100);
        rect(100, 400, 100, 100);

        // change anims
        if (this.dy > 2) {
            this.image = "jump";
        } else if (this.dy < -2) {
            this.image = "fall";
        } else if (this.grounded) {
            if (this.dx == 0) {
                this.image = "idle";
            } else {
                this.image = "run";
            }
        }
        this.frame

        // change flipped
        if (this.dx > 0) {
            this.facing_right = true;
        }
        if (this.dx < 0)
        {
            this.facing_right = false;
        }

        if (!this.dashing) {
        // changing dx based on keys
            let willreturn = 0;
            for (var rKey in rightKeys) {
                if (keyIsDown(rightKeys[rKey])) {
                    willreturn += 1;
                }
            }
            for (var lKey in leftKeys) {
                if (keyIsDown(leftKeys[lKey])) {
                    willreturn -= 1;
                }
            }
            if (willreturn) {
                this.dx += willreturn;
                return;
            }

            // deceleration if no key pressed
            for (var i=0; i<2; i++) {
                if (this.dx > 0) {
                    this.dx -= this.deceleration;
                } else if (this.dx < 0) {
                    this.dx += this.deceleration;
                }
            }
        }
    }
    get grounded() {
        return (this.framessincegrounded < 10);
    }
    move(dx, dy, hitboxes) {
        let rect;

        this.framessincegrounded += 1;

        this.y += dy;
        for (var count in hitboxes) {
            rect = hitboxes[count];
            if (rect.colliderect(this.hitbox)) {
                if (dy > 0) {
                    this.y = rect.y-this.hitbox.h;
                    this.framessincegrounded = 0;
                    this.dashes_left = this.max_dashes;
                    this.dash_timer = 0;
                }
                if (dy < 0) {
                    this.y = rect.y+rect.h;
                }
                this.dy = 0;
                break;
            }
        }
        this.x += dx;
        for (var count in hitboxes) {
            rect = hitboxes[count];
            if (rect.colliderect(this.hitbox)) {
                if (dx > 0) {
                    this.x = rect.x-70;
                    this.dash_timer = 0;
                }
                if (dx < 0) {
                    this.x = rect.x+rect.w-30; // todo fix this
                    this.dash_timer = 0;
                }
                this.dx = 0;
                break;
            }
        }

    }
    get hitbox() {
        return new Rectangle(this.rect.x+30, this.rect.y, 40, this.rect.h);
    }
    get image() {  // same as @property (getter) in python
        let state = this.images.state + "";
        let frame_ = int(this.images.frame);
        return this.images[state][frame_ % this.images[state].length];
    }
    set image(val) {  // same as @image.setter in python
        this.images.state = val;
        return;
    }
}
