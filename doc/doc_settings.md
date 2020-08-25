## Settings documentation

### Settings explaination
+ Rows: number of rows of the canvas. Min 1 - Max 99
+ Columns: number of columns of the canvas. Min 1 - Max 99
+ Cell size: size of the cells of the canvas. Min 6 - Max 99
+ Framerate: framerate of the animation. An higher value will make the animation faster. Min 0.1 - Max 60
+ **+** direction cost: cost of moving vertically or horizontally. It will influence both h and g values. Min 0 - Max 50
+ **x** direction cost: cost of moving diagonally. It will influence both h and g values. Min 0 - Max 50
+ H coefficient: coefficient applied to the h value. A lower coeffient will make so the algorithm will seek the shortest path, but will be less efficient. An higher value will make so the algorithm will finish earlier, but the path may not be the shortest. Min 0 - Max 99
+ Special ground: traversing the special ground will cost the specified value times more than traversing the normal ground. It will only influence the g value
+ Heuristics: heustic used to calculate the h value. See below for more information on each one
+ Can move diagonally: whether or not diagonal movement is allowed

+ Cancel: revert the settings
+ Apply: apply the settings

#### Heuristics
There are 4 possible heuristics contemplated:
- **Manhattan distance:** estimate the distance considering only horizontal-vertical movements. Ignores obstacles
- **Diagonal distance:** estimate the distance considering all the 8 possible directions. Ignores obstacles
- **Euclid distance:** estimate the distance as the crow flies. Ignores obstacles
- **Dijkstra (h = 0):** always set h = 0. It behaves exactly like Dijkstra's  algorithm