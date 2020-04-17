import {
    createBallFactory,
    loadBackground,
    loadBalls,
    loadBuster,
    loadHookManager,
    loadImage,
    loadLevel
} from "./loaders.js";
import Settings from "./Settings.js";
import {setupKeyboard} from "./input.js";
import CollisionManager from "./collisions.js";

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Settings.SCREEN_WIDTH = canvas.width;
Settings.SCREEN_HEIGHT = canvas.height;

Promise.all([
    loadImage('img/sprites_filtered.png'),
    loadImage('img/hookRope.png'),
    loadLevel('1'),
    loadImage('img/backgrounds.png'),
    loadImage('img/balls20.png')

])

    .then(([image, hookImage, levelSpec, backgrounds, ballsImage]) => {

        const buster = loadBuster(image, levelSpec.player);
        // const balls = loadBalls(levelSpec.balls);
        const hooks = new Set();
        const hookManager = loadHookManager(hookImage, hooks);
        buster.setHookManager(hookManager);
        const drawBackground = loadBackground(backgrounds);

        const ballFactory = createBallFactory(ballsImage);
        const balls = loadBalls(levelSpec.balls, ballFactory);

        let deltaTime = 0;
        let lastTime = 0;

        function update(time) {
            deltaTime = time - lastTime;
            drawBackground(context);
            buster.draw(context);
            buster.update(deltaTime / 1000);
            balls.forEach((ball) => {
                ball.draw(context);
                ball.update(deltaTime / 1000);
            });
            hooks.forEach((hook) => {
                hook.draw(context);
                hook.update(deltaTime / 1000);
            });
            lastTime = time;

            // let cm = new CollisionManager(hooks, balls);
            // cm.check_collisions();
            const collisionManager = new CollisionManager(hooks, balls, ballFactory);
            collisionManager.check_collisions();

            requestAnimationFrame(update);
        }

        const input = setupKeyboard(buster);
        input.listenTo(window);

        update(0);
    }
);