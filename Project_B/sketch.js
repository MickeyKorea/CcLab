let canvas;

// let albumCanvasImage;
let playIcon;
let pauseIcon;
let button;
// let icon = [playIcon,pauseIcon];

let mic;
let fft;

let c1,c2;

let particle  = [];

function preload(){
   testSong = loadSound('assets/song.mp3');
  //  albumCanvasImage = loadImage('assets/records.png');
   playIcon =  loadImage('assets/play.png');
   pauseIcon = loadImage('assets/pause.png');
}

// function windowResized(){
//   resizeCanvas(windowWidth, windowHeight);
// }

function setup() {
  //canvas settings
  let canvas = createCanvas(500, 500);
  canvas.parent("projectSketch");
  // canvas.position(0,0);
  // canvas.style('z-index','-1');
  angleMode(DEGREES);

  c1 = color(63,0,54);
  c2 = color(11,0,32);
  
  //set up audio detect and fft
  // mic = new p5.AudioIn();
  // fft = new p5.FFT();
  fft = new p5.FFT(0.5,256);
  // fft.setInput(mic);

  button = createImg('assets/play.png','');
  button.position(windowWidth/2+250,windowHeight/2+570);
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

  // push();
  translate(width/2,height/2);
  for(let t=-1; t<=1; t+=2){
    beginShape();
    for(let i=0; i<180; i+=0.5){
      let index = floor(map(i,0,180,0,wave.length-1));
  
      let r = map(wave[index],-1,1,50,250);
  
      let x = r * sin(i) *t;
      let y = r * cos(i);
      vertex(x,y);
    }
    endShape();
  }
  // pop();

  let p = new circles();
  particle.push(p);

  for(let i=particle.length-1; i>=0; i--){
    if (!particle[i].edge()){
      particle[i].update();
      particle[i].display();
    } else{
      particle.splice(i,1);
    }
  }

  // image(albumCanvasImage,windowWidth/14,windowHeight/5);
  // playIcon.resize(80,80);
  // pauseIcon.resize(80,80);
  // image(playIcon,windowWidth-400,250);
  // playIcon.mousePressed(songPlay);
}


function togglePlaying() {
  if (!testSong.isPlaying()) {
      testSong.play();
      testSong.setVolume(0.7);
      // icon.src = "assets/pause.png";
  } else {
      testSong.pause();
      // icon.src = "assets/play.png"
  }
}

class circles {
  constructor(){
    this.position = p5.Vector.random2D().mult(150);
    this.velocity = createVector(0,0);
    this.accelerate = this.position.copy().mult(random(0.0001,0.00001));
    this.width = random(3,5);
    this.color = [random(255),random(255),random(255)];
  }

  update(){
    this.velocity.add(this.accelerate);
    this.position.add(this.velocity);
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