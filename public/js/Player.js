import

const frames = ['buster', 'buster-1', 'buster-2', 'buster-3'];

    export default class Player extends Object2D {

        routeFrame(){
            if (this.direction.x !== 0){
                const frameIndex = Math.floor(this.distance / 10) % frames.length;
                const frameName = frames[frameIndex];
                return frameName;
            }
            return 'buster';
        }


    constructor(size, pos, spriteSheet){
        super(size, pos);
        this.force = new Vec2D(0,0);
        this.spriteSheet = spriteSheet;
        this.direction = new Vec2D(0,0);
        this.distance = 0;
    }

    update(time){
            if (this.direction.x !== 0){
                this.distance += Settings.PLAYER_SPEED * time;
            } else {
                this.distance = 0;
            }
    }

}