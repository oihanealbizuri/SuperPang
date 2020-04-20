import SpriteSheet from "./SpriteSheet.js";
import {Vec2D} from "./math.js";
import Player from "./Player.js";
import {Ball} from "./Ball.js";
import {Hook} from "./Hook.js";
import Settings from "./Settings.js";
import {Bonus, BonusType} from "./Bonus.js";
import {MusicController} from "./MusicController.js";

export function loadLevel(currentLevel) {
    if (currentLevel > 1) {
        var music = new MusicController();
        music.play('win');
    }
    return fetch(`levels/${currentLevel}.json`).then(r => r.json());
}

export function startLevel(level, balls, ballFactory, buster) {

       return loadLevel(level)
            .then(levelSpec => Promise.all([
                levelSpec,
                loadBalls(levelSpec.balls, ballFactory),
                // loadBalls(balls, ballFactory),
            ]))
            .then(([levelSpec, ballsList]) => {
                buster.setPos(levelSpec.player.pos);
                balls = ballsList;
                return balls;
            })
}

export function loadAllBalls() { // cargar todas las imagenes y devolverlas en una
    // let ballsList;
    // Promise.all([
    //     loadImage('img/balls40.png'),
    //     loadImage('img/balls20.png'),
    //     loadImage('img/balls10.png'),
    //     loadImage('img/balls5.png')])
    //     .then([b40, b20, b10, b5].forEach(img => {
    //             loadBalls(img, )
    //         })
    //     )
    return loadImage('img/balls20.png');
}

export function loadBalls(balls, ballFactory) { //json de balls + ballFactory
    let ballsList = new Set();
    balls.forEach(ball => {
        let position = new Vec2D(ball.pos[0], ball.pos[1]);
        let force = new Vec2D(ball.force[0], ball.force[1]);
        ballsList.add(ballFactory(ball.radius, position, force, ball.color));
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

export function loadBuster(image) {
    const spriteSheet = new SpriteSheet(image, 32, 32);
    spriteSheet.define('idle', 4, 0);
    spriteSheet.define('buster-1', 1, 0);
    spriteSheet.define('buster-2', 2, 0);
    spriteSheet.define('buster-3', 0, 0);
    spriteSheet.define('lives', 8, 0);

    // const pos = new Vec2D(playerSpec.pos[0], playerSpec.pos[1]);
    // crear siempre en posición fija y luego cambiar
    const pos = new Vec2D(184, 253);
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

export function loadBackground(backgrounds, level) {
    const buffer = document.createElement('canvas');
    buffer.width = 256;
    buffer.height = 192;
    // recortar super-sprite y dejarlo preparado en un buffer
    const context = buffer.getContext("2d");
    context.drawImage(backgrounds, (level - 1)*buffer.width, 0, buffer.width, buffer.height, 0, 0, buffer.width, buffer.height,);
    return function (ctx) {
        ctx.drawImage(buffer, 0, 0, buffer.width, buffer.height, 0, 0, Settings.SCREEN_WIDTH, Settings.SCREEN_HEIGHT);
    }
}

export function createBallFactory(ballsImage) {
    const spriteSheet = new SpriteSheet(ballsImage, 48, 40);
    spriteSheet.define('red40', 0, 0);
    spriteSheet.define('blue40', 1, 0);
    spriteSheet.define('green40', 2, 0);
    spriteSheet.define('red20', 0, 0);
    spriteSheet.define('blue20', 1, 0);
    spriteSheet.define('green20', 2, 0);
    spriteSheet.define('red10', 0, 0);
    spriteSheet.define('blue10', 1, 0);
    spriteSheet.define('green10', 2, 0);
    spriteSheet.define('red5', 0, 0);
    spriteSheet.define('blue5', 1, 0);
    spriteSheet.define('green5', 2, 0);
    return function (radius, pos, force, color) {
        let sprite = `${color}${radius}`;
        return new Ball(radius, pos, force, spriteSheet.get(sprite), color);
    }
}

export function loadBonusFactory(bonusImage) {
    const spriteSheet = new SpriteSheet(bonusImage, 20, 20);
    spriteSheet.define('bonus-1', 0, 0);
    spriteSheet.define('bonus-2', 1, 0);
    spriteSheet.define('bonus-3', 2, 0);
    spriteSheet.define('bonus-4', 3, 0);
    spriteSheet.define('bonus-5', 4, 0);
    spriteSheet.define('bonus-6', 5, 0);
    spriteSheet.define('bonus-7', 6, 0);
    spriteSheet.define('bonus-8', 7, 0);
    spriteSheet.define('bonus-9', 8, 0);
    return function (position) {
        let type = BonusType.chain_hook;
        let sprite = 'bonus-3'; // gancho con anclaje
        return new Bonus(position, type, spriteSheet.get(sprite));
    }
}