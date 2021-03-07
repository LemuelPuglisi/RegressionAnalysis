class Point {

    constructor(x, y, diameter = 12, color = '#B95F89') {
      this.x = x; 
      this.y = y; 
      this.diameter = diameter; 
      this.col = color; 
    }
  
    display() {
      stroke(this.col)
      fill(this.col)
      circle(this.x, this.y, this.diameter); 
    }
  }