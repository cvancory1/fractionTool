document.body.style.backgroundColor = "#c9f4fe";
        
// get url string and parse
queryString = window.location.search;
console.log(queryString);

// gets the fraction numbers
urlParams = new URLSearchParams(queryString);

// sets problem input
num1 = urlParams.get('leftNum');
denom1 = urlParams.get('leftDenom');
num2 = urlParams.get('rightNum');
denom2 = urlParams.get('rightDenom');

console.log(num1 + num2 + denom1 +denom2)
            
//Global Variable Definition
var vertCutFlag = false;
var horizCutFlag = false;
var paintFlag = false;
var isMovable = false;
var eraseFlag = false;
var paintColor = 'white';

var prevGroup = new Group();

//unitSquare variable definition
var unitSquare = new Group();
unitSquare.data.type = "work";
unitSquare.data.MAX_CUTS = 6;
unitSquare.data.WIDTH = 300;
unitSquare.data.HEIGHT = 300;
unitSquare.data.CENTER_X = 100;
unitSquare.data.CENTER_Y = 200;
unitSquare.data.fillNumX = 1;
unitSquare.data.fillNumY = 1;
unitSquare.data.totalCuts = (unitSquare.data.MAX_CUTS - 1) * unitSquare.data.MAX_CUTS / 2;
unitSquare.data.offset = 1;
unitSquare.data.isCuttableHoriz = true;
unitSquare.data.isCuttableVert = true; 

//otherSquare variable definition
var otherSquare = new Group();
otherSquare.data.type = "work";
otherSquare.data.MAX_CUTS = 6;
otherSquare.data.WIDTH = 300;
otherSquare.data.HEIGHT = 300;
otherSquare.data.CENTER_X = 100;
otherSquare.data.CENTER_Y = 550;
otherSquare.data.fillNumX = 1;
otherSquare.data.fillNumY = 1;
otherSquare.data.totalCuts = (unitSquare.data.MAX_CUTS - 1) * unitSquare.data.MAX_CUTS / 2;
otherSquare.data.offset = 1;
otherSquare.data.isCuttableHoriz = true;
otherSquare.data.isCuttableVert = true; 

//answerSquare variable definition
var answerSquare = new Group();
answerSquare.data.type = "answ";
answerSquare.data.MAX_CUTS = 6;
answerSquare.data.WIDTH = 300;
answerSquare.data.HEIGHT = 300;
answerSquare.data.CENTER_X = 600;
answerSquare.data.CENTER_Y = 400;
answerSquare.data.fillNumX = 1;
answerSquare.data.fillNumY = 1;
answerSquare.data.totalCuts = (unitSquare.data.MAX_CUTS - 1) * unitSquare.data.MAX_CUTS / 2;
answerSquare.data.offset = 1;
answerSquare.data.isCuttableHoriz = true;
answerSquare.data.isCuttableVert = true; 

 groupArray = [unitSquare, otherSquare, answerSquare];

var origPos;

function doOverlap(l1,  r1,  l2,  r2) {
 
    // To check if either rectangle is actually a line
    // For example : l1 ={-1,0} r1={1,1} l2={0,-1} r2={0,1}

    if (l1.x == r1.x || l1.y == r1.y ||
    l2.x == r2.x || l2.y == r2.y) {
        // the line cannot have positive overlap
        return false;
    }

    // If one rectangle is on left side of other
    if (l1.x >= r2.x || l2.x >= r1.x) {
        return false;
    }

    // If one rectangle is above other
    if (r1.y >= l2.y || r2.y >= l1.y) {
        return false;
    }

    return true;
};

function savePrev(group){
    for(var i = 0; i < group.data.fillNumX * group.data.fillNumY; i++){
        //add if to filter out white
        var temp = group.children[group.data.offset+i].clone();
        prevGroup.addChild(temp);    
    }
};

function bringToFront(event){
    if(isMovable){
        this.data.movingSquare = true;
        /*for(var i = 0; i < unitSquare.children.length; i++){
            console.log(unitSquare.children[i].exportJSON(this));
        }*/
        var hitResult = project.hitTest(event.point);
        //console.log(origPos);
        origPos = this.position;
        //console.log(origPos);
        //Adding something to the active layer removes it from its origonal group
        //console.log(project.activeLayer.children[0].exportJSON(this));
        //console.log(hitResult.item.exportJSON(this));
        //console.log(project.activeLayer.children.length);
        project.activeLayer.addChild(hitResult.item);
        //console.log(project.activeLayer.children[0].exportJSON(this));
        //console.log(project.activeLayer.children.length);
        //console.log(project.activeLayer.lastChild.exportJSON(this));
        /*for(var i = 0; i < unitSquare.children.length; i++){
            console.log(unitSquare.children[i].exportJSON(this));
        }*/
    }
};

function moveActive(event){
    if(this.fillColor != 'grey' && isMovable == true && this.fillColor != 'white'){
        //console.log(event.delta);
        this.position += event.delta
    }
};

function endMove(event){
    if(isMovable){
        if(this.data.movingSquare && this.fillColor != 'white' && this.fillColor != 'grey'){
             hits = [];
            var ogIndex;
            for(var i = 0; i < answerSquare.data.fillNumX * answerSquare.data.fillNumY; i++){
                if(answerSquare.children[answerSquare.data.offset+i].bounds.contains(event.point) && (Math.trunc(answerSquare.children[answerSquare.data.offset+i].bounds.width) == Math.trunc(this.bounds.width) && Math.trunc(answerSquare.children[answerSquare.data.offset+i].bounds.height) == Math.trunc(this.bounds.height) || Math.trunc(answerSquare.children[answerSquare.data.offset+i].bounds.height) == Math.trunc(this.bounds.width) && Math.trunc(answerSquare.children[answerSquare.data.offset+i].bounds.width) == Math.trunc(this.bounds.height)) && answerSquare.children[answerSquare.data.offset+i].fillColor != 'aquamarine'){
                    hits.push(answerSquare.data.offset+i);
                    //answerSquare.children[answerSquare.data.offset+i].fillColor = 'grey';
                    this.fillColor = 'grey';
                    this.position = origPos;
                }
                else{
                    this.position = origPos;
                }
            }
            
            if(hits.length > 0){
                answerSquare.children[hits[0]].fillColor = 'aquamarine';
            }
            
            for(var i = 0; i < groupArray.length; i++){
            		groupArray[i].data.isCuttableHoriz = false;
            		groupArray[i].data.isCuttableVert = false;
            }
        }
        this.data.movingSquare = false;
    }
};

function addBackdrop(group){
    var backdrop = new Path.Rectangle(new Point(group.data.CENTER_X, group.data.CENTER_Y), group.data.WIDTH, group.data.HEIGHT);
    backdrop.strokeColor = 'black';
    backdrop.strokeWidth = 4;
    backdrop.fillColor = 'grey';
    group.addChild(backdrop);
};

//add all vertical division lines as children
function addVertLines(group){
    for(var i=2; i<=group.data.MAX_CUTS; i++){
        for(var j=1; j < i; j++){
            var line = new Path.Line({
                from: [j*(group.data.WIDTH/i)+group.data.CENTER_X, group.data.CENTER_Y], 
                to: [j*(group.data.WIDTH/i)+group.data.CENTER_X, group.data.HEIGHT + group.data.CENTER_Y],
                strokeColor: 'blue',
                strokeWidth: 10,
                visible: false
            });
            line.onClick = function(event){
                var group;
                for(var i = 0; i < groupArray.length; i++){
                    if(event.point.x >= groupArray[i].data.CENTER_X && event.point.x <= groupArray[i].data.CENTER_X + groupArray[i].data.WIDTH && event.point.y >= groupArray[i].data.CENTER_Y && event.point.y <= groupArray[i].data.CENTER_Y + groupArray[i].data.HEIGHT){
                        group = groupArray[i];
                    }
                }
                if(vertCutFlag){
                    savePrev(group);
                    if(event.point.x > (group.data.WIDTH/3)+group.data.CENTER_X && event.point.x < 2*(group.data.WIDTH/3)+group.data.CENTER_X){
                        removeSquares(group);
                        group.data.fillNumX = 2;
                        addSquares(group);
                        prevGroup.removeChildren();
                        hideVertCutLines(group);
                    } else if(event.point.x > (group.data.WIDTH/4)+group.data.CENTER_X && event.point.x < 3*(group.data.WIDTH/4)+group.data.CENTER_X){
                        removeSquares(group);
                        group.data.fillNumX = 3;
                        addSquares(group);
                        prevGroup.removeChildren();
                        hideVertCutLines(group);
                    } else if(event.point.x > (group.data.WIDTH/5)+group.data.CENTER_X && event.point.x < 4*(group.data.WIDTH/5)+group.data.CENTER_X){
                        removeSquares(group);
                        group.data.fillNumX = 4;
                        addSquares(group);
                        prevGroup.removeChildren();
                        hideVertCutLines(group);
                    } else if(event.point.x > (group.data.WIDTH/6)+group.data.CENTER_X && event.point.x < 5*(group.data.WIDTH/6)+group.data.CENTER_X){
                        removeSquares(group);
                        group.data.fillNumX = 5;
                        addSquares(group);
                        prevGroup.removeChildren();
                        hideVertCutLines(group);
                    } else {
                        removeSquares(group);
                        group.data.fillNumX = 6;
                        addSquares(group);
                        prevGroup.removeChildren();
                        hideVertCutLines(group);
                    }
                    group.data.isCuttableVert = false;
                }
            };
            group.addChild(line);
        }
    }
};

//add all horizontal division lines as children
function addHorizLines(group){
    for(var i=2; i<=group.data.MAX_CUTS; i++){
        for(var j=1; j < i; j++){
            var line = new Path.Line({
                from: [group.data.CENTER_X, j*(group.data.HEIGHT/i)+group.data.CENTER_Y], 
                to: [group.data.WIDTH + group.data.CENTER_X, j*(group.data.HEIGHT/i)+group.data.CENTER_Y],
                strokeColor: 'green',
                strokeWidth: 10,
                visible: false
            });
            line.onClick = function(event){
                var group;
                for(var i = 0; i < groupArray.length; i++){
                    if(event.point.x >= groupArray[i].data.CENTER_X && event.point.x <= groupArray[i].data.CENTER_X + groupArray[i].data.WIDTH && event.point.y >= groupArray[i].data.CENTER_Y && event.point.y <= groupArray[i].data.CENTER_Y + groupArray[i].data.HEIGHT){
                        group = groupArray[i];
                    }
                }
                if(horizCutFlag){
                    savePrev(group);
                    if(event.point.y > (group.data.HEIGHT/3)+group.data.CENTER_Y && event.point.y < 2*(group.data.HEIGHT/3)+group.data.CENTER_Y){
                        removeSquares(group);
                        group.data.fillNumY = 2;
                        addSquares(group);
                        prevGroup.removeChildren();
                        hideHorizCutLines(group);
                    } else if(event.point.y > (group.data.HEIGHT/4)+group.data.CENTER_Y && event.point.y < 3*(group.data.HEIGHT/4)+group.data.CENTER_Y){
                        removeSquares(group);
                        group.data.fillNumY = 3;
                        addSquares(group);
                        prevGroup.removeChildren();
                        hideHorizCutLines(group);
                    } else if(event.point.y > (group.data.HEIGHT/5)+group.data.CENTER_Y && event.point.y < 4*(group.data.HEIGHT/5)+group.data.CENTER_Y){
                        removeSquares(group);
                        group.data.fillNumY = 4;
                        addSquares(group);
                        prevGroup.removeChildren();
                        hideHorizCutLines(group);
                    } else if(event.point.y > (group.data.HEIGHT/6)+group.data.CENTER_Y && event.point.y < 5*(group.data.HEIGHT/6)+group.data.CENTER_Y){
                        removeSquares(group);
                        group.data.fillNumY = 5;
                        addSquares(group);
                        prevGroup.removeChildren();
                        hideHorizCutLines(group);
                    } else {
                        removeSquares(group);
                        group.data.fillNumY = 6;
                        addSquares(group);
                        prevGroup.removeChildren();
                        hideHorizCutLines(group);
                    }
                    group.data.isCuttableHoriz = false;
                }
            };
            group.addChild(line);
        }
    }
};

function hideHorizCutLines(group){
    if(horizCutFlag){
        if(group != undefined){
            for(var i=(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts; i<group.children.length; i++){
                group.children[i].visible = false;
            }
        }
    }
};

function horizCutSelect(event, group){
    if(horizCutFlag){
        savePrev(group);
        if(event.point.y > (group.data.HEIGHT/3)+group.data.CENTER_Y && event.point.y < 2*(group.data.HEIGHT/3)+group.data.CENTER_Y){
            removeSquares(group);
            group.data.fillNumY = 2;
            addSquares(group);
            prevGroup.removeChildren();
            hideHorizCutLines(group);
        } else if(event.point.y > (group.data.HEIGHT/4)+group.data.CENTER_Y && event.point.y < 3*(group.data.HEIGHT/4)+group.data.CENTER_Y){
            removeSquares(group);
            group.data.fillNumY = 3;
            addSquares(group);
            prevGroup.removeChildren();
            hideHorizCutLines(group);
        } else if(event.point.y > (group.data.HEIGHT/5)+group.data.CENTER_Y && event.point.y < 4*(group.data.HEIGHT/5)+group.data.CENTER_Y){
            removeSquares(group);
            group.data.fillNumY = 4;
            addSquares(group);
            prevGroup.removeChildren();
            hideHorizCutLines(group);
        } else if(event.point.y > (group.data.HEIGHT/6)+group.data.CENTER_Y && event.point.y < 5*(group.data.HEIGHT/6)+group.data.CENTER_Y){
            removeSquares(group);
            group.data.fillNumY = 5;
            addSquares(group);
            prevGroup.removeChildren();
            hideHorizCutLines(group);
        } else {
            removeSquares(group);
            group.data.fillNumY = 6;
            addSquares(group);
            prevGroup.removeChildren();
            hideHorizCutLines(group);
        }
        group.data.isCuttableHoriz = false;
    }
};

function showHorizCutLines(event, group) {
    if(group != undefined){
        if(!group.data.isCuttableHoriz){
            console.log("Erase Before Cutting!")
            horizCutFlag = false;
        }
        else if(horizCutFlag){
            //console.log(event.point.x);
            hideHorizCutLines(group);
            if(event.point.y > (group.data.HEIGHT/3)+group.data.CENTER_Y && event.point.y < 2*(group.data.HEIGHT/3)+group.data.CENTER_Y){
                //console.log(2);
                group.children[1+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
            } else if(event.point.y > (group.data.HEIGHT/4)+group.data.CENTER_Y && event.point.y < 3*(group.data.HEIGHT/4)+group.data.CENTER_Y){
                //console.log(3);
                group.children[2+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
                group.children[3+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
            } else if(event.point.y > (group.data.HEIGHT/5)+group.data.CENTER_Y && event.point.y < 4*(group.data.HEIGHT/5)+group.data.CENTER_Y){
                //console.log(4);
                group.children[4+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
                group.children[5+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
                group.children[6+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
            } else if(event.point.y > (group.data.HEIGHT/6)+group.data.CENTER_Y && event.point.y < 5*(group.data.HEIGHT/6)+group.data.CENTER_Y){
                //console.log(5);
                group.children[7+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
                group.children[8+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
                group.children[9+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
                group.children[10+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
            } else {
                //console.log(6);
                group.children[11+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
                group.children[12+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
                group.children[13+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
                group.children[14+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
                group.children[15+(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts].visible = true;
            }
        }
    }
};

function hideVertCutLines(group){
    if(vertCutFlag){
        if(group != undefined){
            for(var i=1+(group.data.fillNumX*group.data.fillNumY); i<group.data.totalCuts+1+(group.data.fillNumX*group.data.fillNumY); i++){
                group.children[i].visible = false;
            }
        }
    }
}

function vertCutSelect(event, group){
    if(vertCutFlag){
        savePrev(group);
        if(event.point.x > (group.data.WIDTH/3)+group.data.CENTER_X && event.point.x < 2*(group.data.WIDTH/3)+group.data.CENTER_X){
            removeSquares(group);
            group.data.fillNumX = 2;
            addSquares(group);
            prevGroup.removeChildren();
            hideVertCutLines(group);
        } else if(event.point.x > (group.data.WIDTH/4)+group.data.CENTER_X && event.point.x < 3*(group.data.WIDTH/4)+group.data.CENTER_X){
            removeSquares(group);
            group.data.fillNumX = 3;
            addSquares(group);
            prevGroup.removeChildren();
            hideVertCutLines(group);
        } else if(event.point.x > (group.data.WIDTH/5)+group.data.CENTER_X && event.point.x < 4*(group.data.WIDTH/5)+group.data.CENTER_X){
            removeSquares(group);
            group.data.fillNumX = 4;
            addSquares(group);
            prevGroup.removeChildren();
            hideVertCutLines(group);
        } else if(event.point.x > (group.data.WIDTH/6)+group.data.CENTER_X && event.point.x < 5*(group.data.WIDTH/6)+group.data.CENTER_X){
            removeSquares(group);
            group.data.fillNumX = 5;
            addSquares(group);
            prevGroup.removeChildren();
            hideVertCutLines(group);
        } else {
            removeSquares(group);
            group.data.fillNumX = 6;
            addSquares(group);
            prevGroup.removeChildren();
            hideVertCutLines(group);
        }
        group.data.isCuttableVert = false;
    }
};

function showVertCutLines(event, group) {
    if(group != undefined){
        if(!group.data.isCuttableVert){
            console.log("Erase Before Cutting!")
            vertCutFlag = false;
        }
        else if(vertCutFlag){
            //console.log(event.point.x);
            hideVertCutLines(group);
            if(event.point.x > (group.data.WIDTH/3)+group.data.CENTER_X && event.point.x < 2*(group.data.WIDTH/3)+group.data.CENTER_X){
                //console.log(2);
                group.children[1+(group.data.fillNumX*group.data.fillNumY)].visible = true;
            } else if(event.point.x > (group.data.WIDTH/4)+group.data.CENTER_X && event.point.x < 3*(group.data.WIDTH/4)+group.data.CENTER_X){
                //console.log(3);
                group.children[2+(group.data.fillNumX*group.data.fillNumY)].visible = true;
                group.children[3+(group.data.fillNumX*group.data.fillNumY)].visible = true;
            } else if(event.point.x > (group.data.WIDTH/5)+group.data.CENTER_X && event.point.x < 4*(group.data.WIDTH/5)+group.data.CENTER_X){
                //console.log(4);
                group.children[4+(group.data.fillNumX*group.data.fillNumY)].visible = true;
                group.children[5+(group.data.fillNumX*group.data.fillNumY)].visible = true;
                group.children[6+(group.data.fillNumX*group.data.fillNumY)].visible = true;
            } else if(event.point.x > (group.data.WIDTH/6)+group.data.CENTER_X && event.point.x < 5*(group.data.WIDTH/6)+group.data.CENTER_X){
                //console.log(5);
                group.children[7+(group.data.fillNumX*group.data.fillNumY)].visible = true;
                group.children[8+(group.data.fillNumX*group.data.fillNumY)].visible = true;
                group.children[9+(group.data.fillNumX*group.data.fillNumY)].visible = true;
                group.children[10+(group.data.fillNumX*group.data.fillNumY)].visible = true;
            } else {
                //console.log(6);
                group.children[11+(group.data.fillNumX*group.data.fillNumY)].visible = true;
                group.children[12+(group.data.fillNumX*group.data.fillNumY)].visible = true;
                group.children[13+(group.data.fillNumX*group.data.fillNumY)].visible = true;
                group.children[14+(group.data.fillNumX*group.data.fillNumY)].visible = true;
                group.children[15+(group.data.fillNumX*group.data.fillNumY)].visible = true;
            }
        }
    }
};

function eraseFunc(event, group){
    if(eraseFlag){
        if(group != undefined){
            paintColor = 'white';
            group.data.fillNumX = 1;
            group.data.fillNumY = 1;
            group.data.isCuttableVert = true;
            group.data.isCuttableHoriz = true;
            group.removeChildren();
            addBackdrop(group);
            addSquares(group);
            prevGroup.removeChildren();
            addVertLines(group);
            addHorizLines(group);
        }
    }
};

function cutSelect(event, group){
    if(vertCutFlag){
        vertCutSelect(event, group);
    }
    
    if (horizCutFlag){
        horizCutSelect(event, group);
    }
    
    if (paintFlag){
        if(this.fillColor == paintColor){
            this.fillColor = 'white'
        }
        else{
            this.fillColor = paintColor;
        }
    }
};

//done
function showCutLines(event, group){
    if(vertCutFlag){
        showVertCutLines(event, group);
    }
    
    if (horizCutFlag){
        showHorizCutLines(event, group);
    }
};

function addSquares(group){
    var local_Center_X = group.data.CENTER_X;
    for(var i = 0; i < group.data.fillNumX; i++){
        var local_Center_Y = group.data.CENTER_Y;
        for(var j = 0; j < group.data.fillNumY; j++){
            var temp;
            temp = new Path.Rectangle(new Point(local_Center_X, local_Center_Y), group.data.WIDTH/group.data.fillNumX, group.data.HEIGHT/group.data.fillNumY);
            temp.strokeColor = 'black';
            temp.strokeWidth = 4;
            temp.fillColor = paintColor;
            if(prevGroup.children.length > 0){
                for(var k = 0; k < prevGroup.children.length; k++){
                    if(doOverlap(prevGroup.children[k].segments[0].point, prevGroup.children[k].segments[2].point, temp.segments[0].point, temp.segments[2].point)){
                        temp.fillColor = prevGroup.children[k].fillColor;
                    }
                }
            }
            
            temp.onClick = function(event){
                var group;
                for(var i = 0; i < groupArray.length; i++){
                    if(event.point.x >= groupArray[i].data.CENTER_X && event.point.x <= groupArray[i].data.CENTER_X + groupArray[i].data.WIDTH && event.point.y >= groupArray[i].data.CENTER_Y && event.point.y <= groupArray[i].data.CENTER_Y + groupArray[i].data.HEIGHT){
                        group = groupArray[i];
                    }
                }
                if(vertCutFlag){
                    vertCutSelect(event, group);
                }
                
                if (horizCutFlag){
                    horizCutSelect(event, group);
                }
                
                if(eraseFlag){
                    eraseFunc(event, group);
                }
                
                if (paintFlag){
                    if(this.fillColor == paintColor){
                        this.fillColor = 'white'
                    }
                    else{
                        this.fillColor = paintColor;
                    }
                }
            };
            temp.onMouseMove = function(event){
                var group;
                for(var i = 0; i < groupArray.length; i++){
                    if(event.point.x >= groupArray[i].data.CENTER_X && event.point.x <= groupArray[i].data.CENTER_X + groupArray[i].data.WIDTH && event.point.y >= groupArray[i].data.CENTER_Y && event.point.y <= groupArray[i].data.CENTER_Y + groupArray[i].data.HEIGHT){
                        group = groupArray[i];
                    }
                }
                //console.log(unitSquare.data);
                if(vertCutFlag){
                    for(var i = 0; i < groupArray.length; i++){
                        hideVertCutLines(groupArray[i]);
                    }
                    showVertCutLines(event, group);
                }
                
                if (horizCutFlag){
                    for(var i = 0; i < groupArray.length; i++){
                        hideHorizCutLines(groupArray[i]);
                    }
                    showHorizCutLines(event, group);
                }
            };
            
            if(group.data.type != "answ"){
                temp.onMouseDown = bringToFront;
                temp.onMouseDrag = moveActive;
                temp.onMouseUp = endMove;
            }
            
            group.insertChild(1,temp);
            local_Center_Y += group.data.WIDTH/group.data.fillNumY;
        }  
        local_Center_X += group.data.WIDTH/group.data.fillNumX;
    }
    hideVertCutLines(group);
    hideHorizCutLines(group);
    vertCutFlag = false;
    horizCutFlag = false;
};

function removeSquares(group){
    group.removeChildren(group.data.offset, group.data.fillNumX * group.data.fillNumY + 1);
};




var activeButton = null;

function updateSelectedClass(){
    verticalcut.classList.remove('selected');
    horizCutTool.classList.remove('selected');
    moveTool.classList.remove('selected');
    eraseTool.classList.remove('selected');

    activeButton.classList.add('selected');
}

// Vertical Toggle Button
var verticalcut = document.getElementById("vertcutImg");

//Vertical Cut toggle
verticalcut.addEventListener("click",function(){
    activeButton = this;

    if(!vertCutFlag){
        for(var i = 0; i < groupArray.length; i++){
            hideHorizCutLines(groupArray[i]);
            hideVertCutLines(groupArray[i]);
        }
        vertCutFlag = true;
        horizCutFlag = false;
        paintFlag = false;
        isMovable = false;
        eraseFlag = false;
        //paletteGroup.removeChildren();
        paintColor = 'white';
    } else {
        //hide any other groups with vert lines here
        hideVertCutLines(unitSquare);
        vertCutFlag = false;
    }
    updateSelectedClass();
})

// Horizontal Toggle Button
var horizCutTool = document.getElementById("horizCutimg");

//Horizontal Cut toggle
horizCutTool.addEventListener("click",function(){
    activeButton = this;
    if(!horizCutFlag){
        for(var i = 0; i < groupArray.length; i++){
            hideHorizCutLines(groupArray[i]);
            hideVertCutLines(groupArray[i]);
        }
        horizCutFlag = true;
        vertCutFlag = false;
        paintFlag = false;
        isMovable = false;
        eraseFlag = false;
        //paletteGroup.removeChildren();
        paintColor = 'white';
    } else {
        //hide any other groups with horiz lines here
        hideHorizCutLines(unitSquare);
        horizCutFlag = false;
    }
    updateSelectedClass();

})


//Color Toggle Button
var paintTool = document.getElementById("palletImg");
            
var colorBlot1 = document.getElementById("colorBlot1");
var colorBlot2 = document.getElementById("colorBlot2");
var colorBlot3 = document.getElementById("colorBlot3");


colorBlot1.addEventListener("click",function(){
    paintColor = "#FCFF00"; // yellow 
    for(var i = 0; i < groupArray.length; i++){
        hideHorizCutLines(groupArray[i]);
        hideVertCutLines(groupArray[i]);
    }
    paintFlag = true;
    vertCutFlag = false;
    horizCutFlag = false;
    isMovable = false;
    eraseFlag = false;
    activeButton = null;
    updateSelectedClass();

    
})

colorBlot2.addEventListener("click",function(){
    paintColor = "#71F479"; // green
    for(var i = 0; i < groupArray.length; i++){
        hideHorizCutLines(groupArray[i]);
        hideVertCutLines(groupArray[i]);
    }
    paintFlag = true;
    vertCutFlag = false;
    horizCutFlag = false;
    isMovable = false;
    eraseFlag = false;
    activeButton = null;
    updateSelectedClass();

    
})

colorBlot3.addEventListener("click",function(){
    paintColor = "#EE9CFF"; //pink
    for(var i = 0; i < groupArray.length; i++){
        hideHorizCutLines(groupArray[i]);
        hideVertCutLines(groupArray[i]);
    }
    paintFlag = true;
    vertCutFlag = false;
    horizCutFlag = false;
    isMovable = false;
    eraseFlag = false;
    activeButton = null;
    updateSelectedClass();

})

colorBlot4.addEventListener("click",function(){
    paintColor = "#FF474C"; // red 
    for(var i = 0; i < groupArray.length; i++){
        hideHorizCutLines(groupArray[i]);
        hideVertCutLines(groupArray[i]);
    }
    paintFlag = true;
    vertCutFlag = false;
    horizCutFlag = false;
    isMovable = false;
    eraseFlag = false;
    activeButton = null;
    updateSelectedClass();

    
})




// Move Toggle Button
var moveTool = document.getElementById("moveImg")

//Horizontal Cut toggle
moveTool.addEventListener("mousedown",function(){
    activeButton = this;
    if(!isMovable){
        for(var i = 0; i < groupArray.length; i++){
            hideHorizCutLines(groupArray[i]);
            hideVertCutLines(groupArray[i]);
        }
        isMovable = true;
        horizCutFlag = false;
        vertCutFlag = false;
        paintFlag = false;
        eraseFlag = false;
        //paletteGroup.removeChildren();
        paintColor = 'white';
    } else {
        isMovable = false;
    }
    updateSelectedClass();

})

// Answer Check Button
var answTool = document.getElementById("answToolImg");


//Answer Check Function
answTool.addEventListener("click",function(){
    var counter = 0;
    var answ = (num1 / denom1) + (num2 / denom2);
    
    for(var i = 0 + answerSquare.data.offset; i <= answerSquare.data.fillNumX * answerSquare.data.fillNumY; i++){
        if(answerSquare.children[i].fillColor == 'aquamarine'){
            counter++;
        }
    }
    userAnsw = counter / (answerSquare.data.fillNumX * answerSquare.data.fillNumY);
    if(answ.toFixed(6) == userAnsw.toFixed(6)){
        console.log(true);
        document.getElementById('checkImg_visual').style.display='inline-block';
        alert("Correct");

    } else {
        console.log(false);
        alert("Try again - reset the problem to start over");

    }
})

// Erase Button
var eraseTool = document.getElementById("eraseImg");

//Erase Function
eraseTool.addEventListener("click",function(){
    activeButton = this;
    if(!eraseFlag){
        for(var i = 0; i < groupArray.length; i++){
            hideHorizCutLines(groupArray[i]);
            hideVertCutLines(groupArray[i]);
        }
        isMovable = false;
        horizCutFlag = false;
        vertCutFlag = false;
        paintFlag = false;
        eraseFlag = true;
        //paletteGroup.removeChildren();
        paintColor = 'white';
    } else {
        eraseFlag = false;
    }
    updateSelectedClass();

})

var resetTool = document.getElementById("resetImg");
    resetTool.addEventListener("click",function(){
    location.reload();
})

addBackdrop(unitSquare);
addBackdrop(otherSquare);
addBackdrop(answerSquare);

addSquares(unitSquare);
prevGroup.removeChildren();
addSquares(otherSquare);
prevGroup.removeChildren();
addSquares(answerSquare);
prevGroup.removeChildren();

addVertLines(unitSquare);
addVertLines(otherSquare);
addVertLines(answerSquare);

addHorizLines(unitSquare);
addHorizLines(otherSquare);
addHorizLines(answerSquare);

