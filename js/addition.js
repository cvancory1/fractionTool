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
 
 groupArray = [unitSquare, otherSquare, answerSquare];
 
 var origPos;
 
 function doOverlap(l1,  r1,  l2,  r2) {
     console.log("doOverlap");
  
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
     console.log("savePrev");
     for(var i = 0; i < group.data.fillNumX * group.data.fillNumY; i++){
         //add if to filter out white
         var temp = group.children[group.data.offset+i].clone();
         prevGroup.addChild(temp);    
     }
 };
 
 function bringToFront(event){
     console.log("bringToFront");
     if(isMovable){
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
     console.log("moveActive");
     if(this.fillColor != 'grey' && isMovable == true){
         //console.log(event.delta);
         this.position += event.delta
     }
 };
 
 function endMove(event){
     console.log("endMove");
     //console.log(this.exportJSON(this));
     if(isMovable){
         console.log("Here0");
         console.log(answerSquare.children.length);
         for(var i = 0; i < answerSquare.data.fillNumX * answerSquare.data.fillNumY; i++){
             if(answerSquare.children[answerSquare.data.offset+i].bounds.contains(event.point) && (Math.trunc(answerSquare.children[answerSquare.data.offset+i].bounds.width) == Math.trunc(this.bounds.width) && Math.trunc(answerSquare.children[answerSquare.data.offset+i].bounds.height) == Math.trunc(this.bounds.height) || Math.trunc(answerSquare.children[answerSquare.data.offset+i].bounds.height) == Math.trunc(this.bounds.width) && Math.trunc(answerSquare.children[answerSquare.data.offset+i].bounds.width) == Math.trunc(this.bounds.height)) && answerSquare.children[answerSquare.data.offset+i].fillColor != 'aquamarine'){
                 console.log("Here1");
                 console.log(answerSquare.children.length);
                 answerSquare.children[answerSquare.data.offset+i].fillColor = 'aquamarine';
                 console.log("Here2");
                 console.log(answerSquare.children.length);
                 this.fillColor = 'grey';
                 this.position = origPos;


             }
             else{
                 this.position = origPos;
             }
         }
         
         for(var i = 0; i < groupArray.length; i++){
             if(groupArray[i].children.length < groupArray[i].data.offset + groupArray[i].data.fillNumX * groupArray[i].data.fillNumY + (groupArray[i].data.totalCuts * 2)){
                 var activeTemp = project.activeLayer.lastChild;
                 groupArray[i].insertChild(groupArray[i].data.offset,activeTemp);
             }
             
         }
     }
 };
 
 function addBackdrop(group){
     console.log("addBackdrop");
     var backdrop = new Path.Rectangle(new Point(group.data.CENTER_X, group.data.CENTER_Y), group.data.WIDTH, group.data.HEIGHT);
     backdrop.strokeColor = 'black';
     backdrop.strokeWidth = 4;
     backdrop.fillColor = 'grey';
     group.addChild(backdrop);
 };
 
 //add all vertical division lines as children
 function addVertLines(group){
     console.log("addVertLines");
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
                 console.log("vertLineOnClick");
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
     console.log("addHorizLines");
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
                 console.log("horizLineOnClick");
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
     console.log("hideHorizCutLines");
     if(horizCutFlag){
         if(group != undefined){
             for(var i=(group.data.fillNumX*group.data.fillNumY)+group.data.totalCuts; i<group.children.length; i++){
                 group.children[i].visible = false;
             }
         }
     }
 };
 
 function horizCutSelect(event, group){
     console.log("horizCutSelect");
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
     console.log("showHorizCutLines");
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
     console.log("hideVertCutLines");
     if(vertCutFlag){
         if(group != undefined){
             for(var i=1+(group.data.fillNumX*group.data.fillNumY); i<group.data.totalCuts+1+(group.data.fillNumX*group.data.fillNumY); i++){
                 group.children[i].visible = false;
             }
         }
     }
 }
 
 function vertCutSelect(event, group){
     console.log("vertCutSelect");
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
     console.log("showVertCutLines");
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
     console.log("cutSelect");
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
     console.log("showCutLines");
     if(vertCutFlag){
         showVertCutLines(event, group);
     }
     
     if (horizCutFlag){
         showHorizCutLines(event, group);
     }
 };
 
 function addSquares(group){
     console.log("addSquares");
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
                 console.log("squareOnClick");
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
                 console.log("squareMouseMove");
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
     console.log("removeSquares");
     group.removeChildren(group.data.offset, group.data.fillNumX * group.data.fillNumY + 1);
 };
 
 
 
   
 // Reset toggle button 
 var resetTool = document.getElementById("resetImg");
 resetTool.addEventListener("click",function(){
     location.reload();
 })
 
 
 
 // Vertical Toggle Button
 var verticalcut = document.getElementById("vertcutImg");
 
 //Vertical Cut toggle
 verticalcut.addEventListener("click",function(){
     if(!vertCutFlag){
         for(var i = 0; i < groupArray.length; i++){
             hideHorizCutLines(groupArray[i]);
             hideVertCutLines(groupArray[i]);
         }
         vertCutFlag = true;
         horizCutFlag = false;
         paintFlag = false;
         isMovable = false;
         paletteGroup.removeChildren();
         paintColor = 'white';
     } else {
         //hide any other groups with vert lines here
         hideVertCutLines(unitSquare);
         vertCutFlag = false;
     }
 })
 
 // Horizontal Toggle Button
 var horizCutTool = document.getElementById("horizCutimg");

 
 //Horizontal Cut toggle
 horizCutTool.addEventListener("click",function(){

     if(!horizCutFlag){
         for(var i = 0; i < groupArray.length; i++){
             hideHorizCutLines(groupArray[i]);
             hideVertCutLines(groupArray[i]);
         }
         horizCutFlag = true;
         vertCutFlag = false;
         paintFlag = false;
         isMovable = false;
         paletteGroup.removeChildren();
         paintColor = 'white';
     } else {
         //hide any other groups with horiz lines here
         hideHorizCutLines(unitSquare);
         horizCutFlag = false;
     }
 })
 
 //Color Toggle Button
 var paintTool = document.getElementById("palletImg");

 
 //Palette Set Up
 var paletteGroup = new Group();
 
 //Show Palette
 paintTool.addEventListener("click",function(){

     if(!paintFlag){
         for(var i = 0; i < groupArray.length; i++){
             hideHorizCutLines(groupArray[i]);
             hideVertCutLines(groupArray[i]);
         }
         paintFlag = true;
         vertCutFlag = false;
         horizCutFlag = false;
         isMovable = false;
         
         //create Palette
         var totalX = 50;
         var totalY = 125;
         for (var i = 0; i < 3; i++) {
             var temp = new Path.Rectangle(new Point(totalX, totalY), 50, 50);
             
             paletteGroup.addChild(temp);
             
             totalX += 75;
         }
         
         temp.onMouseDown = function(event){
                 paintColor = temp.fillColor;
                 //console.log(temp.fillColor);
             }
         
         paletteGroup.strokeColor = 'black';
         paletteGroup.strokeWidth = 4;
         
         paletteGroup.children[0].fillColor = 'red';
         paletteGroup.children[0].onMouseDown = function(event){
             paintColor = paletteGroup.children[0].fillColor;
             //console.log(paletteGroup.children[0].fillColor);
         }
         
         paletteGroup.children[1].fillColor = 'blue';
         paletteGroup.children[1].onMouseDown = function(event){
             paintColor = paletteGroup.children[1].fillColor;
             //console.log(paletteGroup.children[1].fillColor);
         }
         
         paletteGroup.children[2].fillColor = 'green';
         paletteGroup.children[2].onMouseDown = function(event){
             paintColor = paletteGroup.children[2].fillColor;
             //console.log(paletteGroup.children[2].fillColor);
         }
         
     } else {
         paintFlag = false;
         paletteGroup.removeChildren()
         paintColor = 'white'
     }
 })
 
 // Move Toggle Button
 var moveTool = document.getElementById("moveImg");
 
 
 //Move toggle
 moveTool.addEventListener("mousedown",function(){

     if(!isMovable){
         for(var i = 0; i < groupArray.length; i++){
             hideHorizCutLines(groupArray[i]);
             hideVertCutLines(groupArray[i]);
         }
         isMovable = true;
         horizCutFlag = false;
         vertCutFlag = false;
         paintFlag = false;
         paletteGroup.removeChildren();
         paintColor = 'white';
     } else {
         isMovable = false;
     }
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
     //precision broken
     if(answ.toFixed(4) == userAnsw.toFixed(4)){
         console.log(true);
         document.getElementById('checkImg_visual').style.display='inline-block';


     } else {
         console.log(false);
         alert("Try again - reset the problem to start over");
     }
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
 