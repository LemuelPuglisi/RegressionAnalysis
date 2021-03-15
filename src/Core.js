let distribution;  
let pointAdded;  
let rm; 
let mapper; 

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
    distribution.add(Point.initWithCanvasCoords(x, y))
    pointAdded = true; 
    loop(); 
}

function addPointUsingForm() {
    let x = document.getElementById('new_point_x_cord').value
    let y = document.getElementById('new_point_y_cord').value
    let p = Point.initWithCartesianCoords(parseInt(x), parseInt(y))
    distribution.add(p); 
    pointAdded = true; 
    loop(); 
}
  
function resetPointset() {
    distribution.reset(); 
    loop();  
}

function displayCovariance() {
    let covarianceLabel = document.getElementById('cov')
    let covarianceTextLabel = document.getElementById('cov_text')    
    const covariance = distribution.getCovariance().toFixed(4); 
    covarianceLabel.value = covariance
    
    if (Math.floor(covariance) == 0) 
      covarianceTextLabel.value = 'statisticamente incorrelati'
    else if (covariance > 0) 
      covarianceTextLabel.value = 'correlati positivamente'
    else 
      covarianceTextLabel.value = 'correlati negativamente'
}

function displayPearson() {
    let pearsonLabel = document.getElementById('pearson')
    const pearsonCoefficient= distribution.getPearson().toFixed(8);
    pearsonLabel.value = pearsonCoefficient;
    pearsonLabel.style.backgroundColor = pearsonCoefficient < -0.90 || pearsonCoefficient > 0.90
      ? '#C7EFCF' : '#D8829D';    
}

function displayFunctionAsString() {
  if (!rm.regressor || distribution.size() < 2) return; 
  let stringFunctionLabel = document.getElementById('string_function')
  stringFunctionLabel.value = rm.regressor.string
}

function setup() {

    let c = createCanvas(800, 800, P2D);
    c.parent('regression')
    c.mousePressed(addPoint)

    background(255);
    stroke(0, 255, 0);
    noFill();

    mapper = new Mapper(); 
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
  displayFunctionAsString(); 

  fill(0); 
  noStroke(); 
  text(rm.regressionMethod, 20, 20, 30, 30); 
  noLoop(); 
}