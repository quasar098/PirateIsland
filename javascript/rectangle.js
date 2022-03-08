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
    get points() {
        return [[this.x, this.y],
        [this.x+this.w, this.y],
        [this.x, this.y+this.h],
        [this.x+this.w, this.y+this.h]];
    }
    draw() {
        rect(this.x, this.y, this.w, this.h);
    }
    colliderect(rectangle) {
        for (var point in rectangle.points) {
            if (this.collidepoint(rectangle.points[point][0], rectangle.points[point][1])) {
                return true;
            }
        }
        for (var point in this.points) {
            if (rectangle.collidepoint(this.points[point][0], this.points[point][0])) {
                return true;
            }
        }
        return false;
    }
    collidepoint(x, y) {
        if (x >= this.x && this.x+this.w >= x) {
            if (y >= this.y && this.y+this.h >= y) {
                return true;
            }
        }
        return false;
    }
}
