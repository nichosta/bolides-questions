bolides.createObjects = function() {
    // Making all the bullets used in the program
    bolides.bulletList = [new Bullet(bolides.spaceship), new Bullet(bolides.spaceship), new Bullet(bolides.spaceship)];
    // New asteroids are dynamically generated as the game progresses; that's why there's only one to begin with
    bolides.asteroidList = [new Asteroid()];
}

bolides.initiate = function() {
    // Declare the canvas's context as 2D
    bolides.canvas = document.getElementById('canvas');
    bolides.ctx = bolides.canvas.getContext('2d');
    bolides.canvas.style.display = 'block';
    bolides.menu.container.style.display = 'none';

    // Set the canvas's size
    bolides.canvas.width = window.innerWidth - 4;
    bolides.canvas.height = window.innerHeight - 4;

    // Create assets
    bolides.createObjects();

    // Keydown listeners
    addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            // First case in each statement is for WASD key, second is arrow key
            case 87:
            case 38:
                bolides.keyPresses.up = true;
                break;
            case 65:
            case 37:
                bolides.keyPresses.left = true;
                break;
            case 83:
            case 40:
                bolides.keyPresses.down = true;
                break;
            case 68:
            case 39:
                bolides.keyPresses.right = true;
                break;
                // Space has a special listener because otherwise short presses have no effect
                // Checks for fireability from each bullet
            case 32:
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

    // Keyup listeners
    addEventListener('keyup', function(e) {
        switch (e.keyCode) {
            // First case in each statement is for WASD key, second is arrow key
            case 87:
            case 38:
                bolides.keyPresses.up = false;
                break;
            case 65:
            case 37:
                bolides.keyPresses.left = false;
                break;
            case 83:
            case 40:
                bolides.keyPresses.down = false;
                break;
            case 68:
            case 39:
                bolides.keyPresses.right = false;
                break;
        }
        // No special keyup listeners necessary.
    });
    // Set the spaceship slowdown interval (0.5 speed every half second)
    // Again, this is staying the way it is, even though it's ugly.
    bolides.intervals.slowdownInterval = setInterval(function() {
        if (bolides.spaceship.velocity.x > 0.5 && !bolides.keyPresses.up) {
            bolides.spaceship.velocity.x -= 0.5;
        } else if (bolides.spaceship.velocity.x <= -0.5 && !bolides.keyPresses.up) {
            bolides.spaceship.velocity.x += 0.5;
        } else if (bolides.spaceship.velocity.x < 0.5 && bolides.spaceship.velocity.x > -0.5 && !bolides.keyPresses.up) {
            bolides.spaceship.velocity.x = 0;
        }
        if (bolides.spaceship.velocity.y > 0.5 && !bolides.keyPresses.up) {
            bolides.spaceship.velocity.y -= 0.5;
        } else if (bolides.spaceship.velocity.y <= -0.5 && !bolides.keyPresses.up) {
            bolides.spaceship.velocity.y += 0.5;
        } else if (bolides.spaceship.velocity.y < 0.5 && bolides.spaceship.velocity.y > -0.5 && !bolides.keyPresses.up) {
            bolides.spaceship.velocity.y = 0;
        }
    }, 500);
    // Set the control interval
    bolides.intervals.controlInterval = setInterval(bolides.control, 100);
    // Set the blinking interval
    bolides.intervals.blinkInterval = setInterval(function() {
        if (!bolides.spaceship.isVulnerable && bolides.spaceship.isBlinking) {
            bolides.spaceship.isBlinking = false;
        } else if (!bolides.spaceship.isVulnerable && !bolides.spaceship.isBlinking) {
            bolides.spaceship.isBlinking = true;
        } else if (bolides.spaceship.isVulnerable && bolides.spaceship.isBlinking) {
            bolides.spaceship.isBlinking = false;
        }
    }, 50);

    // Set the image sources
    bolides.images.ship.src = 'images/spaceship.png';
    bolides.images.asteroid.src = 'images/asteroid.png';
    bolides.images.heart.src = 'images/heart.png';
    bolides.images.bullet.src = 'images/bullet.png';
    bolides.images.bolide.src = 'images/bolide.png';

    //Set vital attributes again, just in case
    bolides.spaceship.hearts = 3;
    bolides.spaceship.velocity.x = 0;
    bolides.spaceship.velocity.y = 0;

    // Start looping
    bolides.loop();
}