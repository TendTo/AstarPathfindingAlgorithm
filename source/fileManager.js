/**
 * Class that handles saving and loading files
 */
class FileManager {

    /**
     * Read the data from the JSON file and update the canvas and the settigs accordingly
     * @param {event} e - event triggered upon uploading a file
     */
    static loadFile(e) {
        if (e.target === '' || e.target.files.length === 0)
            return;

        const reader = new FileReader();
        reader.onload = function() {

            const data = JSON.parse(reader.result);

            dim = data["dim"] !== undefined ? parseInt(constrain(data["dim"], 6, 99)) : 70;
            animFramerate = data["animFramerate"] !== undefined ? parseFloat(constrain(data["animFramerate"], 0.1, 60)) : 2;
            D = data["D"] !== undefined ? parseInt(constrain(data["D"], 0, 50)) : 10;
            D2 = data["D2"] !== undefined ? parseInt(constrain(data["D2"], 0, 50)) : 14;
            specialMult = data["specialMult"] !== undefined ? parseFloat(constrain(data["specialMult"], 0, 99)) : 5;
            hMult = data["hMult"] !== undefined ? parseFloat(constrain(data["hMult"], 0, 99)) : 2;
            heuristic = data["heuristic"] !== undefined ? parseInt(constrain(data["heuristic"], 0, 3)) : 1;
            canDiagonally = data["canDiagonally"] !== undefined ? data["canDiagonally"] : true;
            start.x = data["start_x"] !== undefined ? parseInt(data["start_x"]) : -1;
            start.y = data["start_y"] !== undefined ? parseInt(data["start_y"]) : -1;
            end.x = data["end_x"] !== undefined ? parseInt(data["end_x"]) : -1;
            end.y = data["end_y"] !== undefined ? parseInt(data["end_y"]) : -1;
            squares = data["squares"];

            if (squares === undefined || squares === null || squares.length < 1 || squares[0].length < 1) {
                w = h = 1;
                initializeMatrix();
            }

            w = squares.length;
            h = squares[0].length;

            if (validVector(start))
                squares[start.x][start.y] = WALKABLE;
            if (validVector(end))
                squares[end.x][end.y] = WALKABLE;

            resizeCanvas(w * dim, h * dim);
            modifiedSquares.length = w * h;
            modifiedSquares.fill(true);

            drawMatrix();
            drawStartEnd();

            e.target.value = '';
        };
        reader.readAsText(e.target.files[0]);
    }

    /**
     * Save the state of the canvas and the settings in a JSON file
     */
    static saveFile() {

        const jsonWorkspace = FileManager.getJSON_Workspace();
        var blob = new Blob([jsonWorkspace], { type: 'application/json' });
        saveProjectFile.href = URL.createObjectURL(blob);
    }

    /**
     * Tranform the data into a JSON string
     * @returns {string} The data as a string
     */
    static getJSON_Workspace() {
        const data = new Object();

        data["dim"] = dim;
        data["animFramerate"] = animFramerate;
        data["D"] = D;
        data["D2"] = D2;
        data["specialMult"] = specialMult;
        data["hMult"] = hMult;
        data["heuristic"] = heuristic;
        data["canDiagonally"] = canDiagonally;
        data["start_x"] = start.x;
        data["start_y"] = start.y;
        data["end_x"] = end.x;
        data["end_y"] = end.y;
        data["squares"] = squares;

        return JSON.stringify(data);
    }
}