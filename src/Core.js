let distribution;  
let pointAdded;  
let rm; 
let mapper; 

let xform; 
let yform; 
let submit; 

let pointSize; 
let functionSize;

let inferFeatureX; 
let inferFeatureY; 

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
  let size = w < 600 ? w * 0.60 : w / 3.5;   
  resizeCanvas(size, size); 
}

function drawCartesianAxys() {
    stroke(160); 
    strokeWeight(1); 
    line(0, height / 2, width, height / 2); 
    line(width / 2, 0, width / 2, height); 
}

function addPoint(x = mouseX, y = mouseY) {
    distribution.add(Point.initWithCanvasCoords(x, y, pointSize))
    pointAdded = true; 
    loop(); 
}

function addFromTextArea() {
  let textarea = document.getElementById('new_points_textarea');
  if (textarea.value.trim().length < 1) return; 
  let pairsOfCords = textarea.value.split('\n');
  pairsOfCords.forEach(stringCords => {
    if (!stringCords.includes(',')) {
      console.error('invalid coordinates format.')
      return; 
    }
    let parts = stringCords.split(',').map(v => parseInt(v))
    let point = Point.initWithCartesianCoords(parts[0], parts[1], pointSize)
    distribution.add(point); 
    pointAdded = true; 
  })
}

function addPointUsingForm() {    
    addFromTextArea(); 
    let x = document.getElementById('new_point_x_cord').value
    let y = document.getElementById('new_point_y_cord').value
    if (x && y) {
      let p = Point.initWithCartesianCoords(parseInt(x), parseInt(y), pointSize) 
      distribution.add(p); 
      pointAdded = true; 
    }
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

  stringFunctionLabel.value = rm.regressor.string.includes('NaN')
    ? 'Errore: rispettare il dominio della funzione'
    : rm.regressor.string; 
}

function updatePointSize() {
    let pointsizeRange = document.getElementById('point-size'); 
    pointSize = parseInt(pointsizeRange.value); 
    distribution.pointset.forEach(point => point.setDiameter(pointSize))
    loop(); 
}

function updateFunctionSize() {
    let functionSizeRange = document.getElementById('function-size'); 
    functionSize = parseInt(functionSizeRange.value); 
    rm.setFunctionThickness(functionSize)
    loop(); 
}

function predict() {
  if (!rm.regressor) return;
  let xInput = document.getElementById('x_in'); 
  let yInput = document.getElementById('y_pr'); 
  const x = parseFloat(xInput.value)
  const y = rm.regressor.predict(x)[1]
  yInput.value = y; 
  inferFeatureX = x; 
  inferFeatureY = y; 
  loop(); 
}

function localizeInference() {
  const cordsOnX = mapper.mapToCanvas(inferFeatureX, 0);
  const cordsOnY = mapper.mapToCanvas(0, inferFeatureY); 
  const cords = mapper.mapToCanvas(inferFeatureX, inferFeatureY)

  strokeWeight(1)
  stroke('#3CAEA3');
  noFill(); 
  circle(cordsOnX.x, cordsOnX.y, 10);
  
  strokeWeight(1)
  stroke('#3CAEA3');
  noFill(); 
  circle(cordsOnY.x, cordsOnY.y, 10);   

  strokeWeight(1)
  stroke('#666');
  line(cordsOnX.x, cordsOnX.y, cords.x, cords.y)

  strokeWeight(1)
  stroke('#666');
  line(cordsOnX.x, cordsOnX.y, cords.x, cords.y)

  strokeWeight(1)
  stroke('#666');
  line(cords.x, cords.y, cordsOnY.x, cordsOnY.y)

  strokeWeight(2)
  stroke('#000');
  fill('#3CAEA3'); 
  circle(cords.x, cords.y, 10);  
}

function setup() {

    let c = createCanvas(800, 800, P2D);
    c.parent('regression')
    c.mousePressed(addPoint)

    background(255);
    stroke(0, 255, 0);
    noFill();

    pointSize = 12; 
    functionSize = 3; 

    document.getElementById('function-size').value = functionSize; 
    document.getElementById('point-size').value = pointSize;  

    inferFeatureX = null; 
    inferFeatureY = null;; 

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

  predict(); 
  if (inferFeatureX && inferFeatureY) {
    localizeInference(); 
  }

  fill(0); 
  noStroke(); 
  text(rm.regressionMethod, 20, 20, 30, 30); 
  noLoop(); 
}