import {Vec2D} from "./math.js";
import {Object2D} from "./math.js";
import Settings from "./Settings.js";

let HookType = {
    rope: 0,
    chain: 1,
};

class Hook extends Object2D {

    constructor(height, position, hook_type, bufferRope, bufferChain) {
        super(new Vec2D(6, height), position);
        this.hook_type = hook_type;
        this.expand = true;
        this.timer = Settings.HOOK_DURATION;
        this.buffer = bufferRope;
        this.bufferChain = bufferChain;

    }

    draw(ctx){
       // pintar el hook de buffer en la posición x,y de este objeto
        if (this.hook_type === HookType.rope) {
            ctx.drawImage(this.buffer, this.position.x, this.position.y);
        } else {
            ctx.drawImage(this.bufferChain, this.position.x, this.position.y);
        }

    }

    update(time_passed) {

        // si el hook no está en expansión -> decrementa el timer en time_passed unidades.
        if (!this.expand) {
            this.timer = this.timer - time_passed;
            // Si el timer es < 0 --> to_kill = true
            if (this.timer < 0) {
                this.to_kill = true;
            }
        }

        // si está en expansión y subiendo, incrementar tamaño y posición em increment unidades
        if (this.expand) {
            let increment = Settings.HOOK_SPEED * time_passed;
            this.size.y += increment;
			this.position.y -= increment;

        }

        // si sube hasta arriba, marcarlo para eliminar si es de tipo rope.... 
        // o marcarlo para que quede enganchado si es de tipo chain (reset de size 0 y position altura 0)
        if (this.size.y >= Settings.SCREEN_HEIGHT){
            if (this.hook_type === HookType.rope){
                this.to_kill = true; //this.to_kill
            } else if (this.hook_type === HookType.chain) {
                this.size.y = Settings.SCREEN_HEIGHT;
                this.position.y = 0;
                this.expand = false;
            }
        }
    }

}

export {HookType, Hook};