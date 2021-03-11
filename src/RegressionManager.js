
class RegressionManager {
    
    allowedRegressionMethods = [
        'linear',
        'exponential', 
        'logarithmic', 
        'power', 
        'polynomial'
    ]

    constructor(distribution, regrType = 'linear') {
        this.regressionMethod = this.allowedRegressionMethods.includes(regrType)
            ? regrType
            : regrType[0];
            
        this.distribution = distribution; 
        this.distribution.addObserver(this); 
        this.options = {}; 
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
        for(let i = 0; i < width; i += 20) {
            point = new Point(i, this.regressor.predict(i)[1])
            ptlist.push(point)
        }        
        return ptlist; 
    }

    drawCurve(pointlist) {
        noFill(); 
        stroke('#67AAF9'); 
        strokeWeight(3); 
        beginShape(); 
        pointlist.forEach(p => curveVertex(p.x, p.y));
        endShape(); 
    }

}