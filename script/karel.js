//-----------------------------------
//Write your code here (don't delete the main method):
//-----------------------------------

async function main() {
    await move();
    await move();
    dropFruit();
    turnLeft();
    await moveMultiple(2);
}

async function moveMultiple(x) {
    for (let i = 0; i < x; i++) {
        await move();      
    }
}


//-----------------------------------
//These are the functions you can use:
//-----------------------------------

//move() - Moves Karel towards the direction it's facing. NEEDS AWAIT
async function move() {
    await internal_move();
}

//turnLeft() - Turns Karel 90° counter-clockwise.
function turnLeft() {
    internal_turnLeft();
}

//turnRight() - Turns Karel 90° clockwise.
function turnRight() {
    internal_turnRight();
}

//dropFruit() - Karel drops a random fruit on it's current tile.
function dropFruit() {
    internal_dropFruit();
}


//pickFruit() - Karel picks a fruit on it's current tile and it gets stored in the pocket.
function pickFruit() {
    internal_pickFruit();
}

//paintTile() - Karel paints it's current tile of any specified color.
//param: color - You can put any value (as string) accepted by CSS like red, green, blue, etc. hex code or even RGB.
function paintTile(color) {
    internal_paintTile(color);
}

//Conditions

//frontIsClear() - Checks if Karel can move front (relative to it's orientation). Returns true or false.
function frontIsClear() {
    return internal_frontIsClear();
}

//leftIsClear() - Checks if Karel can move left (relative to it's orientation). Returns true or false.
function leftIsClear() {
    return internal_leftIsClear();
}

//rightIsClear() - Checks if Karel can move right (relative to it's orientation). Returns true or false.
function rightIsClear() {
    return internal_rightIsClear();
}

//fruitsPresent() - Checks if there are fruits placed on the map. Returns true or false.
function fruitsPresent() {
    return internal_fruitsPresent();
}

//fruitsInPocket() - Checks how many fruits are in Karel's pocket. Returns the NUMBER of fruits.
function fruitsInPocket() {
    return internal_fruitsInPocket();
}

//facingNorth() - Checks if Karel is facing north. Returns true or false.
function facingNorth() {
    return internal_facingNorth();
}

//facingSouth() - Checks if Karel is facing south. Returns true or false.
function facingSouth() {
    return internal_facingSouth();
}

//facingEast() - Checks if Karel is facing east. Returns true or false.
function facingEast() {
    return internal_facingEast();
}

//facingWest() - Checks if Karel is facing west. Returns true or false.
function facingWest() {
    return internal_facingWest();
}