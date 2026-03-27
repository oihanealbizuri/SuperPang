import {Object2D, Vec2D} from "./math.js";
import Settings from "./Settings.js";
import {MusicController} from "./MusicController.js";

const frames = ['buster-1', 'buster-2', 'buster-3'];

export default class Player extends Object2D {

    routeFrame() {
        if (this.direction.x !== 0) {
            const frameIndex = Math.floor(this.distance / 10) % frames.length;
            return frames[frameIndex];
        }
        return 'idle';
    }

    constructor(size, pos, spriteSheet) {
        super(size, pos);
        this.force = new Vec2D(0, 0);
        this.spriteSheet = spriteSheet;
        this.direction = new Vec2D(0, 0);
        this.distance = 0;
        this.withBonus = false;
        this.musicController = new MusicController();
        this.lives = Settings.LIVES;
    }

    setHookManager(hookManager) {
        this.hookManager = hookManager;
    }

    shoot() {
        if (this.withBonus) {
            this.hookManager(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, 1);
        } else {
            this.hookManager(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, 0);
        }
        this.musicController.play('shoot');
    }

    killThemAll() {
        const y = this.position.y + this.size.y / 2; // bottom start
        const spacing = Settings.SCREEN_WIDTH / Settings.MAX_HOOKS; // spread hooks evenly
        let i = 0;

        const interval = setInterval(() => {
            const x = spacing / 2 + i * spacing; // center each hook in its segment
            this.hookManager(x, y, 0);
            i++;

            if (i >= Settings.MAX_HOOKS) {
                clearInterval(interval);
            }
        }, 200); // delay between hooks so they appear one by one
    }

    oneLiveLess() {
        this.lives -= 1;
        this.withBonus = false;
    }

    // time respresenta el tiempo que ha pasado desde la última ejecución
    update(time) {
        if (this.direction.x !== 0) {
            this.distance += Settings.PLAYER_SPEED * time;
        } else {
            this.distance = 0;
        }

        /*
        Asume por el momento que Settings.SCREEN_HEIGHT y Settings.SCREEN_WIDTH indican el tamaño de
        la pantalla del juego. Settings tiene otras constantes definidas (échales un vistazo)
        El objeto player tiene una altura (height) y una anchura (width)
        */


        // si buster está cayendo (está por debajo de la altura de la pantalla)
        // fuerza = añadir fuerza vertical de gravedad * tiempo
        // position = añadir fuerza * tiempo al eje y
        if (this.position.y < Settings.SCREEN_HEIGHT) {
            this.force.y += Settings.GRAVITY * time;
            this.position.y += this.force.y * time;
        }

        // position = añadir dirección * tiempo * velocidad del jugador al eje x
        this.position.x += this.direction.x * time * Settings.PLAYER_SPEED;


        // si buster se sale por la izquierda de la pantalla
        // position = 0,y
        // sino, si buster se sale por la derecha
        // position =  lo más a la derecha sin salirse , y
        if (this.position.x < Settings.MARGIN) {
            this.position.x = Settings.MARGIN;
        } else if (this.position.x > Settings.SCREEN_WIDTH - this.width - Settings.MARGIN) {
            this.position.x = Settings.SCREEN_WIDTH - this.width - Settings.MARGIN;
        }


        // si buster se sale por la parte inferior de la pantalla
        // position = x, lo más abajo sin salirse
        if (this.position.y > Settings.SCREEN_HEIGHT - this.height - Settings.MARGIN) {
            this.position.y = Settings.SCREEN_HEIGHT - this.height - Settings.MARGIN;
        }

        if (this.direction.x !== 0) {
            this.distance += Settings.PLAYER_SPEED * time;
        } else {
            this.distance = 0;
        }
    }

    draw(context) {
        // pintar this.sprite en el contexto (en posicion x,y)
        context.drawImage(this.spriteSheet.get(this.routeFrame(), this.direction.x), this.position.x, this.position.y);
        context.drawImage(this.spriteSheet.get('lives'), 332, 15, 20, 20);
        context.font = "italic small-caps bold 18px Arial";
        context.fillStyle = "white";
        context.fillText(" x " + this.lives, 352, 30);
        context.font = "italic small-caps bold 15px Arial";
        context.fillStyle = "red";
        context.fillText("Level " + this.level, 332, 50);
    }

    setPos(pos) {
        this.position.x = pos[0];
        this.position.y = pos[1];
    }

}
