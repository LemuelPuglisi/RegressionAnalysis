let distribution;  
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
  rm.setOptions(options)
  rm.setRegressionMethod(method)  
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
    distribution.add(new Point(x, y))
    pointAdded = true; 
    loop(); 
}

function addPointUsingForm() {
    let x = document.getElementById('new_point_x_cord').value
    let y = document.getElementById('new_point_y_cord').value
    x = (width  / 2) + parseFloat(x) 
    y = (height / 2) - parseFloat(y)
    addPoint(x, y)
}
  
function resetPointset() {
    distribution.reset(); 
    loop();  
}

function displayCovariance() {
    let covarianceLabel = document.getElementById('cov')
    covarianceLabel.value = distribution.getCovariance().toFixed(4)
}

function displayPearson() {
    let pearsonLabel = document.getElementById('pearson')
    pearsonLabel.value = distribution.getPearson().toFixed(8); 
}

function setup() {

    let c = createCanvas(800, 800, P2D);
    c.parent('regression')
    c.mousePressed(addPoint)

    background(255);
    stroke(0, 255, 0);
    noFill();

    distribution = new Distribution(); 
    pointAdded = false;

    rm = new RegressionManager(distribution, getRegressionMethodFromSelect()); 
    responsivelyResizeCanvas(); 
}

function draw() {

  background(255);
  drawCartesianAxys(); 
  distribution.display(); 

  if (pointAdded) {
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