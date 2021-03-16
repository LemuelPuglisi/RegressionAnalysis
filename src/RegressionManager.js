
class RegressionManager {
    
    allowedRegressionMethods = [
        'linear',
        'exponential', 
        'logarithmic', 
        'power', 
        'polynomial'
    ]

    constructor(distribution, regrType = 'linear', mapper = new Mapper()) {
        this.regressionMethod = this.allowedRegressionMethods.includes(regrType)
            ? regrType
            : regrType[0];
            
        this.distribution = distribution; 
        this.mapper = mapper; 
        this.distribution.addObserver(this); 
        this.options = {}; 
        this.thickness = 3;
    }

    update() {
        this.regressor = regression[this.regressionMethod](this.distribution.asArray(), this.options)
    }

    setOptions(options) {
        this.options = options;
        this.update();  
    }

    setRegressionMethod(regrType) {
        this.regressionMethod = this.allowedRegressionMethods.includes(regrType)
            ? regrType
            : regrType[0];
        this.update();
    }

    displayRegressionFunction() {
        if (!this.regressor) return; 
        this.drawCurve(this.generatePointlist())
    }

    generatePointlist() {
        let ptlist = []; 
        for (let x = (-width / 2); x < width / 2; x += 2) {
            let y = this.regressor.predict(x)[1]
            let point = Point.initWithCartesianCoords(x, y); 
            ptlist.push(point)
        }
        return ptlist; 
    }

    drawCurve(pointlist) {
        noFill(); 
        stroke('#67AAF9'); 
        strokeWeight(this.thickness); 
        beginShape(); 
        pointlist.map(p => this.mapper.mapToCanvas(p.x, p.y))
            .forEach(cords => curveVertex(cords.x, cords.y))        
        endShape(); 
    }

    setFunctionThickness(thickness) {
        this.thickness = thickness; 
    }

}