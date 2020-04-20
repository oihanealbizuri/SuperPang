
export class MusicController {
    constructor() {
        this.soundtrack = new Howl({ src: ['audio/soundtrack.mp3'], loop: true, volume: 0.7 });
        this.bonus_track = new Howl({ src: ['audio/bonus.mp3'] });
        this.gameover = new Howl({ src: ['audio/gameover.mp3'] });
        this.obstacle_pop = new Howl({ src: ['audio/obstacle_pop.mp3'] });
        this.pop = new Howl({ src: ['audio/pop.mp3'] });
        this.shoot_track = new Howl({ src: ['audio/shoot.mp3'] });
        this.start_track = new Howl({ src: ['audio/start.mp3'] });
        this.win = new Howl({ src: ['audio/win.mp3'], sprite: {cut: [0, 1000]} });
    }

    play(event_name) {
        switch (event_name) {
            case "main":
                var id1 = this.soundtrack.play(); // id para control
                break;
            case "bonus":
                this.bonus_track.play();
                break;
            case "end":
                this.gameover.play();
                break;
            case "pang":
                this.obstacle_pop.play();
                break;
            case "pop":
                this.pop.play();
                break;
            case "shoot":
                this.shoot_track.play();
                break;
            case "start":
                this.start_track.play();
                break;
            case "win":
                var id2 = this.win.play('cut');
                break;

        }
    }
}