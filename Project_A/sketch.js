/*
References:
1. https://editor.p5js.org/stavrosdidakis/sketches/gMZ285BsC
2. https://editor.p5js.org/MOQN/sketches/nVrzgBMOg
Some ideas offered by Professor Stavros Didakis
*/

let backgroundImg;
let cursorImg;
let killSound;
let levelupSound;
let endSound;
let clearSound;
let myFont;

let virus = [];
let listOfPointCol = ['#F88951','#EAEB73'];
let listOfCol = ['#BE353F','#E3C75F','#611DF2','#026B33','#DE9ED1','#F24405','#FAC1B2','#BFAA84','#0476D9','#03A66A','##BE353F']; 
let initialVirus = 20;

//text
let levelText = ['New Mutants!','Not Enough!','Try Harder!','All Killed!','Game Over!'];
let newText = ""
let checkText = false;
let endText = false;
let overText = false;
let textCounter = 0;
let replicationCheck = true;

//replicate
let newVirus = 10;
let deathNum = 0;
let speed = 1;

function preload(){
  backgroundImg = loadImage('assets/web-background.png');
  cursorImg = loadImage('assets/target.png');
  killSound = loadSound('assets/killsound.mp3');
  levelupSound = loadSound('assets/levelupsound.mp3');
  endSound = loadSound('assets/endsound.mp3');
  clearSound = loadSound('assets/gameclear.mp3');
  myFont = loadFont('assets/GameFont.ttf');
}

function setup() {
  let canvas = createCanvas(windowWidth,600);
  canvas.parent("projectSketch");
  
  console.log('Interact with Mouse Click');
  console.log('Newly emerging mutants are faster, hard to kill');
  console.log('Kill 100 Viruses!');
  console.log('Keep the Viruses below 60!');
  
  for (let i = 0; i < initialVirus; i++) {
    virus.push(new Covid(random(width),random(height),random(3),random(3),random(0.8,1.2),listOfCol[0]));
    virus[i].OrangeDotXY();
    virus[i].YellowDotXY();
  }
}

function draw() {
  //background(220);
  image(backgroundImg,0,0);
  
  for (let i = 0; i < virus.length; i++) {
    let v = virus[i];
    v.update();
    v.display(); 
    
    if(virus[i].kill == true) {
      virus.splice(i,1);
      deathNum = deathNum+1;
      killSound.play();
      killSound.setVolume(0.3);
      if(deathNum % 10 == 0){
        speed = speed +1;
        replication();
        let textnum = int(random(3));
        newText = levelText[textnum];
        checkText = true;
        levelupSound.play();
        levelupSound.setVolume(0.4);
        //int(random(levelText.length))
      }
    }
    if(deathNum == 100){ //game clear
      newText = levelText[3];
      virus.splice(i,20);
      checkText = false;
      endText = true;
      overText = false;
      levelupSound.stop();
      endSound.stop();
      clearSound.play();
      clearSound.setVolume(0.05);
      replicationCheck = false;
    }
    
    if(virus.length > 59){ //game failed
      newText = levelText[4];
      virus.splice(i,60);
      checkText = false;
      endText = false;
      overText = true;
      levelupSound.stop();
      clearSound.stop();
      endSound.play();
      endSound.setVolume(0.4);
      replicationCheck = false;
    }
  }
  
  if (replicationCheck == true){
    if(random(1.00) < 0.017){ //replication - 1.7% chance
       virus.push(new Covid(random(width),random(height),random(3),random(3),random(0.8,1.2),listOfCol[0]));
      virus[virus.length-1].OrangeDotXY();
      virus[virus.length-1].YellowDotXY();
      }
    }
  
  //interface
  push();
  fill(255);
  textFont('monospace');
  textSize(25);
  text('Kill:' + deathNum + '  Alive:' + virus.length,15,40);
  //text('Mutant Level:' + speed, 385,40);
  textSize(15);
  text('Every 10 Viruses Killed, New Mutants Appear',16,65);
  pop();

  if (overText == true){//game over msg
    push();
    fill(255);
    stroke(0);
    strokeWeight(5);
    textFont(myFont);
    textSize(40);
    text(newText,width/2.7,height/2);
    textSize(20);
    text('Mutant Level: '+ speed,width/2.6,height/2+60);
    pop();
  }
  
  if (endText == true){//ending msg
    push();
    fill(255);
    stroke(0);
    strokeWeight(5);
    textFont(myFont);
    textSize(40);
    text(newText,width/2.7,height/2);
    textSize(20);
    text('Mutant Level: MAX',width/2.8,height/2+60);
    pop();
  }
  
  if (checkText == true){//level up msg
    push();
    fill(255);
    stroke(0);
    strokeWeight(5);
    textFont(myFont);
    textSize(40);
    text(newText,width/2.7,height/2);
    textSize(20);
    text('Mutant Level: '+ speed,width/2.4,height/2+60);
    textCounter++
    pop();
  }
  
  if(textCounter%300 == 0){//remove lv up msg
    checkText = false;
  }
  
  //mouse cursor
  noCursor();
  cursorImg.resize(80,80);
  image(cursorImg,mouseX,mouseY);
}

//kill function
function mousePressed() {
  //console.log(mouseX-300,mouseY-300);
  for (let i = 0; i < virus.length; i++) {
    virus[i].clickCheck(mouseX, mouseY);
  }
}

//replication process of virus → every 10 death of virus, new mutant appears
function replication() {
  let mutantCol = int(random(0,listOfCol.length-1));
  for (let i = 0; i < newVirus; i++) {
    virus.push(new Covid(random(width),random(height),random(3)+speed,random(3)+speed,random(0.8,1.2),listOfCol[mutantCol]));
    virus[virus.length-1].OrangeDotXY(); //index loction of the array shold be later than 10
    virus[virus.length-1].YellowDotXY();
  }
  listOfCol.splice(mutantCol,1); //prevent reuse of same color 
  //console.log(virus);
}

class Covid{
  constructor(startX, startY,speedX,speedY,size,color){
    this.x = startX;
    this.y = startY;
    this.speedX = speedX;
    this.speedY = speedY;
    this.size = size; //create random sized virus
    this.r = 100;
    this.color = color;
    this.dotX1 = [];//orange
    this.dotY1 = [];
    this.dotX2 = [];//yellow
    this.dotY2 = [];
    this.kill = false;
    this.killScale = 1;
  }
  
  //new xy position for dots on virus
  OrangeDotXY(){
    for(let i=0; i<15; i++){
      this.dotX1[i] = random(-this.r/3,this.r/3);
      this.dotY1[i] = random(-this.r/3,this.r/3);
    }
  }
  
  YellowDotXY(){
    for(let i=0; i<7; i++){
      this.dotX2[i] = random(-this.r/3,this.r/3);
      this.dotY2[i] = random(-this.r/3,this.r/3);
    }
  }
  
  //movement
  update(){
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > width || this.x < 0) {
      this.speedX *= -1;
    }
    if (this.y > height || this.y < 0) {
      this.speedY *= -1;
    }
  }
  
  //appearance
  display(){
    //scale(this.size);
    push();
    translate(this.x, this.y);
    scale(this.size * this.killScale);
    
    strokeWeight(8);
    stroke(this.color);
    line(0,0,40,40);
    line(0,0,-34,48);
    line(0,0,-35,-45);
    line(0,0,-51,-21);
    line(0,0,56,-7);

    noStroke();
    fill('#989495');
    circle(0, 0, this.r);
    
    fill(0,130);//shadow
    triangle(-8,-24,-17,-19,-8,-11);
    triangle(-18,28,-18,17,-8,18);
    triangle(22,6,10,10,18,18);
    triangle(17,-28,11,-16,24,-17);
    triangle(-34,-1,-33,8,-23,0);
    triangle(2,33,-2,44,8,42);
    triangle(1,11,-5,4,3,0);
    triangle(33,-6,28,2,41,0);
    triangle(-8,-44,-15,-34,-2,-35);
    triangle(34,13,43,24,52,12);
    triangle(-46,24,-32,19,-33,34);
    triangle(14,26,14,35,25,30);
    triangle(33,-20,39,-32,48,-17);
    triangle(-42,-25,-41,-36,-30,-28);
    triangle(-43,-7,-55,-2,-42,3);
    triangle(9,-39,19,-52,21,-41);
    
    fill(this.color); //color from the arrary listOfCol
    triangle(-10, -25, -20, -20, -10, -13);
    triangle(-20, 30, -20, 20,-10,20);
    triangle(24, 8, 12,12,20,20);
    triangle(19,-30,13,-18,26,-19);
    triangle(-36,-3,-35,7,-25,-2);
    triangle(4,35,-1,46,10,44);
    triangle(-1,13,-7,6,5,2);
    triangle(35,-8,30,4,43,2);
    triangle(-10,-46,-17,-36,0,-37);
    triangle(36,15,45,26,53,14);
    triangle(-48,26,-34,21,-35,36);
    triangle(16,28,16,37,27,32);
    triangle(35,-22,41,-34,50,-19);
    triangle(-44,-27,-43,-38,-32,-30);
    triangle(-45,-9,-57,-3,-44,5);
    triangle(11,-41,21,-54,23,-43);
    
    for(let i=0; i<15; i++){//random orange dots
      strokeWeight(3);
      stroke(listOfPointCol[0]);
      point(this.dotX1[i],this.dotY1[i]);  
    }
    
    for(let t=0; t<7; t++){//random yellow dots
      strokeWeight(3);
      stroke(listOfPointCol[1]);
      point(this.dotX2[t],this.dotY2[t]);  
    }
    
    pop();
    
  }
  clickCheck(clickX,clickY){
    let distance = dist(this.x,this.y,clickX,clickY);
    if(distance < this.r/1.5){
      this.kill = true;
      this.killScale = this.killScale - 3;
    }
  }
}