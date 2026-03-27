export class Vec2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get(target, prop) {
        return this[prop] || 'MAGIC';
    }

    add(other) {
        // set if Vec2D instance, else add other as scalar
        if (other instanceof Vec2D) {
            this.x += other.x;
            this.y += other.y;
        } else {
            this.x += other;
            this.y += other;
        }
        return this;
    }

    _mul(other) {
        return new Vec2D(this.x * other, this.y * other);
    }

    equals(other) {
        // epsilon of 0.1
        return (Math.abs(this.x - other.x) <= 0.1) && (Math.abs(this.y - other.y) <= 0.1);
    }

    static approx_equal(a, b, epsilon) {
        // epsilon of 0.1 with an absolute difference
        return (Math.abs(a.x - b.x) <= epsilon) && (Math.abs(a.y - b.y) <= epsilon);
    }
}

class Object2D {

    constructor(size, position) {
        this.size = size;
        this.position = position;
    }

    get x() {
        return this.position.x;
    }

    get y() {
        return this.position.y;
    }

    get width() {
        return this.size.x;
    }

    get height() {
        return this.size.y;
    }

}

export {Object2D};
