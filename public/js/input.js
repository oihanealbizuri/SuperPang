import Keyboard from "./Keyboard.js";

export function setupKeyboard(buster) {
    const input = new Keyboard();

    input.addMapping('ArrowUp', keyState => {
        if (keyState) {
            console.log('ArrowUp');
        }
    });
    input.addMapping('ArrowDown', keyState => {
        if (keyState) {
            console.log('ArrowDown');
        }
    });
    input.addMapping('ArrowRight', keyState => {
        if (keyState) {
            console.log('ArrowRight');
            buster.direction.x++;
        } else {
            buster.direction.x = 0;
        }
    });
    input.addMapping('ArrowLeft', keyState => {
        if (keyState) {
            console.log('ArrowLeft');
            buster.direction.x--;
        } else {
            buster.direction.x = 0;
        }
    });
    input.addMapping('Space', keyState => {
        if (keyState) {
            console.log('Space');
        }
    });
    return input;

}