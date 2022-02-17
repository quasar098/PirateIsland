

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

        // these vars will probably get changed explicitly during the game
        this.max_speed = 7;
    }

    get image() {  // same as @property (getter) in python
        return this.images[this.images.state][this.images.frame];
    }
    set image(val) {  // same as @image.setter in python
        this.images.state = val;
        return;
    }
}
