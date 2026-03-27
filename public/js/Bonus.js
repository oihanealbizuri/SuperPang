import {Object2D, Vec2D} from "./math.js";
import Settings from "./Settings.js";

export let BonusType = {
    stop_time: 'stop',
    extra_hook: 'extrahook',
    chain_hook: 'chainhook',
    break_balls_once: 'breakonce',
    break_balls_max: 'breakmax',
    invulnerability: 'invulnerable',
    shoot: 'shoot'
};

export class Bonus extends Object2D {

    constructor(position, bonus_type, sprite) {
        super(new Vec2D(Settings.BONUS_SIZE, Settings.BONUS_SIZE), position);
        this.force = new Vec2D(0, 0);
        this.to_kill = false;
        this.falling = true;
        this.timer = Settings.BONUS_DURATION;
        this.sprite = sprite;
    }


    update(time_passed) {
        if (!this.falling) {
            this.timer -= time_passed;
            if (this.timer < 0) {
                this.to_kill = true;
            }
        } else {
            this.falling = true;
            this.force.y += Settings.GRAVITY;
            this.position.y += this.force.y;
            if (this.y > Settings.SCREEN_HEIGHT - Settings.BONUS_SIZE - Settings.MARGIN) {
                this.falling = false;
                this.position.y = Settings.SCREEN_HEIGHT - Settings.MARGIN - Settings.BONUS_SIZE;
            }
        }
    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.position.x, this.position.y, Settings.BONUS_SIZE, Settings.BONUS_SIZE);
    }

}
