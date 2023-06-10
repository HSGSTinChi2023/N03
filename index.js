const gameBox = document.getElementById("gameBox");

const boardDefault = {
    numCol: 8,
    numRow: 8,
    numObjectives: 8,
    timerId: -1,
    clickState: 0,
    clickRow: -1,
    clickCol: -1,
    clickCell: null,
    gameTime: 210,
    numObjectivesCompleted: 0,
    gameEnded: false,
};

var boardInfo = {};
Object.assign(boardInfo, boardDefault);

var gameData = new Array(boardInfo.numRow);
    gameData[0] = new Array(8,4,3,2,3,4,3,3);
    gameData[1] = new Array(2,6,4,2,4,4,5,2);
    gameData[2] = new Array(2,6,7,8,8,5,0,7);
    gameData[3] = new Array(6,5,3,4,4,8,7,2);
    gameData[4] = new Array(5,6,6,0,1,8,2,3);
    gameData[5] = new Array(2,1,2,2,9,7,4,2);
    gameData[6] = new Array(8,3,7,9,3,1,2,8);
    gameData[7] = new Array(4,9,9,8,5,6,0,0);

var gameSolutions = new Array("5 5 0 5", "4 4 4 0", "7 2 2 7", "6 0 2 4", "0 2 0 7", "1 2 6 7", "2 0 7 5", "1 2 1 7");
var solutionsFound = new Array(boardInfo.numObjectives).fill(false);

function hashLocation(i,j){
    return i*boardInfo.numCol + j;
}

function startTimer() {
    boardInfo.timerId = setInterval(function () {
        console.log(boardInfo.timerId);
        boardInfo.gameTime--;
        if(!boardInfo.gameTime){
            gameEnd(0);
        }
        document.getElementById(
            "timer"
        ).innerHTML = `⏲️: ${boardInfo.gameTime}`;
    }, 1000);
}

function stopTimer(id) {
    clearInterval(id);
}
    
function clickEvent(event){
    if (event.which == 1) cellClick(this, this.i, this.j);
}

function addCellListener(cell, i, j) {
    cell.addEventListener("mousedown", clickEvent);
}

function cellClick(cell, i, j){
    if(boardInfo.clickState){
        
        checkValidLine(boardInfo.clickRow, boardInfo.clickCol, i, j);
        boardInfo.clickState = 0;
        boardInfo.clickCell.classList.remove("btn-danger");
    }
    else{
        cell.classList.add("btn-danger");
        boardInfo.clickState = 1;
        boardInfo.clickCell = cell;
        boardInfo.clickCol = j;
        boardInfo.clickRow = i;
    }
}

function checkValidLine(row1, col1, row2, col2){
    var string1 = `${row1} ${col1} ${row2} ${col2}`;
    var string2 = `${row2} ${col2} ${row1} ${col1}`;
    console.log(string1, string2);
    var solIndex1 = gameSolutions.findIndex(e => e == string1);
    var solIndex2 = gameSolutions.findIndex(e => e == string2);
    console.log(solIndex1,solIndex2);
    if(solIndex1 != -1 || solIndex2 != -1){
        var solIndex;
        if(solIndex1!=-1) solIndex=solIndex1;
        else solIndex = solIndex2;
        
        console.log(solIndex);
        if(solutionsFound[solIndex]){
            return;
        }
        else{
            solutionsFound[solIndex]=true;
        }

        markCells(row1,col1,row2,col2);
        boardInfo.numObjectivesCompleted++;
        var gameProgress = document.getElementById("gameProgress");
        gameProgress.textContent = `Found: ${boardInfo.numObjectivesCompleted}`;

        
        var questionFound = document.getElementById(`q${solIndex+1}`);
        questionFound.classList.add("text-success");
        questionFound.classList.add("fw-bold");
        
        if(boardInfo.numObjectivesCompleted >= boardInfo.numObjectives){
            gameEnd(1);
        }
    }
}

function markCells(row1, col1, row2, col2){
    if(row1 === row2){
        for(var i = Math.min(col1,col2); i <= Math.max(col1, col2); i++){
            var currentCell = document.getElementById(hashLocation(row1,i));
            currentCell.classList.add("btn-success");
        } 
    }
    else if(col1 === col2){
        for(var i = Math.min(row1,row2); i <= Math.max(row1, row2); i++){
            var currentCell = document.getElementById(hashLocation(i,col1));
            currentCell.classList.add("btn-success");
        } 
    }
    else{
        if(row1 > row2){
            [row1, row2] = [row2, row1];
            [col1, col2] = [col2, col1];
        }
        for(var i = row1; i<=row2; ){
            console.log(row1, col1, row2, col2);
            if(col1 > col2){
                for(var j=col1;j>=col2;i++,j--){
                    var currentCell = document.getElementById(hashLocation(i,j));
                    currentCell.classList.add("btn-success");
                }
            }
            else{
                for(var j=col1;j<=col2;i++,j++){
                    var currentCell = document.getElementById(hashLocation(i,j));
                    currentCell.classList.add("btn-success");
                }
            }
        }
    }
}

function init(){
    // Cleanup
    stopTimer(boardInfo.timerId);
    Object.assign(boardInfo, boardDefault);
    document.getElementById("endGame").innerHTML = "";
    document.getElementById(
        "timer"
    ).innerHTML = `⏲️: ${boardInfo.gameTime}`;
    document.getElementById("gameProgress").innerHTML = "Found: 0";
    document.getElementById("startGame").innerHTML = "Begin!";
    
    for(var i=1;i<=boardInfo.numObjectives;i++){
        var currentCell = document.getElementById(`q${i}`);
        currentCell.className = "";
    }

    // Renew game data
    var gameTable = document.getElementById("gameTable");
    gameTable.innerHTML = "";
    //console.log(gameData);
    
    for(var i=0;i<boardInfo.numRow;i++){
        var currentRow = document.createElement("tr");
        for(var j=0;j<boardInfo.numCol;j++){
            var currentCell = document.createElement("td");
            currentCell.classList.add("btn");
            currentCell.classList.add("btn-lg");
            currentCell.classList.add("btn-secondary");
            currentCell.textContent = gameData[i][j];
            currentCell.id = hashLocation(i,j);
            currentRow.appendChild(currentCell);
            currentCell.i = i;
            currentCell.j = j;
        }
        gameTable.appendChild(currentRow);
    }
    
    
}

function game(){
    init();
    document.getElementById("startGame").innerHTML = "Restart?";
    for(var i=0;i<boardInfo.numRow;i++){
        for(var j=0;j<boardInfo.numCol;j++){
            var currentCell = document.getElementById(hashLocation(i,j));
            addCellListener(currentCell,i,j);
        }
    }
    startTimer();
}

function gameEnd(state){
    var endGameText = document.getElementById("endGame");
    stopTimer(boardInfo.timerId);
    if(state){
        endGameText.textContent = "You win!";
    }
    else{
        endGameText.textContent = "Out of time!";  
    }

    for(var i=0;i<boardInfo.numRow;i++){
        for(var j=0;j<boardInfo.numCol;j++){
            var currentCell = document.getElementById(hashLocation(i,j));
            currentCell.removeEventListener("mousedown", clickEvent);
            console.log("event removed");
        }
    }
}

window.addEventListener("load", function () {
    init();
});