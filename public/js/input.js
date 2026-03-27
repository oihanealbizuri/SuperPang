import Keyboard from "./Keyboard.js";

export function setupKeyboard(buster) {
    const input = new Keyboard();

    input.addMapping('ArrowUp', keyState => {
        if (keyState) {
            console.debug('ArrowUp');
        }
    });
    input.addMapping('ArrowDown', keyState => {
        if (keyState) {
            console.debug('ArrowDown');
        }
    });
    input.addMapping('ArrowRight', keyState => {
        if (keyState) {
            console.debug('ArrowRight');
            buster.direction.x++;
        } else {
            buster.direction.x = 0;
        }
    });
    input.addMapping('ArrowLeft', keyState => {
        if (keyState) {
            console.debug('ArrowLeft');
            buster.direction.x--;
        } else {
            buster.direction.x = 0;
        }
    });
    input.addMapping('Space', keyState => {
        if (keyState) {
            console.debug('Space');
            buster.shoot()
        }
    });
    input.addMapping('KeyK', keyState => {
        if (keyState) {
            console.debug('KeyK');
            // Easter egg: super-skill enabled :)
            buster.killThemAll()
        }
    });
    return input;

}
