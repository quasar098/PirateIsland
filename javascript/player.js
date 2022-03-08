import { Rectangle } from "./rectangle.js";

const rightKeys = [39, 68];
const leftKeys = [37, 65];

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.acceleration = 0.5;
        this.deceleration = 0.5;
        this.images = {
            frame: 0,
            state: "idle"
        }
        this.dx = 0;
        this.dy = 1;
        this.framessincegrounded = 0

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
        this.gravity = 0.5;
    }
    get rect() {
        return new Rectangle(this.x, this.y, 100, 60);
    }
    draw() {
        // clamp dx value
        if (this.dx > this.max_speed) {
            this.dx = this.max_speed;
        } else if (this.dx < -this.max_speed) {
            this.dx = -this.max_speed;
        }

        image(this.image, this.x, this.y);
        this.dy += this.gravity;
        this.move(this.dx, this.dy, []);

        // change anims
        if (this.dy > 2) {
            this.image = "jump";
        } else if (this.dy < -2) {
            this.image = "fall";
        } else if (this.grounded){
            this.image = "idle";
        }

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
    get grounded() {
        return (this.framessincegrounded < 10);
    }
    move(dx, dy, hitboxes) {
        this.x += dx;
        this.y += dy;
        this.framessincegrounded += 1;
        for (var count in hitboxes) {
            if (hitboxes[count]) {

            }  // TODO: do this
        }
    }
    get hitbox() {
        return new Rectangle(this.rect.x+30, this.rect.y, 40, this.rect.h);
    }
    get image() {  // same as @property (getter) in python
        return this.images[this.images.state][this.images.frame];
    }
    set image(val) {  // same as @image.setter in python
        this.images.state = val;
        return;
    }
}
