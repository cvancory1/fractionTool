document.body.style.backgroundColor = "#ffd991";

// get url string and parse
queryString = window.location.search;
console.log(queryString);

// gets the fraction numbers
urlParams = new URLSearchParams(queryString);
num1 = urlParams.get('leftNum');
denom1 = urlParams.get('leftDenom');
num2 = urlParams.get('rightNum');
denom2 = urlParams.get('rightDenom');

//Global Variable Definition
var vertCutFlag = false;
var horizCutFlag = false;
var paintFlag = false;
var isMovable = false;
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


 groupArray = [unitSquare];

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
        var hitResult = project.hitTest(event.point);
    
        origPos = this.position;

        project.activeLayer.addChild(hitResult.item);
    
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
                strokeColor: 'gold',
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
                strokeColor: 'gold',
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
    }
};

function showHorizCutLines(event, group) {
    if(horizCutFlag){
        if(group != undefined){
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
    }
};

function showVertCutLines(event, group) {
    if(vertCutFlag){
        if(group != undefined){
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
                
                if (Diagonal.strokeColor == 'gold'){
                    if(this.fillColor == 'red'){
                        this.fillColor = 'purple'
                    }
                    else if(this.fillColor == 'purple' || this.fillColor == 'blue'){
                        this.fillColor = 'white'
                    }
                    else{
                        this.fillColor = 'blue'
                    }
                }
                if(revDiagonal.strokeColor == 'gold'){
                    if(this.fillColor == 'blue'){
                        this.fillColor = 'purple'
                    }
                    else if(this.fillColor == 'purple' || this.fillColor == 'red'){
                        this.fillColor = 'white'
                    }
                    else{
                        this.fillColor = 'red'
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
                //temp.onMouseDown = bringToFront;
                //temp.onMouseDrag = moveActive;
            // temp.onMouseUp = endMove;
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
        //paletteGroup.removeChildren();
        paintColor = 'white';
    } else {
        //hide any other groups with horiz lines here
        hideHorizCutLines(unitSquare);
        horizCutFlag = false;
    }
    updateSelectedClass();
})



addBackdrop(unitSquare);


addSquares(unitSquare);
prevGroup.removeChildren();



addVertLines(unitSquare);
addHorizLines(unitSquare);





 // Answer Check Button
var answTool = document.getElementById("answToolImg");

answTool.addEventListener("click",function(){
    
    var answ = (num1 / denom1) * (num2 / denom2);
    //var count = 0
    var ansCount = 0
    console.log(unitSquare.children.length)
    for(var i = 0; i < unitSquare.children.length; i++){
        if(unitSquare.children[i].fillColor == 'purple'){
            ansCount++
        }
    }
    var userAnsw = ansCount / (unitSquare.data.fillNumX * unitSquare.data.fillNumY);
    if(userAnsw == answ){
        //console.log(correct);
        alert("Correct!");
        document.getElementById('checkImg_visual').style.display='inline-block';


    }
    else{
        //console.log("NOT CORRECT  ansCount = " +ansCount);
        console.log("NOT CORRECT  answ = " + answ + " userAnsw= "+ userAnsw);
        alert("Try again - fraction is not correct");

    }
})


//TODO 
var isMovable = false
var Diagonal = new Path.Rectangle(new Point(325, 25), 50, 50);
Diagonal.strokeColor = 'black';
Diagonal.strokeWidth = 4;
Diagonal.fillColor = 'brown';

Diagonal.onClick = function(event){
    
    isMovable = !isMovable
    if(isMovable){
        Diagonal.strokeColor = 'gold'
    }
    else{
        Diagonal.strokeColor = 'black'
    }
}

var revDiagonal = new Path.Rectangle(new Point(425, 25), 50, 50);
revDiagonal.strokeColor = 'black';
revDiagonal.strokeWidth = 4;
revDiagonal.fillColor = 'purple';


revDiagonal.onClick = function(event){
    isMovable = !isMovable
    if(isMovable){
        revDiagonal.strokeColor = 'gold'
    }
    else{
        revDiagonal.strokeColor = 'black'
    }
}

// Reset toggle button 
var resetTool = document.getElementById("resetImg");
resetTool.addEventListener("click",function(){
    location.reload();
})
