class Tile {
  x;
  y;
  width;
  height;
  value;
  
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.value = 0;
  }

  isEmpty() {
    return this.value === 0;
  }

  clear() {
    this.value = 0;
  }

  copyValueFrom(other) {
    this.value = other.value;
  }

  draw() {
    stroke(255);
    if (this.isEmpty()) {
      fill(230);
      rect(this.width*this.x, this.height*this.y, this.width, this.height);
      return;
    }
    
    let colorBase = Math.log(this.value) / Math.log(2) * 30;
    fill(255 - colorBase%255, colorBase/3%255, colorBase/4%255);
    rect(this.width*this.x, this.height*this.y, this.width, this.height);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(this.value, this.width*this.x+this.width/2, this.height*this.y+this.height/2);
  }
}