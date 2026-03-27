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
    loadImage('img/hookChain.png'),
    loadImage('img/backgrounds.png'),
    loadAllBalls(),
    loadImage('img/bonus.png')])
    .then(([playerImage, hookRopeImage, hookChainImage, backgrounds, ballsImage, bonusImage]) => {
        let level = 1;
        let originalLives = Settings.LIVES;
        let drawBackground;
        let balls = new Set();
        const ballFactory = createBallFactory(ballsImage);
        const hooks = new Set();
        const hookManager = loadHookManager(hookRopeImage, hookChainImage, hooks);
        const bonusSet = new Set();
        const bonusFactory = loadBonusFactory(bonusImage);
        const buster = loadBuster(playerImage);
        buster.setHookManager(hookManager);
        const collisionManager = new CollisionManager(hooks, balls, ballFactory, buster, bonusSet, bonusFactory);

        let deltaTime = 0;
        let lastTime = 0;

        let maxTime = Settings.MAX_TIME;

        music.play('main');

        function update(time) {
            if (originalLives === 0 || maxTime < 0) {
                music.soundtrack.unload();
                return;
            }
            deltaTime = time - lastTime;
            drawBackground(context);
            buster.draw(context);
            buster.update(deltaTime / 1000);
            balls.forEach(ball => {
                ball.draw(context);
                ball.update();
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

            context.font = "italic small-caps bold 22px Arial";
            context.fillStyle = "white";
            context.strokeStyle = "black";
            context.lineWidth = 1;
            maxTime = maxTime - (deltaTime / 1000);
            let num = maxTime.toFixed(2);
            context.fillText(num.toString(), 175, 35);
            context.strokeText(num.toString(), 175, 35);

            if (balls.size === 0) {
                hooks.clear();
                startLevel(++level, balls, ballFactory, buster).then(r => {
                    balls = r;
                    buster.level++;
                    drawBackground = loadBackground(backgrounds, level);
                });
                buster.withBonus = false;
                maxTime = Settings.MAX_TIME;
            }

            if (buster.lives !== originalLives) {
                hooks.clear();
                bonusSet.clear();
                startLevel(level, balls, ballFactory, buster).then(r => {
                    balls = r;
                    drawBackground = loadBackground(backgrounds, level);
                });
                originalLives = buster.lives;
                buster.withBonus = false;
                music.play('pang');
                maxTime = maxTime + time / 1000;
            }

            if (originalLives === 0 || maxTime < 0) {
                music.play('end');
            }

            lastTime = time;
            requestAnimationFrame(update);
        }

        const input = setupKeyboard(buster);
        input.listenTo(window);

        startLevel(level, balls, ballFactory, buster).then(r => {
            balls = r;
            buster.level = level;
            drawBackground = loadBackground(backgrounds, level);
            maxTime = Settings.MAX_TIME;
            update(0);
        });

    });
