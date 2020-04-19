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
        this.bonus_type = bonus_type;
        this.force = new Vec2D(0, 0);
        this.to_kill = false;
        this.falling = true;
        this.timer = Settings.BONUS_DURATION;
        this.sprite = sprite;
    }


    update(time_passed) {
        // si no está cayendo
        if (!this.falling) {
            // acumular en this.timer el tiempo transcurrido
            this.timer -= time_passed;
            // si this.timer es menor que 0, preparar el bonus para sacarlo de pantalla
            if (this.timer < 0) {
                this.to_kill = true;
            }
        } else {
            // hacer que caiga
            // this.position.y += time_passed * this.force.y;
            this.falling = true;
            this.force.y += Settings.GRAVITY;
            this.position.y += this.force.y;
            // si se sale de los límites de la pantalla, dejarlo justo encima del suelo, parado
            if (this.y > Settings.SCREEN_HEIGHT - Settings.BONUS_SIZE - Settings.MARGIN) {
                this.falling = false;
                this.position.y = Settings.SCREEN_HEIGHT - Settings.MARGIN - Settings.BONUS_SIZE;
            }
        }
    }

    draw(ctx) {
        // pintar el bonus en el contexto
        ctx.drawImage(this.sprite, this.position.x, this.position.y, Settings.BONUS_SIZE, Settings.BONUS_SIZE);
    }

}
