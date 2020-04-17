import {Object2D, Vec2D} from './math.js';
import Settings from "./Settings.js";

class Ball extends Object2D {

    constructor(radius, position, force, sprite, color) {
        super(new Vec2D(radius * 2, radius * 2), position);
        this.radius = radius;
        this.position = position;
        this.force = force;
        this.falling = this.force.y >= 0;
        this.max_height = Settings.SCREEN_HEIGHT - 150 - radius * 4;
        this.color = color;
        this.sprite = sprite;
    }

    update(time_passed) {

        // OLD CODE
        // this.force.add(new Vec2D(0, Settings.GRAVITY * time_passed));
        // this.position.add(this.force._mul(time_passed));
        //
        // if (this.x < this.radius + Settings.MARGIN || this.x > Settings.SCREEN_WIDTH - this.radius - Settings.MARGIN) {
        //     this.force = new Vec2D(-this.force.x, this.force.y);
        //
        //     if (this.x < this.radius + Settings.MARGIN)
        //         this.position = new Vec2D(2 * (this.radius + Settings.MARGIN) - this.x, this.y);
        //     else
        //         this.position = new Vec2D(2 * (Settings.SCREEN_WIDTH - this.radius - Settings.MARGIN) - this.x, this.y);
        // }
        // if (this.y > Settings.SCREEN_HEIGHT - this.radius - Settings.MARGIN) {
        //     this.position = new Vec2D(this.x, 2 * (Settings.SCREEN_HEIGHT - this.radius - Settings.MARGIN) - this.y);
        //     this.force = new Vec2D(this.force.x, -(((this.y - this.max_height) * 2 * Settings.GRAVITY) ** .5));
        // }
        //
        // this.falling = this.force.y > 0;

        // NEW CODE
        if (this.x + this.radius >= Settings.SCREEN_WIDTH - Settings.MARGIN) { // derecha
            this.force.x = -this.force.x * Settings.DAMPING;
            this.position.x = Settings.SCREEN_WIDTH - this.radius - Settings.MARGIN;
        } else if (this.x - this.radius <= Settings.MARGIN) { // izquierda
            // this.force.x = -this.force.x * Settings.DAMPING;
            this.force.x = -this.force.x * Settings.DAMPING;
            this.position.x = this.radius + Settings.MARGIN;
        }

        if (this.y + this.radius >= Settings.SCREEN_HEIGHT - Settings.MARGIN) { // abajo
            // vy = -vy * Settings.DAMPING; <- y vector added in force
            this.position.y = Settings.SCREEN_HEIGHT - this.radius - Settings.MARGIN;
            // this.force = new Vec2D(this.force * Settings.TRACTION, -this.force.y * Settings.DAMPING);
            this.force.x = this.force.x * Settings.TRACTION;
            this.force.y = -this.force.y * Settings.DAMPING;
            if (Math.abs(this.force.y) < 5){
                this.force.y = -5;
            }
        } else if (this.y - this.radius <= Settings.MARGIN) { // arriba
            // vy = -vy * Settings.DAMPING; <- y vector added in force
            this.position.y = this.radius + Settings.MARGIN;
            // this.force.y = -this.force.y * Settings.DAMPING;
            this.force.y = -this.force.y * Settings.DAMPING;
        }

        // vy += Settings.GRAVITY; // <- y vector again
        this.falling = this.force.y > 0;
        this.force.y += Settings.GRAVITY;
        this.position.x += this.force.x;
        this.position.y += this.force.y;
    }

    draw(ctx) {
        // Añade el método draw a la clase Ball para que se pinte a sí misma
        // en el contexto que se le pasa como parámetro
        // OLD
        // ctx.beginPath();
        // ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        // ctx.fillStyle = "#FF0000";
        // ctx.fill();
        // ctx.lineWidth = 5;
        // ctx.strokeStyle = "#000000";
        // ctx.stroke();

        // NEW
        // ctx.drawImage(this.sprite, this.position.x - this.radius, this.position.y - this.radius);
        ctx.drawImage(this.sprite, this.position.x - this.radius, this.position.y - this.radius, this.radius*2, this.radius*2);
        ctx.font = "15px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(Math.abs(this.force.y), 120, 50);

    }

    get pos() {
        return this.position;
    }

    get vel() {
        return this.force;
    }
}

export {Ball};
