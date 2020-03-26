import SpriteSheet from "./SpriteSheet.js";
import {Vec2D} from "./math.js";
import Player from "./Player.js";
import {Ball} from "./Ball.js";
import {Hook} from "./Hook.js";
import Settings from "./Settings.js";

export function loadLevel(currentLevel) {
    return fetch(`levels/${currentLevel}.json`).then(r => r.json());
}

export function loadBalls(balls) {
    let ballsList = new Set();
    balls.forEach(ball => {
        let position = new Vec2D(ball.pos[0], ball.pos[1]);
        let force = new Vec2D(ball.force[0], ball.force[1]);
        ballsList.add(new Ball(ball.radius, position, force));
    });
    return ballsList;
}

export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    })
}

export function loadBuster(image, playerSpec) {
    const spriteSheet = new SpriteSheet(image, 32, 32);
    spriteSheet.define('idle', 4, 0);
    spriteSheet.define('buster-1', 1, 0);
    spriteSheet.define('buster-2', 2, 0);
    spriteSheet.define('buster-3', 0, 0);

    const pos = new Vec2D(playerSpec.pos[0], playerSpec.pos[1]);
    const size = new Vec2D(32, 32);

    return new Player(size, pos, spriteSheet);
}

export function loadHookManager(image, hooks) {
    let hookManager = function (x, y) {
        if (hooks.size < Settings.MAX_HOOKS) {
            let position = new Vec2D(x, y);
            hooks.add(new Hook(0, position, 0, image));
        }
    };
    return hookManager;
}

export function loadBackground(backgrounds) {
    const buffer = document.createElement('canvas');
    buffer.width = 256;
    buffer.height = 192;
    // recortar super-sprite y dejarlo preparado en un buffer
    const context = buffer.getContext("2d");
    context.drawImage(backgrounds, 0, 0, buffer.width, buffer.height, 0, 0, buffer.width, buffer.height,);
    return function (ctx) {
        ctx.drawImage(buffer, 0, 0, buffer.width, buffer.height, 0, 0, Settings.SCREEN_WIDTH, Settings.SCREEN_HEIGHT);
    }
}