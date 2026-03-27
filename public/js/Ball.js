import {Object2D, Vec2D} from './math.js';
import Settings from "./Settings.js";

class Ball extends Object2D {

    constructor(radius, position, force, sprite, color) {
        super(new Vec2D(radius * 2, radius * 2), position);
        this.radius = radius;
        this.position = position;
        this.force = force;
        this.falling = this.force.y >= 0;
        this.color = color;
        this.sprite = sprite;
    }

    update() {
        if (this.x + this.radius >= Settings.SCREEN_WIDTH - Settings.MARGIN) { // RIGHT
            this.force.x = -this.force.x * Settings.DAMPING;
            this.position.x = Settings.SCREEN_WIDTH - this.radius - Settings.MARGIN;

        } else if (this.x - this.radius <= Settings.MARGIN) { // LEFT
            this.force.x = -this.force.x * Settings.DAMPING;
            this.position.x = this.radius + Settings.MARGIN;
        }

        if (this.y + this.radius >= Settings.SCREEN_HEIGHT - Settings.MARGIN) { // DOWN
            this.position.y = Settings.SCREEN_HEIGHT - this.radius - Settings.MARGIN;
            this.force.x = this.force.x * Settings.TRACTION;
            this.force.y = -this.force.y * Settings.DAMPING;
            if (Math.abs(this.force.y) < 5) {
                this.force.y = -5;
            }

        } else if (this.y - this.radius <= Settings.MARGIN) { // UP
            this.position.y = this.radius + Settings.MARGIN;
            this.force.y = -this.force.y * Settings.DAMPING;
        }

        this.falling = this.force.y > 0;
        this.force.y += Settings.GRAVITY;
        this.position.x += this.force.x;
        this.position.y += this.force.y;
    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.position.x - this.radius, this.position.y - this.radius, this.radius * 2, this.radius * 2);
    }

    get pos() {
        return this.position;
    }
}

export {Ball};
