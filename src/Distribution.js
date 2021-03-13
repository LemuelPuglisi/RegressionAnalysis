
class Distribution {

    constructor() {
        this.pointset = []; 
        this.cachedCovariance = null;
        this.cachedPearson = null; 
        this.observers = []; 
    }

    add (point) {
        this.pointset.push(point); 
        this.invalidCache(); 
        this.notify(); 
    }

    reset () {
        this.pointset = []; 
        this.invalidCache(); 
        this.notify();
    }

    display() {
        this.pointset.forEach(p => p.display()); 
    }

    addObserver(observer) {
        this.observers.push(observer)
    }

    notify() {
        this.observers.forEach(ob => ob.update())
    }

    invalidCache() {
        this.cachedPearson = null; 
        this.cachedCovariance = null; 
    }

    asArray () {
        return this.pointset.map(p => [p.x, p.y]);
    }

    size() {
        return this.pointset.length; 
    }

    getX () {
        return this.pointset.map(p => p.x);
    }

    getY() {
        return this.pointset.map(p => p.y);
    }

    calculateMean (d) {
        return d.reduce((acc, x) => acc += x, 0) / d.length
    }

    calculateCovariance() {
        const xmean = this.calculateMean(this.getX())
        const ymean = this.calculateMean(this.getY())
        const pmean = this.calculateMean(this.pointset.map(p => p.x * p.y))
        this.cachedCovariance = (pmean - (xmean * ymean)) * (-1); 
    }

    getCovariance() {
        if (!this.cachedCovariance) this.calculateCovariance(); 
        return this.cachedCovariance; 
    }

    calculateStandardDeviation(d) {
        const mean = this.calculateMean(d)
        const variance = d.reduce((acc, value) => acc += Math.pow(value - mean, 2), 0) / d.length        
        return Math.sqrt(variance) 
    }
    
    calculatePearson() {
        const xsd = this.calculateStandardDeviation(this.getX())
        const ysd = this.calculateStandardDeviation(this.getY())
        this.cachedPearson = (this.getCovariance() / (xsd * ysd))
    }

    getPearson() {
        if (!this.cachedPearson) this.calculatePearson(); 
        return this.cachedPearson; 
    }

}