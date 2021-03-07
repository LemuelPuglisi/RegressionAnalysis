let pointset;  
let pointAdded;  
let rm; 

let xform; 
let yform; 
let submit; 

function getRegressionMethodFromSelect() {
    return document.getElementById('regression_type_select').value
}

function changeRegressionMethod(method) {
  let orderInput = document.getElementById('polynomial_order'); 
  orderInput.disabled = method != 'polynomial';
  let options = method == 'polynomial' ? {order: orderInput.value} : {}; 
  
  rm.updateRegressor(method, options)
  loop();
}

function responsivelyResizeCanvas() {
  const w = windowWidth;
  let size = w < 600 ? w * 0.65 : w / 3;   
  resizeCanvas(size, size); 
}

function drawCartesianAxys() {
    stroke(160); 
    strokeWeight(1); 
    line(0, height / 2, width, height / 2); 
    line(width / 2, 0, width / 2, height); 
}

function addPoint(x = mouseX, y = mouseY) {
    pointset.push(new Point(x, y))
    pointAdded = true; 
    loop(); 
}

function addPointUsingForm() {
    let x = document.getElementById('new_point_x_cord').value
    let y = document.getElementById('new_point_y_cord').value
    x = (width / 2)  + parseFloat(x) 
    y = (height / 2) - parseFloat(y)
    addPoint(x, y)
}
  
function resetPointset() {
    pointset = []; 
    rm.resetPointset();
    loop();  
}
  
function calculateCovariance() {
    const n = pointset.length
    const xmean = pointset.map(p => p.x).reduce((acc, x) => acc + x, 0) / n
    const ymean = pointset.map(p => p.y).reduce((acc, y) => acc + y, 0) / n  
    let cov = (pointset.reduce((acc, p) => acc += (p.x - xmean) * (p.y - ymean), 0) / n).toFixed(2) 
    return cov * -1; // y in p5.js is inverted 
}

function displayCovariance() {
    let covarianceLabel = document.getElementById('cov')
    covarianceLabel.value = calculateCovariance(); 
}

function calculateStandardDeviation(distr) {
    const mean = distr.reduce((acc, v) => acc + v, 0) / distr.length
    return distr.reduce((acc, v) => acc += Math.pow(v - mean, 2), 0) / distr.length 
}

function calculatePearson() {
    const xsd = calculateStandardDeviation(pointset.map(pt => pt.x))
    const ysd = calculateStandardDeviation(pointset.map(pt => pt.y))
    return (calculateCovariance() / (xsd * ysd)).toFixed(8)
}

function displayPearson() {
    let pearsonLabel = document.getElementById('pearson')
    pearsonLabel.value = calculatePearson(); 
}

function setup() {
  let c = createCanvas(800, 800, P2D);
  c.parent('regression')
  c.mousePressed(addPoint)

  background(255);
  stroke(0, 255, 0);
  noFill();

  pointset = []; 
  pointAdded = false; 

  rm = new RegressionManager(getRegressionMethodFromSelect()); 
  responsivelyResizeCanvas(); 
}


function draw() {
  background(255);
  drawCartesianAxys(); 
  pointset.forEach(p => p.display())
  if (pointAdded) {
    rm.updatePointset(pointset); 
    displayCovariance(); 
    displayPearson(); 
    pointAdded = false; 
  }
  rm.displayRegressionFunction(); 

  fill(0); 
  noStroke(); 
  text(rm.regressionMethod, 20, 20, 30, 30); 
  noLoop(); 
}






