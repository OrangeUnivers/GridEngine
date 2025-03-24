const gridParent = document.getElementById('grid-container');
const gridError = document.getElementById('grid-error');

let scale = 1;
let lastPosX = 0;
let lastPosY = 0;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;

let mapped = [["dirt", "jungle_planks", ""], ["jungle_planks", "valentin", "dirt"], ["jungle_planks", "dirt", "dirt"], ["jungle_planks", "dirt", "dirt"], ["jungle_planks", "dirt", "dirt"], ["jungle_planks", "dirt", "dirt"], ["jungle_planks", "dirt", "dirt"], ["jungle_planks", "dirt", "dirt"], ["jungle_planks", "dirt", "dirt"], ["jungle_planks", "dirt", "dirt"], ["jungle_planks", "dirt", "dirt"]]

function handleError(error) {
    switch(error) {
        case "invalid-map":
            gridError.children[0].innerHTML = "<div>Something is wrong with the map\nError: " + error + "</div>";
        default:
            gridError.children[0].innerHTML = "<div>Something is wrong</div>";
    }
    gridError.style.opacity = 1;
    throw new Error();
}

function checkIfMapIsValid() {
    let foundExistingMap = NaN;
    mapped.forEach((_, i) => {
        if (mapped[i] == undefined) {
            return false;
        } else {
            foundExistingMap = i;
        }
    });

    if (mapped[foundExistingMap][0] == undefined) {
        return false;
    }
    return true;

}

function getSizeOfMap(localMap) {
    checkIfMapIsValid();
    let highestAmount = 0;
    mapped.forEach((v, i) => {
        if (v.length > highestAmount) {
            highestAmount == v.length;
        }
    });
    return {x: highestAmount, y: mapped.length};
}

function fetchUrl(src) {
    if (src == "valentin") {
        return src + ".jpg"
    }
    return src + ".png"

}

function getGridWidth() {
    if (checkIfMapIsValid()) {
        return Math.round(100/scale) * mapped[0].length
    }
    handleError()

}

function getGridHeight() {
    if (checkIfMapIsValid()) {
        return Math.round(100/scale) * mapped.length
    }
    handleError()

}

function getNumber(input) {
    let newNumbie = parseInt(input.replaceAll("px", ""))
    if (isNaN(newNumbie)) {
        return 0;
    }
    return newNumbie;

}
    

function multiplyString(list, amount, separator = "") {
    fullList = "";
    for (let x = 0; x < amount; x++) {
        if (x != amount-1) {
            fullList = fullList + list + separator
        } else {
            fullList = fullList + list
        }
    }
    return fullList;

}

let run = 0;

function drawMap() {
    gridParent.innerHTML = "";
    if (checkIfMapIsValid()) {
         for (let x = 0; x < mapped.length; x++) {
              for (let y = 0; y < mapped[0].length; y++) {
                    let gridElement = document.createElement("div");
                    if (mapped[x][y] != "") {
                         gridElement.innerHTML = "<img src='" + fetchUrl(mapped[x][y]) + "' alt='"+ run.toString() +"'>";
                    }
                    gridParent.append(gridElement)
              }
         }
         let pixels = (100/scale).toString() + "px"
         
         gridParent.style.gridTemplateColumns = multiplyString(pixels, mapped[0].length, " ");
         gridParent.style.gridAutoRows = pixels;
         run += 1
    } else {
        handleError("invalid-map")
    }
    return checkIfMapIsValid();

}

document.addEventListener('mousedown', (e) => {
    isDragging = true;
    gridParent.style.cursor = 'grabbing';
    lastPosX = e.clientX;
    lastPosY = e.clientY;

});

document.addEventListener('mouseup', () => {
    isDragging = false;
    gridParent.style.cursor = 'grab';

});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        offsetX = (lastPosX - e.clientX) * -1;
        lastPosX = e.clientX;
        offsetY = (lastPosY - e.clientY) * -1;
        lastPosY = e.clientY;
        gridParent.style.left = (getNumber(gridParent.style.left) + offsetX).toString() + "px";
        gridParent.style.top = (getNumber(gridParent.style.top) + offsetY).toString() + "px";
    }

});

document.addEventListener('wheel', (e) => {
    // e.preventDefault();

    let previousScale = scale;
    const zoomFactor = 0.05;
    scale += e.deltaY > 0 ? -zoomFactor : zoomFactor;
    scale = Math.max(0.1, Math.min(scale, 10)); // Limit zoom range

    let scaleRatio = previousScale / scale;

    // Keep zoom centered around mouse cursor
    let gridRect = gridParent.getBoundingClientRect();
    let offsetX = e.clientX - gridRect.left;
    let offsetY = e.clientY - gridRect.top;

    let newLeft = e.clientX - offsetX * scaleRatio;
    let newTop = e.clientY - offsetY * scaleRatio;

    gridParent.style.left = Math.round(newLeft) + "px";
    gridParent.style.top = Math.round(newTop) + "px";

    drawMap();
});

drawMap()

gridParent.style.left = Math.round((window.innerWidth / 2) - (getGridWidth() / 2)).toString() + "px";

gridParent.style.top = Math.round((window.innerHeight / 2) - (getGridHeight() / 2)).toString() + "px";