
let game = {
    square: 0,
    fall: 0,
    board: {
        obj: null,
        def_width: 0,
        def_height: 0
    },
    context: null,
    greenSquares: {
        objLeft: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        },
        objRight: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        },
        def_x: 0,
        def_y: 0,
        def_width: 0,
        def_height: 0,
        img: null,
        vX: 0,
        vY: 0
    },
    whiteSquares: {
        obj_array: [],
        def_x: 0,
        def_y: 0,
        def_width: 0,
        def_height: 0,
        img: null,
        vY: 0,
        vX: 0
    },
    start: {
        margin: 0,
        obj_array: [],
        def_x: 0,
        def_y: 0,
        def_width: 0,
        def_height: 0,
        img: null,
        vX: 0,
        vY: 0,
    },
    score: 0,
    gameOver: false
}

window.onload = function () {

    game.square = 24;
    game.fall = 2.5;

    game.board.def_width = game.square * 15; //360
    game.board.def_height = 640;
    game.board.obj = document.getElementById("board");
    game.board.obj.height = game.board.def_height;
    game.board.obj.width = game.board.def_width;

    game.context = game.board.obj.getContext("2d");

    game.greenSquares.def_width = game.square;
    game.greenSquares.def_height = game.square;
    game.greenSquares.def_x = 4 * game.square;
    game.greenSquares.def_y = game.board.def_height / 2;
    game.greenSquares.vX = 0;
    game.greenSquares.vY = 0;

    game.greenSquares.objLeft.x = game.greenSquares.def_x;
    game.greenSquares.objLeft.y = game.greenSquares.def_y;
    game.greenSquares.objLeft.width = game.greenSquares.def_width;
    game.greenSquares.objLeft.height = game.greenSquares.def_height;

    game.greenSquares.objRight.x = game.greenSquares.def_x + (1 + 5) * game.square;
    game.greenSquares.objRight.y = game.greenSquares.def_y;
    game.greenSquares.objRight.width = game.greenSquares.def_width;
    game.greenSquares.objRight.height = game.greenSquares.def_height;

    game.greenSquares.img = new Image();
    game.greenSquares.img.src = "./greensquare.jpg";

    game.whiteSquares.obj_array = [];
    game.whiteSquares.def_x = 0;
    game.whiteSquares.def_y = 0;
    game.whiteSquares.def_width = 3 * game.square;
    game.whiteSquares.def_height = game.square;
    game.whiteSquares.img = new Image();
    game.whiteSquares.img.src = "./whitesquare.jpg";
    game.whiteSquares.vY = game.fall;
    game.whiteSquares.vX = 0;

    game.start.obj_array = [];
    game.start.margin = 8;
    game.start.def_x = 0;
    game.start.def_y = 0;
    game.start.def_width = game.square - 2 * game.start.margin;
    game.start.def_height = game.square - 2 * game.start.margin;
    game.start.img = new Image();
    game.start.img.src = "./star.jpg";
    game.start.vY = game.fall;
    game.start.vX = 0;

    game.score = 0;
    game.gameOver = false;

    game.greenSquares.img.onload = function () {
        game.context.drawImage(game.greenSquares.img, game.greenSquares.objLeft.x, game.greenSquares.objLeft.y, game.greenSquares.def_width, game.greenSquares.def_height);
        game.context.drawImage(game.greenSquares.img, game.greenSquares.objRight.x, game.greenSquares.objRight.y, game.greenSquares.def_width, game.greenSquares.def_height);
    }

    requestAnimationFrame(update);
    setInterval(placeWhiteSquare, 800); //every 1.5 seconds
    document.addEventListener("keydown", moveGreenSquare);
    document.addEventListener("keyup", stopGreenSquare);
}

function update() {
    requestAnimationFrame(update);
    if (game.gameOver) {
        return;
    }
    game.context.clearRect(0, 0, game.board.def_width, game.board.def_height);

    // green squares
    if (game.greenSquares.objRight.x + game.greenSquares.objRight.width != game.board.def_width) {
        game.greenSquares.objLeft.x = Math.max(game.greenSquares.objLeft.x + game.greenSquares.vX, 0);
    }
    if (game.greenSquares.objLeft.x != 0) {
        game.greenSquares.objRight.x = Math.min(game.greenSquares.objRight.x + game.greenSquares.vX, game.board.def_width - game.greenSquares.objRight.width);
    }

    let y = game.greenSquares.objLeft.y + game.greenSquares.vY;
    if (game.greenSquares.vY <= 0) {
        game.greenSquares.objLeft.y = Math.max(y, 0);
        game.greenSquares.objRight.y = Math.max(y, 0);
    }
    else if (game.greenSquares.vY > 0) {
        game.greenSquares.objLeft.y = Math.min(y, game.board.def_height - game.greenSquares.objLeft.height);
        game.greenSquares.objRight.y = Math.min(y, game.board.def_height - game.greenSquares.objRight.height);
    }

    game.context.drawImage(game.greenSquares.img, game.greenSquares.objLeft.x, game.greenSquares.objLeft.y, game.greenSquares.def_width, game.greenSquares.def_height);
    game.context.drawImage(game.greenSquares.img, game.greenSquares.objRight.x, game.greenSquares.objRight.y, game.greenSquares.def_width, game.greenSquares.def_height);


    // white squares
    for (let i = 0; i < game.whiteSquares.obj_array.length; i++) {
        let square = game.whiteSquares.obj_array[i];
        square.y += game.whiteSquares.vY;
        game.context.drawImage(square.img, square.x, square.y, square.width, square.height);

        if (detectCollision(game.greenSquares.objLeft, square) || detectCollision(game.greenSquares.objRight, square)) {
            game.gameOver = true;
        }
    }

    //clear white squares
    while (game.whiteSquares.obj_array.length > 0 && game.whiteSquares.obj_array[0].y > game.board.def_height + game.whiteSquares.def_height) {
        game.whiteSquares.obj_array.shift(); //removes first element from the array
    }

    // start
    for (let i = 0; i < game.start.obj_array.length; i++) {
        let start = game.start.obj_array[i];
        start.y += game.start.vY;
        if (!start.hide) {
            game.context.drawImage(start.img, start.x, start.y, start.width, start.height);
            if (detectCollision(game.greenSquares.objLeft, start) || detectCollision(game.greenSquares.objRight, start)) {
                game.score += 1;
                start.hide = true;
            }
        }


    }

    // clear start
    while (game.start.obj_array.length > 0 && game.start.obj_array[0].y > game.board.def_height + game.start.def_height) {
        game.start.obj_array.shift();
    }

    //score
    game.context.fillStyle = "yellow";
    game.context.font = "45px sans-serif";
    game.context.fillText(game.score, 5, 45);

    if (game.gameOver) {
        game.context.fillText("GAME OVER", 5, 90);
        game.context.font = "20px sans-serif";
        game.context.fillText("Press Space to play again!", 5, 120);

    }
}

function placeWhiteSquare() {
    if (game.gameOver) {
        return;
    }

    let radomColumn = Math.floor(Math.random() * 3);
    let startX = radomColumn * game.square * 3;

    let leftSquare = {
        img: game.whiteSquares.img,
        x: startX,
        y: game.whiteSquares.def_y,
        width: game.whiteSquares.def_width,
        height: game.whiteSquares.def_height,
        // passed: false
    }

    game.whiteSquares.obj_array.push(leftSquare);

    let rightSquare = {
        img: game.whiteSquares.img,
        x: startX + leftSquare.width + game.square * 3,
        y: game.whiteSquares.def_y,
        width: game.whiteSquares.def_width,
        height: game.whiteSquares.def_height,
        // passed: false
    }

    game.whiteSquares.obj_array.push(rightSquare);

    let a = startX + leftSquare.width + 2 * game.start.margin;
    let b = startX + leftSquare.width + game.square * 3 - 2 * game.start.margin;
    let randomStartX = Math.floor(Math.random() * (b - a + 1)) + a;

    let start = {
        img: game.start.img,
        x: randomStartX,
        y: game.start.def_y + game.start.margin,
        width: game.start.def_width,
        height: game.start.def_height,
        hide: false
    }
    game.start.obj_array.push(start);
    console.log(game.start.obj_array);
}

function moveGreenSquare(e) {
    let v = 3;
    //reset game
    if (game.gameOver && e.code == "Space") {
        game.greenSquares.objLeft.x = game.greenSquares.def_x;
        game.greenSquares.objLeft.y = game.greenSquares.def_y;
        game.greenSquares.objRight.x = game.greenSquares.def_x + (1 + 5) * game.square;
        game.greenSquares.objRight.y = game.greenSquares.def_y;
        game.whiteSquares.obj_array = [];
        game.start.obj_array = [];
        game.score = 0;
        game.gameOver = false;
    }
    if (e.code == "ArrowLeft") {
        game.greenSquares.vX = -1 * v;
    } else if (e.code == "ArrowRight") {
        game.greenSquares.vX = v;

    } else if (e.code == "ArrowUp") {
        game.greenSquares.vY = -1 * v;
    } else if (e.code == "ArrowDown") {
        game.greenSquares.vY = v;
    }
}

function stopGreenSquare(e) {
    if (e.code == "ArrowLeft" || e.code == "ArrowRight") {
        game.greenSquares.vX = 0;
    } else if (e.code == "ArrowUp" || e.code == "ArrowDown") {
        game.greenSquares.vY = 0;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}