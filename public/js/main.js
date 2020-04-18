import {
    createBallFactory, loadAllBalls,
    loadBackground,
    loadBuster,
    loadHookManager,
    loadImage,
    startLevel
} from "./loaders.js";
import Settings from "./Settings.js";
import {setupKeyboard} from "./input.js";
import {CollisionManager} from "./collisions.js";

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');
Settings.SCREEN_HEIGHT = canvas.height;
Settings.SCREEN_WIDTH = canvas.width;


Promise.all([
    loadImage('img/player.png'),
    loadImage('img/hookRope.png'),
    loadImage('img/backgrounds.png'),
    loadAllBalls()])
    .then(([playerImage, hookImage, backgrounds, ballsImage]) => {
        let level = 1;
        let drawBackground;
        const ballFactory = createBallFactory(ballsImage);
        let balls = new Set();
        const hooks = new Set();
        const hookManager = loadHookManager(hookImage, hooks);
        const buster = loadBuster(playerImage);
        buster.setHookManager(hookManager);
        const collisionManager = new CollisionManager(hooks, balls, ballFactory, buster);

        let deltaTime = 0;
        let lastTime = 0;

        function update(time) {
            deltaTime = time - lastTime;
            drawBackground(context);
            buster.draw(context);
            buster.update(deltaTime / 1000);
            balls.forEach(ball => {
                ball.draw(context);
                ball.update(deltaTime / 1000);
            });
            hooks.forEach(hook => {
                    hook.draw(context);
                    hook.update(deltaTime / 1000);
                }
            );
            collisionManager.balls = balls;
            collisionManager.hooks = hooks;
            collisionManager.check_collisions();

            if (balls.size === 0) {
                hooks.clear();
                startLevel(++level, balls, ballFactory, buster).then(r => {
                    balls = r;
                    drawBackground = loadBackground(backgrounds, level);
                });
            }

            lastTime = time;
            requestAnimationFrame(update);
        }

        const input = setupKeyboard(buster);
        input.listenTo(window);

        startLevel(level, balls, ballFactory, buster).then(r => {
            balls = r;
            drawBackground = loadBackground(backgrounds, level);
            update(0);
        });


    });
