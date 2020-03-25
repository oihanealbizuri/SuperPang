import SpriteSheet from "./SpriteSheet.js";
import {Vec2D} from "./math.js";
import Player from "./Player.js";
import {Ball} from "./Ball.js";
import {Hook} from "./Hook.js";

export function loadLevel(currentLevel) {
    return fetch(`levels/${currentLevel}.json`).then(r => r.json());
}

export function loadBalls(balls) {
    let ballsList = [];
    balls.forEach(ball => {
        let position = new Vec2D(ball.pos[0], ball.pos[1]);
        let force = new Vec2D(ball.force[0], ball.force[1]);
        ballsList.push(new Ball(ball.radius, position, force));
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
    spriteSheet.define('buster', 1, 0);
    spriteSheet.define('buster-1', 2, 0);
    spriteSheet.define('buster-2', 3, 0);
    spriteSheet.define('buster-3', 0, 0);

    const pos = new Vec2D(playerSpec.pos[0], playerSpec.pos[1]);
    const size = new Vec2D(32, 32);

    return new Player(size, pos, spriteSheet);
}

export function loadHookManager(image, hooks) {
    let hookManager = function (x, y) {
        let position = new Vec2D(x, y);
        hooks.push(new Hook(0, position, 0, image));
    };
    return hookManager;
}