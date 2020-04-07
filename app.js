//Cache The Dom
let topCells = document.querySelectorAll('.row-top')
let allCells = document.querySelectorAll('.cell:not(.row-top)')
let resetButton = document.querySelector('.reset');
let statusSpan = document.querySelector('.status');

const column0 = [allCells[35], allCells[28], allCells[21], allCells[14], allCells[7], allCells[0], topCells[0]];
const column1 = [allCells[36], allCells[29], allCells[22], allCells[15], allCells[8], allCells[1], topCells[1]];
const column2 = [allCells[37], allCells[30], allCells[23], allCells[16], allCells[9], allCells[2], topCells[2]];
const column3 = [allCells[38], allCells[31], allCells[24], allCells[17], allCells[10], allCells[3], topCells[3]];
const column4 = [allCells[39], allCells[32], allCells[25], allCells[18], allCells[11], allCells[4], topCells[4]];
const column5 = [allCells[40], allCells[33], allCells[26], allCells[19], allCells[12], allCells[5], topCells[5]];
const column6 = [allCells[41], allCells[34], allCells[27], allCells[20], allCells[13], allCells[6], topCells[6]];
const columns = [column0, column1, column2, column3, column4, column5, column6];

// rows
const topRow = [topCells[0], topCells[1], topCells[2], topCells[3], topCells[4], topCells[5], topCells[6]];
const row0 = [allCells[0], allCells[1], allCells[2], allCells[3], allCells[4], allCells[5], allCells[6]];
const row1 = [allCells[7], allCells[8], allCells[9], allCells[10], allCells[11], allCells[12], allCells[13]];
const row2 = [allCells[14], allCells[15], allCells[16], allCells[17], allCells[18], allCells[19], allCells[20]];
const row3 = [allCells[21], allCells[22], allCells[23], allCells[24], allCells[25], allCells[26], allCells[27]];
const row4 = [allCells[28], allCells[29], allCells[30], allCells[31], allCells[32], allCells[33], allCells[34]];
const row5 = [allCells[35], allCells[36], allCells[37], allCells[38], allCells[39], allCells[40], allCells[41]];
const rows = [row0, row1, row2, row3, row4, row5, topRow];


//variables
let gameisLive = true;
let yellowIsNext = true;


//Event Handlers;

function getClassArray(cell){
    let classList = [...cell.classList];
    return classList;
}

function getCellLocation (cell){
    let classArray = getClassArray(cell);
    let rowClass = classArray.find((className) => {
        return className.includes('row');
    });
    let colClass = classArray.find((className) => {
        return className.includes('col');
    })
    let rowIndex = Number(rowClass[4]);
    let colIndex = Number(colClass[4]);
    return [rowIndex, colIndex]
}

function handleMouseOver(e){
    let cell = e.target;
    let classArray = getClassArray(cell);
    let [row, col] = getCellLocation(cell);
    let topCell = topRow[col];
    yellowIsNext ? topCell.classList.add('yellow') : topCell.classList.add('red')
}
function handleMouseOut(e){
    let cell = e.target;
    let [row, col] = getCellLocation(cell);
    let topCell = topRow[col];
    clearColorFromTop(col)
}

function getFirstOpenCellForColumn(colIndex){
    let column = columns[colIndex];
    let columnWithoutTop = column.slice(0, 6);
    for(let cell of columnWithoutTop){
        let classLists = getClassArray(cell);
        if(!classLists.includes('yellow') && !classLists.includes('red')){
            return cell;
        }
    }
    return null;
}

function clearColorFromTop(colIndex){
    let topCell = topCells[colIndex];
    topCell.classList.remove('yellow');
    topCell.classList.remove('red');
}

function handleCellClick(e){
    let cell = e.target;
    let [row, col] = getCellLocation(cell);
    let openCell = getFirstOpenCellForColumn(col);
    let topCell = topRow[col];
    if(!openCell) return;
    if(yellowIsNext){
        clearColorFromTop(col);
        openCell.classList.add('yellow');
        topCell.classList.add('red');
    } else {
        clearColorFromTop(col)
        openCell.classList.add('red');
        topCell.classList.add('yellow')
    };

    checkStatus(openCell)
    //We need to check the status of the game, did someone win?
    yellowIsNext = !yellowIsNext;
}

function getColorOfCell(cell){
    let classList = getClassArray(cell);
    if (classList.includes('yellow')) {
        return 'yellow';
    };
    if (classList.includes('red')) {
        return 'red';
    }
    return null;
}

function checkVictory(array){
    if(array.length >= 4){
        gameisLive = false;
        for(let cell of array){
            cell.classList.add('win');
        }
        statusSpan.textContent = `${yellowIsNext ? 'Yellow' : 'Red'} has won`
    }
}

function checkStatus(cell){
    // debugger;
    let[row, col] = getCellLocation(cell);
    let color = getColorOfCell(cell);
    if(!color) return;
    //Check horizontally
    let winningCells = [cell];
    console.log(winningCells);
    let rowToCheck = row;
    let colToCheckLeft = col - 1;
    //Check Left
    while (colToCheckLeft >= 0){
        let cellToCheck = rows[rowToCheck][colToCheckLeft];
        if(getColorOfCell(cellToCheck) == color){
            winningCells.push(cellToCheck);
            colToCheckLeft--
        } else {
            break;
        }
    };
    let colToCheckRight = col + 1;
    //Check Right
    while (colToCheckRight <= 6) {
        let cellToCheck = rows[rowToCheck][colToCheckRight];
        if (getColorOfCell(cellToCheck) === color) {
            winningCells.push(cellToCheck);
            colToCheckRight++
        } else {
            break;
        }
    }
    checkVictory(winningCells);
}

for(let row of rows){
    for(let cell of row){
        cell.addEventListener('mouseover', handleMouseOver);
        cell.addEventListener('mouseout', handleMouseOut);
        cell.addEventListener('click', handleCellClick);

    }
}