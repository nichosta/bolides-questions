/* jshint esversion: 6, loopfunc: true, unused: false, strict: true, debug: true, globalstrict: true, moz: true, browser: true, devel: true, undef: true */
/* globals Asteroid, Bullet*/
'use strict';
var bolides = {
        // Self explanatory
        level: 1,
        score: 0,
        // The actual canvas element
        canvas: 0,
        // The canvas context (2d in this situation)
        ctx: '',
        // Pause variable
        paused: false,

        // Interval object to store interval ids
        intervals: {
            slowdownInterval: 0,
            controlInterval: 0,
            // Whatever you do, don't blink. Blink and you're dead.
            blinkInterval: 0
        },
        // All the stuff related to the main menu (mostly self explanatory)
        menu: {
            container: document.getElementById('menu'),
            nav: document.getElementsByTagName('nav')[0],
            instructions: document.getElementById('instructions'),
            name: document.getElementById('nameInput'),
            add: document.getElementById('addQuestion'),
            menuStart: function() {
                document.getElementById('playButton').onclick = function() {
                    bolides.initiate();
                    bolides.menu.nav.style.display = 'none';
                    name.style.display = 'block';
                    document.getElementsByClassName('bolide')[0].style.display = 'none';
                };
                document.getElementById('instructionsButton').onclick = function() {
                    bolides.menu.nav.style.display = 'none';
                    bolides.menu.instructions.style.display = 'block';
                };
                bolides.menu.instructions.onclick = function() {
                    bolides.menu.nav.style.display = 'flex';
                    bolides.menu.instructions.style.display = 'none';
                };
                document.getElementById('creditsButton').onclick = function() {
                    bolides.menu.nav.style.display = 'none';
                    bolides.menu.credits.style.display = 'block';
                };
                bolides.menu.credits.onclick = function() {
                    bolides.menu.nav.style.display = 'flex';
                    bolides.menu.credits.style.display = 'none';
                };
            },
            // KeyPress object for storing keypresses
            keyPresses: {
                up: false,
                down: false,
                left: false,
                right: false,
            },
            // Attributes of the player's ship declared
            spaceship: {
                // Starting x and y
                x: 390,
                y: 290,
                // Starting angle
                angle: 0,
                // Starting velocity
                velocity: {
                    x: 0,
                    y: 0
                },
                // Starting health
                hearts: 3,
                // Invincibilty and blink variables
                isVulnerable: true,
                isBlinking: false
            },
            // Images used by the project are created here
            images: {
                ship: document.createElement('img'),
                asteroid: document.createElement('img'),
                heart: document.createElement('img'),
                bullet: document.createElement('img'),
                bolide: document.createElement('img'),
            },
            createObjects: function() {
                // Making all the bullets used in the program
                bolides.bulletList = [new Bullet(bolides.spaceship), new Bullet(bolides.spaceship), new Bullet(bolides.spaceship)];
                // New asteroids are dynamically generated as the game progresses; that's why there's only one to begin with
                bolides.asteroidList = [new Asteroid()];
            },

            // Functions for determining collisions
            // I know they're really ugly, but they're staying the way they are.

            // This function is for asteroid / bullet collisions
            isTouchingBullet: function(bullet, asteroid) {
                return (
                    (Math.pow(Math.abs(bullet.x - (asteroid.x + 31)), 2)) + (Math.pow(Math.abs(bullet.y - (asteroid.y + 31)), 2)) <= 1100) && bullet.isBeingFired;
            },
            // This function is for asteroid / spaceship collisions
            isTouchingSpaceship: function(spaceship, asteroid) {
                return (Math.pow(Math.abs(spaceship.x + 18 - (asteroid.x + 31)), 2) + Math.pow(Math.abs(spaceship.y + 31 - (asteroid.y + 31)), 2) <= 1300);
            },
            // Start all the stuff
            initiate: function() {
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
            },

            gameOver: function() {
                // Clear the screen
                bolides.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                // Set the game over menu style
                bolides.ctx.font = '48px Arcade';
                bolides.ctx.fillStyle = 'white';
                // Draw the game over menu
                bolides.ctx.fillText('Game Over', window.innerWidth / 2 - window.innerWidth / 6, window.innerHeight / 2 - 50);
                // All this code was done on an 11-inch Macbook, so it probably looks awful on other computers.
                // Oh well.
                bolides.ctx.fillRect(window.innerWidth / 2 - window.innerWidth / 6, window.innerHeight / 2 - 26, 420, 60);
                bolides.ctx.fillStyle = 'black';
                // Draw the restart button
                bolides.ctx.fillText('Restart', window.innerWidth / 2 - window.innerWidth / 6 + 30, window.innerHeight / 2 + 25);
                addEventListener('click', function(e) {
                    if (((window.innerWidth / 2 - window.innerWidth / 6 < e.clientX) && (e.clientX < window.innerWidth / 2 - window.innerWidth / 6 + 420)) && ((window.innerHeight / 2 - 26 < e.clientY) && (e.clientY < window.innerHeight / 2 + 34))) {
                        // Basically reloads the page
                        window.location = window.location;
                    }
                });
                // Yes I did just do that
                // Draw in the final level and score
                bolides.ctx.fillStyle = 'white';
                bolides.ctx.fillText('Score: ' + bolides.score, window.innerWidth / 2 - window.innerWidth / 6, window.innerHeight / 2 + 90);
                bolides.ctx.fillText('Level: ' + bolides.level, window.innerWidth / 2 - window.innerWidth / 6, window.innerHeight / 2 + 150);
                // Remove all the intervals from the game
                // I'm not sure this actually matters, I just wanted to be thorough.
                clearInterval(bolides.intervals.slowdownInterval);
                clearInterval(bolides.intervals.controlInterval);
                clearInterval(bolides.intervals.blinkInterval);
                // Reruns the program every time the window gets resized
                // This makes sure the whole thing looks nice all the time
                addEventListener('resize', bolides.gameOver);
            },

            // Pause function
            // Handles both pausing and unpausing
            pause: function() {
                // Unpausing
                if (bolides.paused) {
                    bolides.paused = false;
                    bolides.intervals.controlInterval = setInterval(bolides.control, 100);
                    bolides.loop();
                    // Pausing
                } else if (!bolides.paused) {
                    bolides.paused = true;
                    // I get rid of the control interval so you can't move while it's paused
                    clearInterval(bolides.intervals.controlInterval);
                }
            },

            // Loop
            loop: function() {
                // Is the player out of health?
                if (bolides.spaceship.hearts <= 0) {
                    // Then display 'Game over'
                    bolides.gameOver();
                } else {
                    // No? Then move and draw everything, then loop again.
                    // PS: also resize the canvas, just in case
                    bolides.canvas.width = window.innerWidth - 4;
                    bolides.canvas.height = window.innerHeight - 4;
                    bolides.move();
                    bolides.draw();
                    // Get the next frame
                    if (!bolides.paused) {
                        requestAnimationFrame(bolides.loop);
                    }
                }
            },
            control: function() {
                // Up key or W key?
                // Does several formulas to make sure you can speed up (there's a max speed)
                // This is real ugly
                if (bolides.keyPresses.up) {
                    if (bolides.spaceship.velocity.x > 10) {
                        if (Math.sin(bolides.spaceship.angle) < 0) {
                            bolides.spaceship.velocity.x += Math.sin(bolides.spaceship.angle);
                        }
                    }
                    if (bolides.spaceship.velocity.y > 10) {
                        if (-Math.cos(bolides.spaceship.angle) < 0) {
                            bolides.spaceship.velocity.y += -Math.cos(bolides.spaceship.angle);
                        }
                    }
                    if (bolides.spaceship.velocity.x < -10) {
                        if (Math.sin(bolides.spaceship.angle) > 0) {
                            bolides.spaceship.velocity.x += Math.sin(bolides.spaceship.angle);
                        }
                    }
                    if (bolides.spaceship.velocity.y < -10) {
                        if (-Math.cos(bolides.spaceship.angle) > 0) {
                            bolides.spaceship.velocity.y += -Math.cos(bolides.spaceship.angle);
                        }
                    }
                    if ((bolides.spaceship.velocity.x > -10 && bolides.spaceship.velocity.x < 10) && (bolides.spaceship.velocity.y > -10 && bolides.spaceship.velocity.y < 10)) {
                        bolides.spaceship.velocity.x += Math.sin(bolides.spaceship.angle);
                        bolides.spaceship.velocity.y += -Math.cos(bolides.spaceship.angle);
                    }
                }
                // Down key does nothing, atm (may change), but still has a handler
                // Left key or A key?
                if (bolides.keyPresses.left) {
                    // Then change its angle by 20 degrees over 1/10 second
                    // This animation (and the right one, below) is added to smoothen turning
                    var leftInterval = setInterval(() => bolides.spaceship.angle -= (Math.PI / 180) * 6, 20);
                    setTimeout(() => clearInterval(leftInterval), 100);
                }
                // Right key or D key?
                if (bolides.keyPresses.right) {
                    // Then change its angle by -20 degrees over 1/10 second
                    var rightInterval = setInterval(() => bolides.spaceship.angle += (Math.PI / 180) * 6, 20);
                    setTimeout(() => clearInterval(rightInterval), 100);
                }
            },

            move: function() { // Not just moving, more like "logic()"
                // Level up
                if (bolides.level * 100 <= bolides.score) {
                    // Remove score
                    bolides.score = 0;
                    // Increase level
                    bolides.level++;
                    // Create a new asteroid
                    bolides.asteroidList.push(new Asteroid());
                }
                // Ship Math
                bolides.spaceship.x += bolides.spaceship.velocity.x;
                bolides.spaceship.y += bolides.spaceship.velocity.y;
                // Side warps
                if (bolides.spaceship.x <= -25) {
                    bolides.spaceship.x = window.innerWidth;
                } else if (bolides.spaceship.x >= window.innerWidth) {
                    bolides.spaceship.x = 0;
                }
                if (bolides.spaceship.y >= window.innerHeight + 30) {
                    bolides.spaceship.y = 0;
                } else if (bolides.spaceship.y <= -30) {
                    bolides.spaceship.y = window.innerHeight;
                }
                // If accelerating
                if (bolides.keyPresses.up && bolides.spaceship.isVulnerable) {
                    // Use the moving ship pic.
                    bolides.images.ship.src = 'images/spaceship-move.png';
                } else {
                    bolides.images.ship.src = 'images/spaceship.png';
                }
                bolides.bulletList.forEach((bullet, index) => {
                    // Stop bullet
                    if (!bullet.isBeingFired) {
                        bullet.x = window.innerWidth(-65 + (15 * index));
                        bullet.y = 35;
                        bullet.angle = 0;
                        bullet.speed = 10;
                        bullet.isCooling = false;
                    } else {
                        // Bullet movement math
                        bullet.direction.x = Math.sin(bullet.angle);
                        bullet.direction.y = -Math.cos(bullet.angle);
                        bullet.x += bullet.direction.x * bullet.speed;
                        bullet.y += bullet.direction.y * bullet.speed;
                    }
                    // Bullet cooldown times
                    if (bullet.x <= -25 && !bullet.isCooling) {
                        bullet.isCooling = true;
                        setTimeout(() => {
                            bullet.isBeingFired = false;
                        }, 1000);
                    } else if (bullet.x >= window.innerWidth && !bullet.isCooling) {
                        bullet.isCooling = true;
                        setTimeout(() => {
                            bullet.isBeingFired = false;
                        }, 1000);
                    }
                    if (bullet.y >= window.innerHeight + 30 && !bullet.isCooling) {
                        bullet.isCooling = true;
                        setTimeout(() => bullet.isBeingFired = false, 1000);
                    } else if (bullet.y <= 0 && !bullet.isCooling) {
                        bullet.isCooling = true;
                        setTimeout(() => bullet.isBeingFired = false, 1000);
                    }
                });
                // Asteroid movement math
                // Dynamic number of asteroids => Use forEach on asteroid list
                // Fun fact: At least 5 times while coding this, I encountered a bug due to typing 'asteroid' as 'asteriod'
                // Also 'bolides' as 'boldies' or 'boildes'
                // Anyway, a good chunk of this math is exactly the same as what the spaceship has.
                bolides.asteroidList.forEach((asteroid) => {
                    // Choose where the asteroid comes from, its angle, and whether or not it's a bolide.
                    if (Math.random() < 0.5 && !asteroid.isInMotion) {
                        asteroid.isBolide = Math.random() < 0.05;
                        asteroid.x = (Math.random() * (window.innerWidth + 100) + 50);
                        asteroid.y = -50;
                        asteroid.angle = Math.random() * 2.9670597283903604 + 1.6580627893946132;
                        asteroid.isInMotion = true;
                    } else if (!asteroid.isInMotion) {
                        asteroid.isBolide = Math.random() < 0.05; // 5% chance
                        asteroid.x = window.innerWidth + 50;
                        asteroid.y = Math.random() * (window.innerHeight - 50) + 50;
                        asteroid.angle = Math.random() * 2.9670597283903604 + 3.2288591161895095;
                        asteroid.isInMotion = true;
                    }
                    asteroid.direction.x = Math.sin(asteroid.angle);
                    asteroid.direction.y = -Math.cos(asteroid.angle);
                    asteroid.x += asteroid.direction.x * asteroid.speed;
                    asteroid.y += asteroid.direction.y * asteroid.speed;
                    // Asteroid stopping
                    if (asteroid.x <= -60) {
                        asteroid.isInMotion = false;
                    } else if (asteroid.x >= window.innerWidth + 60) {
                        asteroid.isInMotion = false;
                    }
                    if (asteroid.y >= window.innerHeight + 60) {
                        asteroid.isInMotion = false;
                    } else if (asteroid.y <= -50) {
                        asteroid.isInMotion = false;
                    }
                });
                // Collision detection (spaceship x asteroid)
                bolides.asteroidList.forEach((asteroid) => {
                    if (bolides.isTouchingSpaceship(bolides.spaceship, asteroid) && bolides.spaceship.isVulnerable) {
                        bolides.spaceship.hearts -= 1;
                        bolides.spaceship.x = window.innerWidth / 2 - 18;
                        bolides.spaceship.y = window.innerHeight / 2 - 31;
                        bolides.spaceship.isVulnerable = false;
                        setTimeout(function() {
                            bolides.spaceship.isVulnerable = true;
                        }, 2000);
                    }
                });
                // Collision detection (bullets x asteroid)
                bolides.bulletList.forEach((bullet) => {
                    bolides.asteroidList.forEach((asteroid) => {
                        if (bolides.isTouchingBullet(bullet, asteroid)) {
                            asteroid.isInMotion = false;
                            bullet.isBeingFired = false;
                            bolides.score += asteroid.isBolide ? 500 : 100;
                        }
                    });
                });
            },

            // The whole drawing function
            draw: function() {
                // Clear the canvas
                bolides.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                // HUD Style
                bolides.ctx.fillStyle = 'white';
                bolides.ctx.font = '24px Arcade';
                // Draw level word
                bolides.ctx.fillText('Level: ' + bolides.level, 10, window.innerHeight - 20);
                // Draw score
                bolides.ctx.fillText('Score: ' + bolides.score, window.innerWidth - 250, window.innerHeight - 20);
                // Check for the number of hearts and draw that many
                for (var i = 1; i <= bolides.spaceship.hearts; i++) {
                    bolides.ctx.drawImage(bolides.images.heart, (i - 1) * 30 + 5, 15);
                }
                bolides.asteroidList.forEach((asteroid) => {
                    // If the asteroid is a bolide
                    if (asteroid.isBolide) {
                        // Make sure it's facing the right way
                        bolides.ctx.save();
                        bolides.ctx.translate(asteroid.x + 31, asteroid.y + 31);
                        bolides.ctx.rotate(asteroid.angle);
                        bolides.ctx.drawImage(bolides.images.bolide, -31, -31, 62, 154);
                        bolides.ctx.restore();
                    } else {
                        // Otherwise you can just draw it normally, no one will notice
                        bolides.ctx.drawImage(bolides.images.asteroid, asteroid.x, asteroid.y, 62, 62);
                    }
                });
                bolides.bulletList.forEach((bullet) => {
                    bolides.ctx.save();
                    bolides.ctx.translate(bullet.x + 3, bullet.y - 12.5);
                    bolides.ctx.rotate(bullet.angle);
                    bolides.ctx.drawImage(bolides.images.bullet, -3, -12.5);
                    // Restore again
                    bolides.ctx.restore();
                });
                // Spaceship last so it gets drawn over other things
                if (!bolides.spaceship.isBlinking) {
                    // Save its state
                    bolides.ctx.save();
                    // Set the origin to the ship's center
                    bolides.ctx.translate(bolides.spaceship.x + 18, bolides.spaceship.y + 31);
                    // Rotate the ship around the center by the angle of the ship
                    bolides.ctx.rotate(bolides.spaceship.angle);
                    // Draw the ship
                    bolides.ctx.drawImage(bolides.images.ship, -18, -31, 36, 74);
                    // Restore to normal
                    bolides.ctx.restore();
                }
            }
        }
    }
    // That's it! Just start the menu now.
bolides.menu.menuStart();