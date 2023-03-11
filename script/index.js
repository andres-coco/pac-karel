var mapLength = 800;
var delayDuration = 200;
var firstDelayDuration = 100;

const Direction = Object.freeze({
	North: Symbol("north"),
	East: Symbol("east"),
	South: Symbol("south"),
	West: Symbol("west")
});

var fruitSources = [
    "images/apple.png",
    "images/cherry.png",
    "images/melon.png",
    "images/orange.png",
    "images/strawberry.png"
];

var fruits = [];

var dir = Direction.East;
var currentTileIndex = mapCount * (mapCount - 1);
var pocket = 0;
var stopped = false;

document.querySelector("h1").innerHTML = "Karel";
var runBtn = document.getElementById("runBtn");
var stopBtn = document.getElementById("stopBtn");
var map = document.getElementById("map");
map.style.width = mapLength + "px";
map.style.height = mapLength + "px";
var sizeSelect = document.getElementById("sizeSelect");
var mapCount =  5;
var savedMapSize = localStorage.getItem("mapSize");
if(savedMapSize != null) mapCount = parseInt(savedMapSize);
sizeSelect.value = mapCount;

map.style.gridTemplateColumns = "repeat(" + mapCount + ", 1fr)";
map.style.gridTemplateRows = "repeat(" + mapCount + ", 1fr)";
for(var i = 0; i < mapCount * mapCount; i++)
{
    map.appendChild(createElementWithClass("div", "tile"));
}
var tiles = map.children;
var karel = document.getElementById("karel");
moveToTile(getStartTileIndex());
karel.style.visibility = "visible";
karel.style.zIndex = 1;

var fruitsTotalCount = 0;

function createElementWithClass(typeName, className) {
    var element = document.createElement(typeName);
    element.className = className;
    return element;
}

function setMapCount() {
    mapCount = parseInt(sizeSelect.value);
    localStorage.setItem("mapSize", mapCount);
    map.style.gridTemplateColumns = "repeat(" + mapCount + ", 1fr)";
    map.style.gridTemplateRows = "repeat(" + mapCount + ", 1fr)";
    document.body.appendChild(karel);
    map.innerHTML = "";
    for(var i = 0; i < mapCount * mapCount; i++)
    {
        map.appendChild(createElementWithClass("div", "tile"));
    }
    tiles = map.children;
    resetKarel();
}

function getStartTileIndex() {
    return tileIndex = mapCount * (mapCount - 1);
}

function moveToTile(tileIndex) {
    if(tileIndex < 0 || tileIndex >= tiles.length)
    {
        console.error("Tile is out of bounds!");
        return;
    }
    tiles[tileIndex].appendChild(karel);
    currentTileIndex = tileIndex;
}

async function runKarel() {
    runBtn.disabled = true;
    stopBtn.disabled = false;
    sizeSelect.disabled = true;
    resetKarel();
    await new Promise((resolve) => {
        setTimeout(()=>{
            resolve();
        }, firstDelayDuration);
    });
    await main();
    runBtn.disabled = false;
    stopBtn.disabled = true;
    sizeSelect.disabled = false;
}

function resetKarel() {
    moveToTile(getStartTileIndex());
    dir = Direction.East;
    karel.style.rotate = "0deg";
    fruits.forEach(fruit => {
        fruit.remove();
    });
    for(let i = 0; i < tiles.length; i++) {
        tiles[i].style.backgroundColor = "transparent";
    }
    fruits = [];
    pocket = 0;
    stopped = false;
    fruitsTotalCount = 0;
}

function tick() {
    return new Promise((resolve) => {
        setTimeout(()=>{
            resolve();
        }, delayDuration);
    });    
}

function stopKarel() {
    stopped = true;
}

function checkStopped() {
    if(stopped) {
        runBtn.disabled = false;
        stopBtn.disabled = true;
        sizeSelect.disabled = false;
        throw("Program stopped");
    }
}

//Internals

async function internal_move() {
    var desiredTileIndex;
    switch(dir) {
        case Direction.North:
            desiredTileIndex = currentTileIndex -mapCount;
            break;
        case Direction.East:
            if((currentTileIndex +1) % mapCount == 0) desiredTileIndex = -1;
            else desiredTileIndex = currentTileIndex +1;
            break;
        case Direction.South:
            desiredTileIndex = currentTileIndex + mapCount;
            break;
        case Direction.West:
            if(currentTileIndex % mapCount == 0) desiredTileIndex = -1;
            else desiredTileIndex = currentTileIndex -1;
            break;            
    }
    moveToTile(desiredTileIndex);
    checkStopped();
    await tick();
}

function internal_turnLeft() {
    switch(dir) {
        case Direction.North:
            dir = Direction.West;
            karel.style.rotate = "180deg";
            break;
        case Direction.East:
            dir = Direction.North;
            karel.style.rotate = "-90deg";
            break;
        case Direction.South:
            dir = Direction.East;
            karel.style.rotate = "0deg";
            break;
        case Direction.West:
            dir = Direction.South;
            karel.style.rotate = "90deg";
            break;            
    }
    checkStopped();
}

function internal_turnRight() {
    switch(dir) {
        case Direction.North:
            dir = Direction.East;
            karel.style.rotate = "0deg";
            break;
        case Direction.East:
            dir = Direction.South;
            karel.style.rotate = "90deg";
            break;
        case Direction.South:
            dir = Direction.West;
            karel.style.rotate = "180deg";
            break;
        case Direction.West:
            dir = Direction.North;
            karel.style.rotate = "-90deg";
            break;            
    }
    checkStopped();
}

function internal_dropFruit() {
    if(tiles[currentTileIndex].childElementCount > 1)
    {
        console.error("There is already a fruit on this tile");
        return;
    }
    var fruitIndex = Math.floor(Math.random() * fruitSources.length);
    var fruit = createElementWithClass("img", "fruit");
    fruit.setAttribute("src", fruitSources[fruitIndex]);
    fruit.setAttribute("alt", "fruit");
    fruit.setAttribute("id", "fruit_" + fruitsTotalCount)
    tiles[currentTileIndex].appendChild(fruit);
    fruits.push(fruit);
    fruitsTotalCount ++;
    checkStopped();
}

function internal_pickFruit() {
    if(tiles[currentTileIndex].childElementCount < 2)
    {
        console.error("There is no fruit on this tile");
        return;
    }
    var fruit = tiles[currentTileIndex].children[0];
    for (let i = 0; i < fruits.length; i++) {
        if(fruits[i].id == fruit.id) {
            fruits[i].remove();
            fruits.splice(i, 1);            
            break;
        }
    }
    pocket++;
    checkStopped();
}

function internal_paintTile(color) {
    tiles[currentTileIndex].style.backgroundColor = color;
    checkStopped();
}

//Conditions

function internal_frontIsClear() {
    var desiredTileIndex;
    switch(dir) {
        case Direction.North:
            desiredTileIndex = currentTileIndex -mapCount;
            break;
        case Direction.East:
            if((currentTileIndex +1) % mapCount == 0) desiredTileIndex = -1;
            else desiredTileIndex = currentTileIndex +1;
            break;
        case Direction.South:
            desiredTileIndex = currentTileIndex + mapCount;
            break;
        case Direction.West:
            if(currentTileIndex % mapCount == 0) desiredTileIndex = -1;
            else desiredTileIndex = currentTileIndex -1;
            break;          
    }
    return desiredTileIndex >= 0 && desiredTileIndex < tiles.length;
}

function internal_leftIsClear() {
    var desiredTileIndex;
    switch(dir) {
        case Direction.North:
            if(currentTileIndex % mapCount == 0) desiredTileIndex = -1;
            else desiredTileIndex = currentTileIndex -1;
            break;
        case Direction.East:
            desiredTileIndex = currentTileIndex -mapCount;
            break;
        case Direction.South:
            if((currentTileIndex +1) % mapCount == 0) desiredTileIndex = -1;
            else desiredTileIndex = currentTileIndex +1;
            break;
        case Direction.West:
            desiredTileIndex = currentTileIndex + mapCount;
            break;          
    }
    return desiredTileIndex >= 0 && desiredTileIndex < tiles.length;
}

function internal_rightIsClear() {
    var desiredTileIndex;
    switch(dir) {
        case Direction.North:
            if(currentTileIndex % mapCount == 0) desiredTileIndex = -1;
            else desiredTileIndex = currentTileIndex -1;
            break;
        case Direction.East:
            desiredTileIndex = currentTileIndex -mapCount;
            break;
        case Direction.South:
            if((currentTileIndex +1) % mapCount == 0) desiredTileIndex = -1;
            else desiredTileIndex = currentTileIndex +1;
            break;
        case Direction.West:
            desiredTileIndex = currentTileIndex + mapCount;
            break;          
    }
    return desiredTileIndex >= 0 && desiredTileIndex < tiles.length;
}

function internal_fruitsPresent() {
    return fruits.length > 0;
}

function internal_facingNorth() {
    return dir == Direction.North;
}

function internal_facingSouth() {
    return dir == Direction.South;
}

function internal_facingEast() {
    return dir == Direction.East;
}

function internal_facingWest() {
    return dir == Direction.West;
}

//Other

function internal_fruitsInPocket() {
    return pocket;
}