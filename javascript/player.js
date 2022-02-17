import { Rectangle } from "./rectangle.js";


export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.acceleration = 0.4;
        this.deceleration = 0.2;
        this.images = {
            frame: 0,
            state: "idle"
        }
        this.dx = 0;
        this.dy = 1;

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
        this.max_speed = 7;
        this.gravity = 0.5;
    }

    get rect() {
        this.rect = new Rectangle(this.x, this.y, 100, 60);
    }

    draw() {
        image(this.image, this.x, this.y);
        this.dy += this.gravity;
        this.move(this.dx, this.dy, []);
    }

    move(x, y, hitboxes) {
        this.x += x;
        this.y += y;
        for (var count in hitboxes) {
            if (hitboxes[count]) {

            }  // TODO: do this
        }
    }

    get image() {  // same as @property (getter) in python
        return this.images[this.images.state][this.images.frame];
    }
    set image(val) {  // same as @image.setter in python
        this.images.state = val;
        return;
    }
}
