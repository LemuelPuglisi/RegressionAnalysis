
class RegressionManager {

    pointset = []; 
    
    allowedRegressionMethods = [
        'linear',
        'exponential', 
        'logarithmic', 
        'power', 
        'polynomial'
    ]

    constructor(regressionType) {
        this.regressionMethod = this.allowedRegressionMethods.includes(regressionType)
            ? regressionType
            : regressionType[0]; 

        this.resetPointset(); 
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

    updatePointset(pointset) {
        this.pointset = pointset; 
        this.updateRegressor(); 
    }

    resetPointset(pointset) {
        this.pointset = [];
    }

    updateRegressor(method = this.regressionMethod, options = {}) {
        this.regressionMethod = method; 
        let coordsList = this.pointset.map(point => [point.x, point.y]); 
        this.regressor = regression[method](coordsList, options)
    }

}