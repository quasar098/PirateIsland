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
    get midbottom() {
        return [this.x+this.w/2, this.y+this.h];
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
        let a = this;
        let b = rectangle;

        // copied pseudocode from _pg_do_rects_intersect function
        // https://github.com/pygame/pygame/blob/main/src_c/rect.c
        if (a.w == 0 || a.h == 0 || b.w == 0 || b.h == 0) {
            return false;
        }

        // how the hell does this work idk but it works ????
        return (Math.min(a.x, a.x+a.w) < Math.max(b.x, b.x+b.w) &&
                Math.min(a.y, a.y+a.h) < Math.max(b.y, b.y+b.h) &&
                Math.max(a.x, a.x+a.w) > Math.min(b.x, b.x+b.w) &&
                Math.max(a.y, a.y+a.h) > Math.min(b.y, b.y+b.h));
    }
    collidepoint(x, y) {
        if (x > this.x && this.x+this.w > x) {
            if (y > this.y && this.y+this.h > y) {
                return true;
            }
        }
        return false;
    }
}
