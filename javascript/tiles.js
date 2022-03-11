import { Rectangle } from "./rectangle.js";

export class Tile {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        if (isNaN(parseInt(type))) {
            this.image = loadImage("javascript/images/tiles/image_part_00" + [undefined, "topleft", "top", "topright", "left", "center", "right", "bottomleft", "bottom", "bottomright"].indexOf(type) + ".png");
        } else {
            this.image = loadImage("javascript/images/tiles/image_part_00" + (type).toString() + ".png")
        }
    }
    get rect() {
        return new Rectangle(this.x*100, this.y*100, 100, 100);
    }
    draw() {
        image(this.image, this.x*100, this.y*100);
    }
}
