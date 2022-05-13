/*References:
https://youtu.be/uk96O7N1Yo0
*/
let canvas;

// let albumCanvasImage;
let playIcon;
let pauseIcon;
let button;
// let icon = [playIcon,pauseIcon];

let mic;
let fft;
let currentInput="";

let c1,c2;

let particle  = [];

function preload(){
   testSong = loadSound('assets/song.mp3');
  //  albumCanvasImage = loadImage('assets/records.png');
   playIcon =  loadImage('assets/play.png');
   pauseIcon = loadImage('assets/pause.png');
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  //canvas settings
  let canvas = createCanvas(windowWidth, 500);
  canvas.parent("projectSketch");
  // canvas.position(0,0);
  // canvas.style('z-index','-1');
  angleMode(DEGREES);
  imageMode(CENTER);

  c1 = color(45,1,46);
  c2 = color(35,0,42);
  
  //set up audio detect and fft
  mic = new p5.AudioIn();
  mic.start();
  // fft = new p5.FFT();
  fft = new p5.FFT(0.3,256);
  currentInput = mic;
  fft.setInput(currentInput);

  button = createImg('assets/play.png','');
  button.position(windowWidth/2-50,windowHeight/2+685);
  button.mousePressed(togglePlaying);
}

function draw() {
  //gradient background
  for(let y=0; y<height; y++){
    n = map(y,0,height,0,1);
    let newColor = lerpColor(c1,c2,n);
    stroke(newColor);
    line(0,y,width,y);
  }
  
  //audio visualizer
  stroke(255);
  strokeWeight(2);
  noFill();

  let wave = fft.waveform();
  fft.analyze();
  let amp = fft.getEnergy(20,200); //controls the small circles movement with sound frequency

  // push();
  translate(width/2,height/2);
  for(let t=-1; t<=1; t+=2){
    beginShape();
    for(let i=0; i<180; i+=0.5){
      let index = floor(map(i,0,180,0,wave.length-1));
  
      let r = map(wave[index],-1,1,50,250); //change radius of main circle
  
      let x = r * sin(i) *t;
      let y = r * cos(i);
      vertex(x,y);
    }
    endShape();
  }
  
  //call class circle
  let p = new circles();
  particle.push(p);

  for(let i=particle.length-1; i>=0; i--){
    if (!particle[i].edge()){
      particle[i].update(amp > 170);
      particle[i].display();
    } else{
      particle.splice(i,1);
    }
  }
  // pop();
}


function togglePlaying() {
  if (!testSong.isPlaying()|| currentInput === mic) {
    testSong.play();
    // testSong.setVolume(0.1);
    currentInput = testSong;
    mic.stop();
      // icon.src = "assets/pause.png";
  } else {
    testSong.pause();
    mic.start();
    currentInput = mic;
      // icon.src = "assets/play.png"
  }
  fft.setInput(currentInput);
}

class circles {
  constructor(){
    this.position = p5.Vector.random2D().mult(150);
    this.velocity = createVector(0,0);
    this.accelerate = this.position.copy().mult(random(0.0001,0.00001));
    this.width = random(3,10);
    this.color = [random(255),random(255),random(255)];
  }

  update(amplevel){
    this.velocity.add(this.accelerate);
    this.position.add(this.velocity);
    if(amplevel){
      this.position.add(this.velocity);
      this.position.add(this.velocity);
      this.position.add(this.velocity); //respond to the low sound
    }
  }

  edge(){
    if (this.position < width/2 || this.position.x >  width/2 || this.position.y < -height /2 || this.position.y > height/2){
      return true;
    } else{
      return false;
    }
  }

  display(){
    noStroke();
    fill(this.color);
    ellipse(this.position.x,this.position.y,this.width);
  }
}