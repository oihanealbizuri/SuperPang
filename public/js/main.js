import SpriteSheet from "./SpriteSheet.js";
import {loadImage} from "./loaders.js";

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');
// context.fillRect(0,0,50,50);

loadImage('img/sprites.png').then(image => {
    const sprites = new SpriteSheet(image, 32, 32);
    sprites.define('buster', 0, 0);
    sprites.draw('buster', context, 150, 150);
    // context.drawImage(image, 0, 0, 32, 32, 0, 0, 32, 32);
});