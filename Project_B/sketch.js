let canvas;

// //user input
// let artist1;
// let artist2;
// let artist3;

// let testSong = document.getElementById("testSong");
// let icon = document.gestElementById("icon");
let albumCanvasImage;
let playIcon;
let pauseIcon;
let button;
let fft;
// let icon = [playIcon,pauseIcon];

let c1,c2;

function preload(){
   testSong = loadSound('assets/song.mp3');
   albumCanvasImage = loadImage('assets/records.png');
   playIcon =  loadImage('assets/play.png');
   pauseIcon = loadImage('assets/pause.png');
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  //canvas settings
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index','-1');

  // let submitButton = select("#submitButton");
  // // submitButton.mousePressed(getArtistName);
  // artist1 = select('#artist1');
  // artist2 = select('#artist2');
  // artist3 = select('#artist3');

  c1 = color(63,0,54);
  c2 = color(11,0,32);
  fft = new p5.FFT(0.5,256);

  button = createImg('assets/play.png','');
  button.position(windowWidth-400,250);
  button.mousePressed(togglePlaying);
}

// function getArtistName(){
//   artist1 = artist1.value();
//   artist2 = artist2.value();
//   artist3 = artist3.value();
//   console.log(artist1.value());
// }

function draw() {
  //gradient background
  for(let y=0; y<height; y++){
    n = map(y,0,height,0,1);
    let newColor = lerpColor(c1,c2,n);
    stroke(newColor);
    line(0,y,width,y);
  }
  
  //audio visualizer
  let waveform = fft.waveform();
  stroke(255,150);
  strokeWeight(3);
  noFill();

  beginShape();
  for(let i=0; i<width; i++){
    let index = floor(map(i,0,width,0,waveform.length));

    let x = i;
    let y = waveform[index]*100 + height/2
    vertex(x,y+300);
  }
  endShape();

  image(albumCanvasImage,windowWidth/14,windowHeight/5);
  playIcon.resize(80,80);
  pauseIcon.resize(80,80);
  // image(playIcon,windowWidth-400,250);
  // playIcon.mousePressed(songPlay);
}


function togglePlaying() {
  if (!testSong.isPlaying()) {
      testSong.play();
      // icon.src = "assets/pause.png";
  } else {
      testSong.pause();
      // icon.src = "assets/play.png"
  }
}

// function mouseClicked() {
//   if(testSong.isPlaying()){
//     testSong.pause();
//   }else{
//     testSong.play();
//   }
// }