export class Rectangle {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
    get center() {
        return (this.x+this.w/2, this.y+this.h/2);
    }
    get x2() {
        return this.w+this.x;
    }
    get y2() {
        return this.y+this.h;
    }
}
