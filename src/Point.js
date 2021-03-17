class Point {

    static initWithCartesianCoords(x, y, 
                                _diameter = 12, 
                                _color = '#B95F89', 
                                _mapper = new Mapper()) {
        return new Point(x, y, _diameter, _color, _mapper); 
    }

    static initWithCanvasCoords(x, y, 
                                _diameter = 12, 
                                _color = '#B95F89', 
                                _mapper = new Mapper()) {
        const mapper = new Mapper(); 
        let cartesianCoords = mapper.mapToCartesian(x, y); 
        return new Point(cartesianCoords.x, cartesianCoords.y, _diameter, _color, _mapper); 
    }

    /**
     * Takes coordinates from the cartesian axys and store them. Whenever 
     * it needs to be displayed, a mapper will convert the cartesian coordinates 
     * to the canvas coordinates. 
     */
    constructor(x, y, diameter = 12, color = '#B95F89', mapper = new Mapper()) {
        this.x = x; 
        this.y = y; 
        this.diameter = diameter; 
        this.col = color; 
        this.mapper = mapper; 
    }

    display() {
        stroke(this.col)
        fill(this.col)
        let canvasCoords = this.mapper.mapToCanvas(this.x, this.y); 
        circle(canvasCoords.x, canvasCoords.y, this.diameter); 
    }

    setDiameter(diameter) {
        this.diameter = diameter; 
    }
}