/* 
    This file contains all the functions that start up the game.
    They are kept apart to ensure readability and to clear up clutter in the main program file.
*/

function createObjects() {
    // Making all the bullets used in the program
    bolides.bulletList = [new Bullet(bolides.spaceship), new Bullet(bolides.spaceship), new Bullet(bolides.spaceship)];

    // New asteroids are dynamically generated as the game progresses; that's why there's only one to begin with
    bolides.asteroidList = [new Asteroid()];
}

// Long function used to initialize the majority of the game (run after leaving the starting menu)
function initiate() {

    // Reference canvas element and get its 2d context
    canvas.element = document.getElementById('canvas');
    canvas.ctx = canvas.element.getContext('2d');

    // Show the canvas and hide the menu
    canvas.element.style.display = 'block';
    menu.container.style.display = 'none';

    // Set the canvas's size based on the browser window's size
    canvas.element.width = window.innerWidth - 4;
    canvas.element.height = window.innerHeight - 4;

    // Create assets (see above)
    createObjects();

    // Keydown listeners for program control
    addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            // First case in each statement is for WASD key, second is arrow key
            case 87: // W
            case 38: // Up arrow
                keyPresses.up = true;
                break;
            case 65: // A
            case 37: // Left Arrow
                keyPresses.left = true;
                break;
            case 83: // S
            case 40: // Down Arrow
                keyPresses.down = true;
                break;
            case 68: // D
            case 39: // Right Arrow
                keyPresses.right = true;
                break;
            case 32:
            // Space has a special listener so that only down presses are registered, and only once
            // Fires the first bullet available and breaks
                for (let i = 0; i < bolides.bulletList.length; i++) {
                    if (!bolides.bulletList[i].isBeingFired) {
                        bolides.bulletList[i].fire();
                        break;
                    }
                }
                break;
            case 80: // P
                bolides.pause();
                break;
            default:
                break;
        }
    });

    // Keyup listeners (same values as above)
    addEventListener('keyup', function(e) {
        switch (e.keyCode) {
            case 87:
            case 38:
                keyPresses.up = false;
                break;
            case 65:
            case 37:
                keyPresses.left = false;
                break;
            case 83:
            case 40:
                keyPresses.down = false;
                break;
            case 68:
            case 39:
                keyPresses.right = false;
                break;
        }
        // No special keyup listeners necessary.
    });

    // Set the spaceship slowdown interval (0.5 speed every half second)
    bolides.intervals.slowdownInterval = setInterval(bolides.slowdown, 500);

    // Set the control interval (check keys being held every tenth of a second)
    bolides.intervals.controlInterval = setInterval(bolides.control, 100);

    // Set the blinking interval (change ship's visibility every twentieth of a second)
    bolides.intervals.blinkInterval = setInterval(bolides.blink, 50);

    // Set the base image sources (see 'images' folder)
    bolides.images.ship.src = 'images/spaceship.png';
    bolides.images.asteroid.src = 'images/asteroid.png';
    bolides.images.heart.src = 'images/heart.png';
    bolides.images.bullet.src = 'images/bullet.png';
    bolides.images.bolide.src = 'images/bolide.png';

    // Start looping
    bolides.loop();
}