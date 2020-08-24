//#region consts and vars
const palette = Object.freeze({ "ground": 1, "wall": 2, "start": 3, "end": 4, "special_ground": 5 });
const status = Object.freeze({ "editor": 1, "running": 2, "pause": 3, "stop": 4, "settings": 5 });
const WALKABLE = 1;
const UNWALKABLE = -1;
const D = 10,
    D2 = 14;

var i_w, i_h, i_dim, i_framerate, i_spacialMult, d_heuristic, c_diagonal, snackbar, b_clear, b_settings, b_play, b_pause, b_stop;
var currentPalette = palette["ground"];
var currentStatus;
var special_groundMult = 5;
var heuristic = 1;
var canDiagonally = true;
var squares = [];
var start, end;
var astar;
var w = 9,
    h = 9;
var dim = 70;
var animFramerate = 2;
var locked = false;
//#endregion

window.startAlgotithm = startAlgotithm;
window.setPalette = setPalette;
window.apply = apply;
window.cancel = cancel;
window.setStatus = setStatus;
window.clearBoard = clearBoard;

/**
 * Called at the start
 */
function setup() {
    var canvas = createCanvas(w * dim, h * dim);
    canvas.parent('canvas');

    start = createVector(-1, -1);
    end = createVector(-1, -1);
    astar = new Astar();


    setupButtons();
    initializeMatrix();

    setStatus("editor");
    drawMatrix();
}
/**
 * Called each frame
 */
function draw() {
    switch (currentStatus) {
        case status["editor"]:
            drawMatrix();
            drawStartEnd();
            drawCurrentMouse();
            break;
        case status["running"]:
            astar.stepSolution();
            break;
        default:
            break;
    }
}

/**
 * Set up the buttons variables and set the value for each button in settings
 */
function setupButtons() {
    i_w = document.getElementById("w");
    i_h = document.getElementById("h");
    i_dim = document.getElementById("s");
    i_framerate = document.getElementById("f");
    i_spacialMult = document.getElementById("m");
    d_heuristic = document.getElementById("hsearch");
    c_diagonal = document.getElementById("d");
    snackbar = document.getElementById("snackbar");
    b_clear = document.getElementById("b_clear");
    b_settings = document.getElementById("b_settings");
    b_play = document.getElementById("b_play");
    b_pause = document.getElementById("b_pause");
    b_stop = document.getElementById("b_stop");

    i_w.value = w;
    i_h.value = h;
    i_dim.value = dim;
    i_framerate.value = animFramerate;
    i_spacialMult.value = special_groundMult;
    d_heuristic.selectedIndex = heuristic;
    c_diagonal.checked = canDiagonally;
}

/**
 * Initialize the squares matrix so that everyghing is walkable
 */
function initializeMatrix() {

    squares = [w];
    for (var i = 0; i < w; i++)
        squares[i] = [h];
    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            squares[i][j] = WALKABLE;
        }
    }
}

/**
 * Udate the matrix with the new width and height but trying to keep the elements that don't need deleting
 */
function updateMatrix() {

    const pW = squares.length;
    squares.length = w;
    for (var i = pW; i < w; i++)
        squares[i] = [h].fill(1);

    for (var i = 0; i < w; i++) {
        const pH = squares[i].length;
        squares[i].length = h;
        if (h > pH) {
            for (var j = pH; j < h; j++)
                squares[i][j] = 1;
        }
    }

    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            if (squares[i][j] != WALKABLE && squares[i][j] != UNWALKABLE)
                squares[i][j] = special_groundMult;
        }
    }

    if (!validVector(start))
        start.x = start.y = -1;
    if (!validVector(end))
        end.x = end.y = -1;
}

/**
 * Draw the square matrix on the canvas, according to the state of each square
 */
function drawMatrix() {
    background(0);
    stroke(0);
    strokeWeight(3);
    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            if (squares[i][j] == WALKABLE) fill(255);
            else if (squares[i][j] == UNWALKABLE) fill(0, 0, 255);
            else if (squares[i][j] == special_groundMult) fill('#666666');
            else fill(0);
            square(dim * i, dim * j, dim);
        }
    }
}

/**
 * Draw both end and start positions
 */
function drawStartEnd() {
    strokeWeight(3);
    fill(255);
    stroke(0, 255, 0);
    if (validVector(start))
        square(dim * start.x, dim * start.y, dim);
    stroke(255, 0, 0);
    if (validVector(end))
        square(dim * end.x, dim * end.y, dim);
}

/**
 * Make the selected palette follow the mouse
 */
function drawCurrentMouse() {
    if (mouseX < 0 || mouseY < 0)
        return;

    var x = parseInt(mouseX / dim);
    var y = parseInt(mouseY / dim);

    if (x < 0 || x >= w || y < 0 || y >= h)
        return;

    var drawColor = color(255);
    switch (currentPalette) {
        case palette.ground:
            strokeWeight(3);
            stroke(0);
            break;
        case palette.wall:
            strokeWeight(0);
            drawColor = color(0, 0, 255);
            break;
        case palette.special_ground:
            strokeWeight(0);
            drawColor = color('#666666');
            break;
        case palette.start:
            strokeWeight(3);
            stroke(0, 255, 0);
            break;
        case palette.end:
            strokeWeight(3);
            stroke(255, 0, 0);
            break;
        default:
            break;
    }
    fill(drawColor);
    square(dim * x + dim / 4, dim * y + dim / 4, dim / 2);
}

/**
 * If the position is valid, apply the correct palette on the square
 */
function mousePressed() {
    if (currentStatus === status["stop"]) { //If the animation has stopped, resume control
        setStatus("editor")
        return;
    }

    if (currentStatus != status["editor"]) //Ignore inputs made during the running animation
        return;

    if (mouseX < 0 || mouseY < 0)
        return;

    var x = parseInt(mouseX / dim);
    var y = parseInt(mouseY / dim);

    if (x < 0 || x >= w || y < 0 || y >= h)
        return;

    switch (currentPalette) {
        case palette.ground:
            squares[x][y] = 1;
            removeStartEnd(x, y);
            locked = true;
            break;
        case palette.wall:
            squares[x][y] = -1;
            removeStartEnd(x, y);
            locked = true;
            break;
        case palette.special_ground:
            squares[x][y] = special_groundMult;
            removeStartEnd(x, y);
            locked = true;
            break;
        case palette.start:
            setStart(x, y);
            break;
        case palette.end:
            setEnd(x, y);
            break;

        default:
            break;
    }
}

/**
 * If the mouse is locked, keep drawing the current palette
 */
function mouseDragged() {
    if (locked) {
        mousePressed();
    }
}

/**
 * Unlock the mouse
 */
function mouseReleased() {
    locked = false;
}

/**
 * Check if the given vecor is inside the matrix borders
 * @param {p5.Vector} v - Vetor to check
 * @returns {boolean} Whether or not the vector is valid
 */
function validVector(v) {
    return v.x >= 0 && v.x < w && v.y >= 0 && v.y < h;
}

/**
 * Set the start position and checks for any conflicts
 * @param {number} x - x coordinate of the start position
 * @param {number} y - y coordinate of the start position
 */
function setStart(x, y) {
    if (end.x == x && end.y == y)
        end.x = end.y = -1;

    squares[x][y] = WALKABLE;
    start.x = x;
    start.y = y;
}

/**
 * Set the end position and checks for any conflicts
 * @param {number} x - x coordinate of the end position
 * @param {number} y - y coordinate of the end position
 */
function setEnd(x, y) {
    if (start.x == x && start.y == y)
        start.x = start.y = -1;

    squares[x][y] = WALKABLE;
    end.x = x;
    end.y = y;
}

/**
 * If the start or end position are on this point, remove them
 * @param {number} x - x coordinate of the point
 * @param {number} y - y coordinate of the point
 */
function removeStartEnd(x, y) {
    if (start.x == x && start.y == y)
        start.x = start.y = -1;
    if (end.x == x && end.y == y)
        end.x = end.y = -1;
}

/**
 * Start the astar algorithm animation
 */
function startAlgotithm() {
    if (currentStatus == status["pause"]) { //If the algorithm is paused, continue the animation
        setStatus("running");
    } else if (validVector(start) && validVector(end)) {
        setStatus("running");
        drawMatrix();
        drawStartEnd();
        frameRate(animFramerate);
        astar.startAlgorithm();
    } else {
        snackbar.className = "show";
        setTimeout(function() { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
    }
}

/**
 * Clears the board
 */
function clearBoard() {
    initializeMatrix();
    start.x = start.y = end.x = end.y = -1;
}

/**
 * Set the palette with the given index {walkable, unwalkable, start, end, special_ground}
 * @param {string} id - id of the wanted palette
 */
function setPalette(id) {
    currentPalette = palette[id];
}

/**
 * Apply the changes in the settings
 */
function apply() {
    w = parseInt(i_w.value);
    h = parseInt(i_h.value);
    dim = parseInt(i_dim.value);
    animFramerate = parseFloat(i_framerate.value);
    special_groundMult = parseFloat(i_spacialMult.value);
    heuristic = d_heuristic.selectedIndex;
    canDiagonally = c_diagonal.checked == true;

    resizeCanvas(w * dim, h * dim);
    updateMatrix();
    setStatus("editor");
}

/**
 * Cancels every change in the settings
 */
function cancel() {
    i_w.value = w;
    i_h.value = h;
    i_dim.value = dim;
    i_framerate.value = animFramerate;
    i_spacialMult.value = special_groundMult;
    d_heuristic.selectedIndex = heuristic;
    c_diagonal.checked = canDiagonally;
    setStatus("editor");
}

/**
 * Set the currentStatus value based of the choosen status
 * @param {string} newStatus - status to use when changing the editor mode value
 */
function setStatus(newStatus) {
    currentStatus = status[newStatus];
    switch (currentStatus) {
        case status["editor"]:
            frameRate(60);
            b_play.disabled = b_clear.disabled = b_settings.disabled = false;
            b_stop.disabled = b_pause.disabled = true;
            break;
        case status["running"]:
            frameRate(animFramerate);
            b_stop.disabled = b_pause.disabled = false;
            b_play.disabled = b_clear.disabled = b_settings.disabled = true;
            break;
        case status["pause"]:
            b_stop.disabled = b_play.disabled = false;
            b_pause.disabled = b_clear.disabled = b_settings.disabled = true;
            break;
        case status["stop"]:
            b_play.disabled = b_clear.disabled = b_settings.disabled = false;
            b_pause.disabled = b_stop.disabled = true;
            break;
        case status["settings"]:
            b_play.disabled = b_clear.disabled = b_settings.disabled = b_pause.disabled = b_stop.disabled = true;
            break;
        default:
            break;

    }
}