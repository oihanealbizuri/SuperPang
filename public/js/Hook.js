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

    draw(ctx) {
        if (this.hook_type === HookType.rope) {
            ctx.drawImage(this.buffer, this.position.x, this.position.y);
        } else {
            ctx.drawImage(this.bufferChain, this.position.x, this.position.y);
        }
    }

    update(time_passed) {
        if (!this.expand) {
            this.timer = this.timer - time_passed;
            if (this.timer < 0) {
                this.to_kill = true;
            }
        }

        if (this.expand) {
            let increment = Settings.HOOK_SPEED * time_passed;
            this.size.y += increment;
            this.position.y -= increment;
        }

        if (this.size.y >= Settings.SCREEN_HEIGHT) {
            if (this.hook_type === HookType.rope) {
                this.to_kill = true;
            } else if (this.hook_type === HookType.chain) {
                this.size.y = Settings.SCREEN_HEIGHT;
                this.position.y = 0;
                this.expand = false;
            }
        }
    }

}

export {HookType, Hook};
