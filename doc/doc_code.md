## Code documentation

### index.html
```javascript
/**
 * Used to enable the tooltips
 */
$(function())

/**
 * Prevents the use of unwanted characters
 * @param {any} ob - html input field
 */
function checkInput(ob)

/**
 * Checks that the value is between the constrains
 * @param {any} ob - html input field
 * @param {number} min - minimum value allowed
 * @param {number} max - maximum value allowed
 */
function validateInput(ob, min, max)

/**
 * Change the status value and shows the modal
 */
function callSettings()

/**
 * Show the results of the algorithm
 * @param {number} distance - distance result from the start point to hte end point
 * @param {number} stepCounter - times of calls to the function 'stepSolution'
 * @param {number} fcounter - times an fvalue got evalueted
 * @param {number} time - time enlapsed
 */
function setResults(distance, stepCounter, fcounter, time)
```

### main.js
```javascript
/**
* Called at the start
*/
function  setup()

/**
* Called each frame
*/
function  draw()

/**
* Set up the buttons variables and set the value for each button in settings
*/
function  setupButtons()

/**
* Initialize the squares matrix so that everyghing is walkable
*/
function  initializeMatrix()

/**
* Udate the matrix with the new width and height but trying to keep the elements that don't need deleting
*/
function  updateMatrix()
/**
* Draw the square matrix on the canvas, according to the state of each square
*/
function  drawMatrix()

/**
* Draw both end and start positions
*/
function  drawStartEnd()

/**
* Make the selected palette follow the mouse
*/
function  drawCurrentMouse()

/**
* If the position is valid, apply the correct palette on the square
*/
function  mousePressed()

/**
* If the mouse is locked, keep drawing the current palette
*/
function  mouseDragged()
  
/**
* Unlock the mouse
*/
function  mouseReleased()

/**
* Check if the given vecor is inside the matrix borders
* @param  {p5.Vector}  v - Vetor to check
* @returns  {boolean} Whether or not the vector is valid
*/

function  validVector(v)

/**
* Set the start position and checks for any conflicts
* @param  {number}  x - x coordinate of the start position
* @param  {number}  y - y coordinate of the start position
*/
function  setStart(x, y)

/**
* Set the end position and checks for any conflicts
* @param  {number}  x - x coordinate of the end position
* @param  {number}  y - y coordinate of the end position
*/
function  setEnd(x, y)
  
/**
* If the start or end position are on this point, remove them
* @param  {number}  x - x coordinate of the point
* @param  {number}  y - y coordinate of the point
*/
function  removeStartEnd(x, y)

/**
* Start the astar algorithm animation
*/
function  startAlgotithm()

/**
* Clears the board
*/
function  clearBoard()

/**
* Set the palette with the given index {walkable, unwalkable, start, end, special_ground}
* @param  {string}  id - id of the wanted palette
*/
function  setPalette(id)

/**
* Apply the changes in the settings
*/
function  apply()

/**
* Cancels every change in the settings
*/
function  cancel()

/**
  Set the currentStatus value based of the chosen status
* @param  {string}  newStatus - status to use when changing the editor mode value
*/
function  setStatus(newStatus)
```
### astar.js
```javascript
/**
* Class that handles the A* algorithm
*/
class  Astar

/**
* Create an istance of Astar
*/
constructor()
  
/**
* Start the algorithm animation
*/
startAlgorithm()

/**
* Clear the point matrix and the openPoints array
*/
clearAll()

/**
* Inizialize the starting point
*/
initializeAlgorithm()

/**
* Follows the Astar algorithm step by step. Called each frame
*/
stepSolution()  

/**
* Check all the neighbours of the point and, if they are valid points, calculate their f value
* @param  {number}  x - x coordinate of the point
* @param  {number}  y - y coordinate of the point
*/
checkNeighbours(x, y)
  
/**
* Calculate the new F value for the point, if the g provided is less than the current g
* @param  {number}  x - x coordinate of the point
* @param  {number}  y - y coordinate of the point
* @param  {number}  g - new g value calculated for the point
*/
calculateF(x, y, g, px, py) 

/**
* Calculate the heuristic distance from the indicated point to the end point
* @param  {number}  x - x coordinate of the point
* @param  {number}  y - y coordinate of the point
* @returns  {number} The value h
*/
calculateH(x, y)

/**
* Retrace the path discovered by the Astar algorithm and color it
*/
retracePath()   

/**
* Retrace the all the path tried by the Astar algorithm and color it
*/
retraceFailPath()

/**
* Generate a string containing all the point's info
* @param  {number}  x - x coordinate of the point
* @param  {number}  y - y coordinate of the point
* @returns  {string} - Point's info: h, g and f values
*/
getPointInfo(x, y)  

/**
* Draw some text on the chosen square
* @param  {number}  x - x coordinate of the square
* @param  {number}  y - y coordinate of the square
* @param  {boolean}  override - whether or not the intern of the square should be recolored
*/
drawText(x, y, override)
  

/**
* Draw a stroke around the chosen square
* @param  {number}  x - x coordinate of the square
* @param  {number}  y - y coordinate of the square
* @param  {p5.color}  color - color of the stroke
*/
drawFocus(x, y, color)  

/**
* Push the point into the openPoints array, if it is not present yet
* @param  {any}  point - point to push in the array
*/
pushToOpenNodes(point)
```