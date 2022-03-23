import { Rectangle } from "./rectangle.js";

const rightKeys = [39, 68];
const leftKeys = [37, 65];
const upKeys = [38, 87];
const downKeys = [40, 83];

const jumpKeys = ["Space"];
let dust_images = new Map();

export function preloadplayerjs() {
    function ldi(..._) {
        var stuff = [];
        _.forEach((imgload, count) => {
            stuff.push(loadImage("./javascript/images/dust/" + imgload));
        });
        return stuff;
    }
    dust_images.set("jump", ldi("jump_1.png", "jump_2.png", "jump_3.png", "jump_4.png", "jump_5.png"));
    dust_images.set("land", ldi("land_1.png", "land_2.png", "land_3.png", "land_4.png", "land_5.png"));
}

class DustParticle {
    constructor(pos, type) {
        this.x = pos[0];
        this.y = pos[1];
        this.type = type;
        this.frame = 0;
    }
    draw() {
        if (this.image != undefined) {
            if (this.type == "jump") {
                image(this.image, this.x-16, this.y-24);
            } else if (this.type == "land") {
                image(this.image, this.x-50, this.y-40);
            } else {
                image(this.image, this.x, this.y-10);
            }
        }
        this.frame += 0.5;
        if (this.frame >= dust_images.get(this.type).length) {
            return true;
        }
        return false;
    }
    get image() {
        return dust_images.get(this.type)[int(this.frame)];
    }
}


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
        this.framessincegrounded = 0;
        this.facing_right = true;
        this.dashes_left = 0;
        this.dash_timer = 0;
        this.anim_speed = 0.04;
        this.dust_particles = [];
        let image_states = {
            "idle": ["idle.png"],
            "jump": ["jump.png"],
            "fall": ["fall.png"],
            "run": ["run0.png", "run1.png", "run2.png", "run3.png", "run4.png"]
        };
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
        this.max_dashes = 1;
        this.dash_length = 0.15;
        this.dash_speed = 16;
        this.username;
    }

    get dashing() {
        return this.dash_timer > 0;
    }

    get rect() {
        return new Rectangle(this.x, this.y, 100, 60);
    }

    get attackHitbox() {
        if (this.facing_right) {
            return new Rectangle(this.hitbox.x+this.hitbox.w, this.hitbox.y-20, 70, this.hitbox.h+40)
        } else {
            return new Rectangle(this.hitbox.x-70, this.hitbox.y-20, 70, this.hitbox.h+40)
        }
    }

    get position() {
        return [this.x, this.y];
    }

    jump(event) {
		if (event == undefined || jumpKeys.includes(event.code)) {
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

    		if (this.grounded) {
    			this.dy = -this.jump_height;
                this.dust_particles.push(new DustParticle(this.rect.midbottom, "jump"));
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

    draw(hitboxes, dontjustdraw=true) {
        if (dontjustdraw) {
            this.framessincegrounded += 1;
            this.images.frame += Math.abs(this.dx*this.anim_speed);
            this.dash_timer -= 1;
            if (!this.dashing) {
                if (this.dx > this.max_speed) {
                    this.dx = this.max_speed;
                } else if (this.dx < -this.max_speed) {
                    this.dx = -this.max_speed;
                }
            }

            // draw dust particles
            if (this.images.state == "run") {
                if (Math.abs(this.dx) == this.max_speed) {
                }
            }
            var deadlist = []
            for (var particle in this.dust_particles) {
                if (this.dust_particles[particle].draw()) {
                    deadlist.push(this.dust_particles[particle]);
                }
            }
            this.dust_particles = this.dust_particles.filter((value, index, arr) => {
                return !deadlist.includes(value);
            });
            this.move(this.dx, this.dy, hitboxes);
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
        if (dontjustdraw) {
            if (!this.dashing) {
                this.dy += this.gravity;
            }
            for (var hitbox in hitboxes) {
                hitbox = hitboxes[hitbox];
            }

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
    }
    get grounded() {
        return (this.framessincegrounded == 0);
    }
    move(dx, dy, hitboxes) {
        let rect;

        this.y += dy;
        for (var count in hitboxes) {
            rect = hitboxes[count];
            if (rect.colliderect(this.hitbox)) {
                if (dy > 0) {
                    this.y = rect.y-this.hitbox.h;
                    this.framessincegrounded = 0;
                    this.dashes_left = this.max_dashes;
                    this.dash_timer = 0;
                    if (this.dy > this.gravity) {
                        this.dust_particles.push(new DustParticle(this.rect.midbottom, "land"));
                    }
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
                    this.x = rect.x+rect.w-30;
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
        return this.images[state][int(frame_) % this.images[state].length];
    }
    set image(val) {  // same as @image.setter in python
        this.images.state = val;
        return;
    }
}
