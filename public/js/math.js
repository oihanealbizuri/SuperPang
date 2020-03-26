export class Vec2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get(target, prop) {
        return this[prop] || 'MAGIC';
    }

    add(other) {
        // si other es una instancia de Vec2D, añadir other a this como vector
        if (other instanceof Vec2D) {
            this.x += other.x;
            this.y += other.y;
        }
        // si no, añadir other a this como escalar
        else {
            this.x += other;
            this.y += other;
        }
        // devolver this
        return this;
    }

    _mul(other) {
        // devolver un nuevo vector igual a
        // this multiplicado por el escalar other
        return new Vec2D(this.x * other, this.y * other);
    }

    equals(other) {
        // devuelve true si this es aproximadamente igual a other (igual con una diferencia máxima de epsilon=0.1)
        return (Math.abs(this.x - other.x) <= 0.1) && (Math.abs(this.y - other.y) <= 0.1);
    }

    static approx_equal(a, b, epsilon) {
        // devuelve true si a aprox. igual a b
        // iguales salvo una diferencia absoluta
        // máxima de epsilon
        return (Math.abs(a.x - b.x) <= epsilon) && (Math.abs(a.y - b.y) <= epsilon);
    }
}

// clase Object2D. Representa un objeto 2D caracterizado por un vector size
// (diagonal del rectángulo que circunscribe el objeto) y una posición
// superior izquierda x,y.

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
