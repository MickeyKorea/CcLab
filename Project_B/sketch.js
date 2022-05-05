let canvas;

let client_id = '1d343529bfcf491cb4dff59b57d73eaa';
let client_secret = '5e0b0d3e507f4e75bde95e3e1ea1f7d8';
let testSong;
let fft;

let c1,c2;


function preload(){
   testSong = loadSound('assets/song.mp3');
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index','-1');
  fft = new p5.FFT();
  c1 = color(63,0,54);
  c2 = color(11,0,32);
}

function draw() {
  for(let y=0; y<height; y++){
    n = map(y,0,height,0,1);
    let newColor = lerpColor(c1,c2,n);
    stroke(newColor);
    line(0,y,width,y);
  }
  
  let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(255);
  for(let i=0; i<waveform.length; i++){
    let x = map(i,0,waveform.length,0,width);
    let y = map(waveform[i],-1,1,0,height);
    vertex(x,y+250);
  }
  endShape();
}

function mouseClicked() {
  if(testSong.isPlaying()){
    testSong.pause();
  }else{
    testSong.play();
  }
}