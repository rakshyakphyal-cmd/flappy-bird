// ==========================================
// ELEMENTS
// ==========================================

const game =
    document.getElementById("game");

const bird =
    document.getElementById("bird");

const scoreText =
    document.getElementById("score");

const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");

const gameOver =
    document.getElementById("gameOver");

const restartButton =
    document.getElementById("restartButton");

const finalScore =
    document.getElementById("finalScore");

const jumpSound =
    document.getElementById("jumpSound");

const music =
    document.getElementById("music");


// ==========================================
// GAME SETTINGS
// ==========================================

const GAME_WIDTH = 600;

const GAME_HEIGHT = 800;

const BIRD_WIDTH = 75;

const BIRD_HEIGHT = 60;

const PIPE_WIDTH = 110;

const PIPE_GAP = 190;

const GRAVITY = 0.5;

const JUMP_POWER = -10;

const PIPE_SPEED = 4;


// ==========================================
// VARIABLES
// ==========================================

let birdY = 350;

let velocity = 0;

let score = 0;

let gameRunning = false;

let pipes = [];

let pipeTimer = null;


// ==========================================
// START GAME
// ==========================================

function startGame() {

    gameRunning = true;

    birdY = 350;

    velocity = 0;

    score = 0;

    scoreText.innerText = "0";

    bird.style.top =
        birdY + "px";


    // Remove old pipes

    pipes.forEach(function(pipe) {

        pipe.top.remove();

        pipe.bottom.remove();

    });

    pipes = [];


    // Hide screens

    startScreen.style.display =
        "none";

    gameOver.style.display =
        "none";


    // Start music

    music.volume = 0.3;

    music.currentTime = 0;

    music.play().catch(function() {

        console.log(
            "Music needs user interaction."
        );

    });


    // Create first pipe

    createPipe();


    // Clear old timer

    if (pipeTimer !== null) {

        clearInterval(pipeTimer);

    }


    // New pipes

    pipeTimer = setInterval(
        function() {

            if (gameRunning) {

                createPipe();

            }

        },
        2000
    );

}


// ==========================================
// JUMP
// ==========================================

function jump() {

    if (!gameRunning) {

        return;

    }


    velocity = JUMP_POWER;


    jumpSound.currentTime = 0;

    jumpSound.volume = 1;

    jumpSound.play().catch(function() {

        console.log(
            "Jump sound unavailable."
        );

    });

}


// ==========================================
// START BUTTON
// ==========================================

startButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        startGame();

    }
);


// ==========================================
// RESTART BUTTON
// ==========================================

restartButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        startGame();

    }
);


// ==========================================
// SPACE KEY
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.code !== "Space") {

            return;

        }

        event.preventDefault();


        if (!gameRunning) {

            startGame();

        }
        else {

            jump();

        }

    }
);


// ==========================================
// MOBILE TOUCH
// ==========================================

game.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();


        if (
            event.target === startButton ||
            event.target === restartButton
        ) {

            return;

        }


        if (!gameRunning) {

            startGame();

        }
        else {

            jump();

        }

    },
    {
        passive: false
    }
);


// ==========================================
// MOUSE
// ==========================================

game.addEventListener(
    "mousedown",
    function(event) {

        if (
            event.target === startButton ||
            event.target === restartButton
        ) {

            return;

        }


        if (gameRunning) {

            jump();

        }

    }
);


// ==========================================
// CREATE PIPE
// ==========================================

function createPipe() {

    const minTop = 100;

    const maxTop = 450;


    const topHeight =
        Math.floor(
            Math.random() *
            (maxTop - minTop)
        ) + minTop;


    const bottomHeight =
        GAME_HEIGHT -
        topHeight -
        PIPE_GAP;


    // ------------------------------
    // TOP PIPE
    // ------------------------------

    const topPipe =
        document.createElement("img");


    topPipe.src =
        "pipe.png";


    topPipe.classList.add(
        "pipe"
    );


    topPipe.style.height =
        topHeight + "px";


    topPipe.style.left =
        GAME_WIDTH + "px";


    topPipe.style.top =
        "0px";


    // ------------------------------
    // BOTTOM PIPE
    // ------------------------------

    const bottomPipe =
        document.createElement("img");


    bottomPipe.src =
        "pipe.png";


    bottomPipe.classList.add(
        "pipe"
    );


    bottomPipe.style.height =
        bottomHeight + "px";


    bottomPipe.style.left =
        GAME_WIDTH + "px";


    bottomPipe.style.bottom =
        "0px";


    // Flip bottom pipe

    bottomPipe.style.transform =
        "rotate(180deg)";


    // Add pipes

    game.appendChild(topPipe);

    game.appendChild(bottomPipe);


    // Save pipe

    pipes.push({

        top: topPipe,

        bottom: bottomPipe,

        x: GAME_WIDTH,

        scored: false

    });

}


// ==========================================
// MOVE PIPES
// ==========================================

function movePipes() {

    for (
        let i = pipes.length - 1;
        i >= 0;
        i--
    ) {

        const pipe = pipes[i];


        pipe.x -= PIPE_SPEED;


        pipe.top.style.left =
            pipe.x + "px";


        pipe.bottom.style.left =
            pipe.x + "px";


        // SCORE

        if (
            !pipe.scored &&
            pipe.x + PIPE_WIDTH < 120
        ) {

            pipe.scored = true;

            score++;

            scoreText.innerText =
                score;

        }


        // REMOVE

        if (
            pipe.x < -PIPE_WIDTH
        ) {

            pipe.top.remove();

            pipe.bottom.remove();

            pipes.splice(i, 1);

        }

    }

}


// ==========================================
// COLLISION
// ==========================================

function collision(
    rect1,
    rect2
) {

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );

}


// ==========================================
// CHECK COLLISION
// ==========================================

function checkCollision() {

    const birdRect =
        bird.getBoundingClientRect();


    // Ground

    if (
        birdY + BIRD_HEIGHT >=
        GAME_HEIGHT
    ) {

        endGame();

        return;

    }


    // Ceiling

    if (birdY <= 0) {

        endGame();

        return;

    }


    // Pipes

    for (const pipe of pipes) {

        const topRect =
            pipe.top.getBoundingClientRect();


        const bottomRect =
            pipe.bottom.getBoundingClientRect();


        if (
            collision(
                birdRect,
                topRect
            )
            ||
            collision(
                birdRect,
                bottomRect
            )
        ) {

            endGame();

            return;

        }

    }

}


// ==========================================
// GAME OVER
// ==========================================

function endGame() {

    gameRunning = false;


    if (pipeTimer !== null) {

        clearInterval(pipeTimer);

        pipeTimer = null;

    }


    music.pause();


    finalScore.innerText =
        score;


    gameOver.style.display =
        "block";

}


// ==========================================
// GAME LOOP
// ==========================================

function gameLoop() {

    if (gameRunning) {

        velocity += GRAVITY;

        birdY += velocity;


        bird.style.top =
            birdY + "px";


        movePipes();


        checkCollision();

    }


    requestAnimationFrame(
        gameLoop
    );

}


// ==========================================
// START LOOP
// ==========================================

gameLoop();
