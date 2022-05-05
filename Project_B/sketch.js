let client_id = '1d343529bfcf491cb4dff59b57d73eaa';
let client_secret = '5e0b0d3e507f4e75bde95e3e1ea1f7d8';
let testSong;
let fft;


function preload(){
   testSong = loadSound('assets/song.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT();
}

function draw() {
  background(0);
  
  let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(255);
  for(let i=0; i<waveform.length; i++){
    let x = map(i,0,waveform.length,0,width);
    let y = map(waveform[i],-1,1,0,height);
    vertex(x,y);
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