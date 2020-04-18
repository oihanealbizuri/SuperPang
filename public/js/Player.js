import {Object2D, Vec2D} from "./math.js";
import Settings from "./Settings.js";
import {Hook} from "./Hook.js";
import {loadImage} from "./loaders.js";

const frames = ['buster-1', 'buster-2', 'buster-3'];

export default class Player extends Object2D {

    routeFrame() {
        if (this.direction.x !== 0) {
            const frameIndex = Math.floor(this.distance / 10) % frames.length;
            const frameName = frames[frameIndex];
            return frameName;
        }
        return 'idle';
    }


    constructor(size, pos, spriteSheet) {
        super(size, pos);
        this.force = new Vec2D(0, 0);
        this.spriteSheet = spriteSheet;
        this.direction = new Vec2D(0, 0);
        this.distance = 0;
    }

    setHookManager(hookManager) {
        this.hookManager = hookManager;
    }

    shoot() {
        this.hookManager(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
    }

    killThemAll() {
        for (var i = 0; i < Settings.SCREEN_WIDTH; i += 5) {
            this.hookManager(i, this.position.y + this.size.y/2);
        }
    }


    // time respresenta el tiempo que ha pasado desde la última ejecución
    update(time) {

        if (this.direction.x !== 0) {
            this.distance += Settings.PLAYER_SPEED * time;
        } else {
            this.distance = 0;
        }

        // console.log(this.distance, time);

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
    }

    setPos(pos) { //pos = [x,y]
        this.position.x = pos[0];
        this.position.y = pos[1];
    }

}