let arraySize = 10;//decide quantity

let col = [arraySize];
let x = [arraySize];
let y = [arraySize];
let speedX = [arraySize];
let speedY = [arraySize];
let hexaSize=200;

function setup() { 
  createCanvas(600, 600);
  
  for (let i=0; i<arraySize; i++){
    x[i] = width/2;
    y[i] = height/2
    speedX[i] = random(-5,5);
    speedY[i] = random(-5,5);
    col[i] = parseInt(random(5));
  }
} 

function draw() { 
  background(100);
  
  for(let i=0; i<arraySize; i++){
    x[i] = x[i]+speedX[i];
    y[i] = y[i]+speedY[i];
    if ((x[i] > width-hexaSize/4) || (x[i] < hexaSize/4)){
      speedX[i] = speedX[i]*-1;
      col[i] = parseInt(random(5));
      //col = color (random(255), random(255), random(255),100);
        }
    if((y[i] > height-hexaSize/4) || (y[i] < hexaSize/4)){
      speedY[i] = speedY[i]*-1;
      col[i] = parseInt(random(5));
      //col = color (random(255), random(255), random(255),100);
       }
    hexagon(x[i],y[i],0.5,col[i]);
  }
}

function hexagon(transX, transY, s, c) {
  stroke(255);
  strokeWeight(5);
  
  //color
  if (c === 0) fill('#348888');
  else if (c === 1) fill('#FF4858');
  else if (c === 2) fill('#B4CF66');
  else if (c === 3) fill('#FA7F08');
  else if (c === 4) fill('#F24405');
  //else fill('#B4CF66');
  
  push();
  translate(transX, transY);
  scale(s); //scale of hex
  beginShape();
	vertex(-75, -130);
	vertex(75, -130);
	vertex(150, 0);
	vertex(75, 130);
    vertex(-75, 130);
	vertex(-150, 0);
  endShape(CLOSE); 
  pop();
}