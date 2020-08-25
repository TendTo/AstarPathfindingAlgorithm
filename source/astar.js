/**
 * Class that handles the A* algorithm
 */
class Astar {
    /**
     * Create an istance of Astar
     */
    constructor() {
        this.openPoints = [];
        this.points = [];
        this.px = -1;
        this.px = -1;
        this.stepCounter = 0;
        this.fcounter = 0;
        this.distance = 0;
        this.time = 0;
    }

    /**
     * Start the algorithm animation
     */
    startAlgorithm() {
        this.clearAll();
        this.initializeAlgorithm();
    }

    /**
     * Clear the points matrix and the openPoints array
     */
    clearAll() {
        this.points = [w];
        for (var i = 0; i < w; i++)
            this.points[i] = [h];

        for (var i = 0; i < w; i++) {
            for (var j = 0; j < h; j++) {
                this.points[i][j] = { f: -1, g: -1, h: -1, x: i, y: j, px: -1, py: -1 };
            }
        }
        this.openPoints.length = 0;
        this.px = -1;
        this.py = -1;
        this.stepCounter = 0;
        this.distance = 0;
        this.fcounter = 0;
        this.time = millis();
    }

    /**
     * Inizialize the starting point
     */
    initializeAlgorithm() {
        this.pushToOpenNodes(this.points[start.x][start.y]);
        this.points[start.x][start.y].h = this.calculateH(start.x, start.y);
        this.points[start.x][start.y].g = 0;
        this.points[start.x][start.y].f = this.points[start.x][start.y].g + this.points[start.x][start.y].h;
        this.drawText(start.x, start.y);
    }

    /**
     * Follows the astar algorithm step by step. Called each frame
     */
    stepSolution() {
        if (this.openPoints.length > 0) {
            var minValue = this.openPoints.reduce((acc, cur) => {
                if (acc === undefined) return cur;
                else if (cur.f < acc.f) return cur;
                else if (cur.f == acc.f && cur.h < acc.h) return cur;
                else return acc;
            });
            this.openPoints.splice(this.openPoints.findIndex((v) => v == minValue), 1);
            this.stepCounter++;
            if (minValue.x == end.x && minValue.y == end.y) { //The destination has been reached with the shortest possible path
                this.retracePath();
                setStatus("stop");
                window.setResults(this.distance, this.stepCounter, this.fcounter, this.time = millis() - this.time);
                return;
            }
            this.drawFocus(minValue.x, minValue.y, color(255, 255, 0));
            this.drawFocus(start.x, start.y, color(0, 255, 0));
            this.checkNeighbours(minValue.x, minValue.y);
        } else { //There are no more open nodes. The destination is unreachable
            this.retraceFailPath();
            setStatus("stop");
            window.setResults(this.distance, this.stepCounter, this.fcounter, this.time = millis() - this.time);
            return;
        }
    }

    /**
     * Check all the neighbours of the point and, if they are valid points, calculate their f value 
     * @param {number} x - x coordinate of the point
     * @param {number} y - y coordinate of the point
     */
    checkNeighbours(x, y) {
        const g = this.points[x][y].g;
        this.px = x;
        this.py = y;
        if (x - 1 >= 0) {
            if (y - 1 >= 0 && canDiagonally)
                this.calculateF(x - 1, y - 1, g + D2 * squares[x][y]);
            if (y + 1 < h && canDiagonally)
                this.calculateF(x - 1, y + 1, g + D2 * squares[x][y]);
            this.calculateF(x - 1, y, g + D * squares[x][y]);
        }
        if (y - 1 >= 0)
            this.calculateF(x, y - 1, g + D * squares[x][y]);
        if (y + 1 < h)
            this.calculateF(x, y + 1, g + D * squares[x][y]);
        if (x + 1 < w) {
            if (y - 1 >= 0 && canDiagonally)
                this.calculateF(x + 1, y - 1, g + D2 * squares[x][y]);
            if (y + 1 < h && canDiagonally)
                this.calculateF(x + 1, y + 1, g + D2 * squares[x][y]);
            this.calculateF(x + 1, y, g + D * squares[x][y]);
        }
    }

    /**
     * Calculate the new F value for the point, if the g provided is less than the current g
     * @param {number} x - x coordinate of the point
     * @param {number} y - y coordinate of the point
     * @param {number} g - new g value calculated for the point
     */
    calculateF(x, y, g, px, py) {
        if (squares[x][y] < 0) //Check if the square is walkable
            return;

        if (this.points[x][y].h < 0) //Check if the h has already been calculated, otherwise do it
            this.points[x][y].h = this.calculateH(x, y);
        if (this.points[x][y].g >= 0 && this.points[x][y].g <= g) //Check if the g already present is better than the new one
            return;

        this.fcounter++;

        this.points[x][y].g = g;
        this.points[x][y].f = this.points[x][y].h + this.points[x][y].g;
        this.points[x][y].px = this.px;
        this.points[x][y].py = this.py;

        this.pushToOpenNodes(this.points[x][y]);
        this.drawText(x, y, true);
    }

    /**
     * Calculate the heuristic distance from the indicated point to the end point
     * @param {number} x - x coordinate of the point
     * @param {number} y - y coordinate of the point
     * @returns {number} The value h
     */
    calculateH(x, y) {
        const dx = abs(x - end.x)
        const dy = abs(y - end.y)
        switch (heuristic) {
            case 0:
                return parseInt((D * (dx + dy)) * hMult);
            case 1:
                return parseInt((D * (dx + dy) + (D2 - 2 * D) * min(dx, dy)) * hMult);
            case 2:
                return parseInt(sqrt(sq(dx) + sq(dy)) * D * squares[x][y] * hMult);
            case 3:
                return 0;
            default:
                return 0;
        }
    }

    /**
     * Retrace the path discovered by the Astar algorithm and color it
     */
    retracePath() {
        var px = this.points[end.x][end.y].px,
            py = this.points[end.x][end.y].py;

        if (px - end.x == 0 || py - end.y == 0) this.distance += D * squares[px][py]; //Caclulate the distance of the path found
        else this.distance += D2 * squares[px][py];

        while (px != start.x || py != start.y) {
            this.drawFocus(px, py, color(0, 255, 255));
            const temp = this.points[px][py];

            if (px - temp.px == 0 || py - temp.py == 0) this.distance += D * squares[temp.px][temp.py]; //Caclulate the distance of the path found
            else this.distance += D2 * squares[temp.px][temp.py];

            px = temp.px;
            py = temp.py;
        }
        this.drawFocus(start.x, start.y, color(0, 255, 0));
        this.drawFocus(end.x, end.y, color(255, 0, 0));
    }

    /**
     * Retrace the all the path tried by the Astar algorithm and color it
     */
    retraceFailPath() {
        this.points.forEach(e => e.filter(v => v.g > 0)
            .forEach(e => this.drawFocus(e.x, e.y, color(255, 0, 255))));
        this.drawFocus(start.x, start.y, color(0, 255, 0));
        this.drawFocus(end.x, end.y, color(255, 0, 0));
        this.distance = -1;
    }

    /**
     * Generate a string containing all the point's info
     * @param {number} x - x coordinate of the point
     * @param {number} y - y coordinate of the point
     * @returns {string} - Point's info: h, g and f values
     */
    getPointInfo(x, y) {
        return '   h:' + (this.points[x][y].h >= 0 ? this.points[x][y].h : '?') + '\n' +
            '   g:' + (this.points[x][y].g >= 0 ? this.points[x][y].g : '?') + '\n' +
            '   f:' + (this.points[x][y].f >= 0 ? this.points[x][y].f : '?');
    }

    /**
     * Draw some text on the chosen square
     * @param {number} x - x coordinate of the square
     * @param {number} y - y coordinate of the square
     * @param {boolean} override - whether or not the intern of the square should be recolored
     */
    drawText(x, y, override) {
        const fraction = 4;
        if (override) {
            strokeWeight(0);
            if (end.x == x && end.y == y) fill(255, 0, 0);
            else if (squares[x][y] == WALKABLE) fill(255);
            else fill('#666666');
            square(x * dim + 3, y * dim + 3, dim - 6);
        }
        fill(0);
        textSize(dim / fraction);
        textLeading(dim / fraction / 1.8);
        textAlign(LEFT, TOP)
        stroke(0);
        strokeWeight(0);
        text(this.getPointInfo(x, y), x * dim + dim / 14, y * dim, dim / fraction);
    }

    /**
     * Draw a stroke around the chosen square
     * @param {number} x - x coordinate of the square
     * @param {number} y - y coordinate of the square
     * @param {p5.color} color - color of the stroke
     */
    drawFocus(x, y, color) {
        fill(0, 0);
        strokeWeight(strokeDim);
        stroke(color);
        square(x * dim, y * dim, dim);
    }

    /**
     * Push the point into the openPoints array, if it is not present yet
     * @param {any} point - point to push in the array
     */
    pushToOpenNodes(point) {
        if (this.openPoints.find(v => v.x == point.x && v.y == point.y) === undefined)
            this.openPoints.push(point);
    }
}