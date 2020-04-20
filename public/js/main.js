import {
    createBallFactory, loadAllBalls,
    loadBackground, loadBonusFactory,
    loadBuster,
    loadHookManager,
    loadImage,
    startLevel
} from "./loaders.js";
import Settings from "./Settings.js";
import {setupKeyboard} from "./input.js";
import {CollisionManager} from "./collisions.js";
import {MusicController} from "./MusicController.js";

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');
Settings.SCREEN_HEIGHT = canvas.height;
Settings.SCREEN_WIDTH = canvas.width;

const music = new MusicController();


Promise.all([
    loadImage('img/player.png'),
    loadImage('img/hookRope.png'),
    loadImage('img/backgrounds.png'),
    loadAllBalls(),
    loadImage('img/bonus.png')])
    .then(([playerImage, hookImage, backgrounds, ballsImage, bonusImage]) => {
        let level = 1;
        let drawBackground;
        let balls = new Set();
        const ballFactory = createBallFactory(ballsImage);
        const hooks = new Set();
        const hookManager = loadHookManager(hookImage, hooks);
        const bonusSet = new Set();
        const bonusFactory = loadBonusFactory(bonusImage);
        const buster = loadBuster(playerImage);
        buster.setHookManager(hookManager);
        const collisionManager = new CollisionManager(hooks, balls, ballFactory, buster, bonusSet, bonusFactory);

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
            });
            bonusSet.forEach(bonus => {
                bonus.draw(context);
                bonus.update(deltaTime / 1000);
            });
            collisionManager.balls = balls;
            collisionManager.hooks = hooks;
            collisionManager.bonuses = bonusSet;
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
