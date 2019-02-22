let boardSize = 4;
let initialTiles = 2;
let basePoints = 2;
let board = [];

let GameStates = {
  GAME_RUNNING: 1,
  GAME_OVER: 2
}

let state = GameStates.GAME_RUNNING;

function setup() {
  createCanvas(500, 500);
  resetGame();
}

function draw() {
  switch (state) {
    case GameStates.GAME_RUNNING:
      for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
          board[y][x].draw();
        }
      }

      checkGameOver();
    break;

    case GameStates.GAME_OVER:
      showGameOverScreen();
    break;
  }
}

function resetGame() {
  let tileWidth = width/boardSize;
  let tileHeight = height/boardSize;

  for (let y = 0; y < boardSize; y++) {
    board[y] = []
    for (let x = 0; x < boardSize; x++) {
      board[y][x] = new Tile(x, y, tileWidth, tileHeight)
    }
  }

  // Spawn initial tiles
  for (let i = 0; i < initialTiles; i++) {
    spawnTile();
  }

  state = GameStates.GAME_RUNNING;
}

function checkGameOver() {
  let emptyTiles = findEmptyTiles();
  if (emptyTiles.length > 0) {
    return;
  }

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      let tile = board[y][x];

      if (y < boardSize-1) {
        if (tile.value === board[y+1][x].value) return;
      }
      if (x < boardSize-1) {
        if (tile.value === board[y][x+1].value) return;
      }
    }
  }
  state = GameStates.GAME_OVER;
}

function findEmptyTiles() {
  let emptyTiles = [];
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      let tile = board[y][x];
      if (tile.isEmpty()) {
        emptyTiles.push(tile)
      }
    }
  }
  return emptyTiles;
}

function spawnTile() {
  let nextSpawn = random() > .9 ? basePoints*2 : basePoints;
  let tile = random(findEmptyTiles());

  if (!tile) {
    return;
  }

  board[tile.y][tile.x].value = nextSpawn;
}

function moveTile(x, y, x2, y2) {
  let tile = board[y][x];
  let nextTile = board[y2][x2];

  if (tile.isEmpty()) {
    return false;
  }

  if (nextTile.isEmpty()) {
    nextTile.copyValueFrom(tile);
    tile.clear();
    return true;
  } 
  else if (nextTile.value === tile.value) {
    nextTile.value += tile.value;
    tile.clear();
    return true;
  }
}

function showGameOverScreen() {
  background(51);
  fill(255);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Game Over", width/2, height/3);
  textSize(32);
  text("Click anywhere to start over...", width/2, height/3*2);
}

function keyPressed() {
  let shouldSpawn = false;
  let movedThisIteration = false;

  switch (keyCode) {
    case UP_ARROW:
      do {
        movedThisIteration = false;
        for (let y = 1; y < boardSize; y++) {
          for (let x = 0; x < boardSize; x++) {
            let moved = moveTile(x, y, x, y-1);
            if (moved) {
              shouldSpawn = movedThisIteration = true;
            }
          }
        }
      } while (movedThisIteration)
      break;
      
    case RIGHT_ARROW:
      do {
        movedThisIteration = false;
        for (let y = 0; y < boardSize; y++) {
          for (let x = boardSize-2; x >= 0; x--) {
            let moved = moveTile(x, y, x+1, y);
            if (moved) {
              shouldSpawn = movedThisIteration = true;
            }
          }
        }
      } while (movedThisIteration)
      break;
    
    case DOWN_ARROW:
      do {
        movedThisIteration = false;
        for (let y = boardSize-2; y >=0 ; y--) {
          for (let x = 0; x < boardSize; x++) {
            let moved = moveTile(x, y, x, y+1);
            if (moved) {
              shouldSpawn = movedThisIteration = true;
            }
          }
        }
      } while (movedThisIteration)
      break;
      
    case LEFT_ARROW:
      do {
        movedThisIteration = false;
        for (let y = 0; y < boardSize; y++) {
          for (let x = 1; x < boardSize; x++) {
            let moved = moveTile(x, y, x-1, y);
            if (moved) {
              shouldSpawn = movedThisIteration = true;
            }
          }
        }
      } while (movedThisIteration)
      break;

    case ESCAPE: 
      resetGame();
      break;
  }

  if (shouldSpawn) {
    spawnTile();
  }
}

function mouseClicked() {
  if (state === GameStates.GAME_OVER) {
    resetGame();
  }
}