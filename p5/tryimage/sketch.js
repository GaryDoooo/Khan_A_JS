var my_x = 300;
var my_y = 300;
var x1 = 300;
var y1 = 300;
var walkR = new Array(9);
var walkL = new Array(9);
var standR, facing, standL;
var frame = 0;

function setup() {
  //createCanvas(1200, 600);
  createCanvas(window.innerWidth, window.innerHeight);
  bg=loadImage('pic/bg1.png')

  walkR[0] = loadImage('pic/07.png');
  walkR[1] = loadImage('pic/08.png');
  walkR[2] = loadImage('pic/09.png');
  walkR[3] = loadImage('pic/10.png');
  walkR[4] = loadImage('pic/11.png');
  walkR[5] = loadImage('pic/12.png');
  walkR[6] = loadImage('pic/12.png');
  walkR[7] = loadImage('pic/14.png');
  walkR[8] = loadImage('pic/15.png');
  standR = loadImage('pic/15.png');

  walkL[0] = loadImage('pic/77.png');
  walkL[1] = loadImage('pic/88.png');
  walkL[2] = loadImage('pic/99.png');
  walkL[3] = loadImage('pic/1010.png');
  walkL[4] = loadImage('pic/1111.png');
  walkL[5] = loadImage('pic/1212.png');
  walkL[6] = loadImage('pic/1212.png');
  walkL[7] = loadImage('pic/1414.png');
  walkL[8] = loadImage('pic/1515.png');
  standL = loadImage('pic/1515.png');
  //size(window.innerWidth, window.innerHeight, P3D);
  background(bg);
  frameRate(37);
  image(standR, my_x, my_y);
}

function draw() {
  var xd, yd, d, x_new, y_new;
  if (my_x != x1 || my_y != y1) { //// display walking images
    xd = x1 - my_x;
    yd = y1 - my_y;
    d = sqrt(xd * xd + yd * yd);
    if (xd > 0) {
      facing = "right";
    }
    else {
      facing = "left";
    }
    if (d > 10) {
      x_new = my_x + xd * 10 / d;
      y_new = my_y + yd * 10 / d;
    }
    else {
      x_new = x1;
      y_new = y1;
    }
    background(bg);
    my_x = x_new;
    my_y = y_new;
    if (facing == "right") {
      image(walkR[frame], my_x, my_y);
    }
    else {
      image(walkL[frame], my_x, my_y);
    }
    frame++;
    if (frame > 8) {
      frame = 0;
    }
  }
  else { /////// display stand image
    background(bg);
    if (facing == "right") {
      image(standR, my_x, my_y);
    }
    else {
      image(standL, my_x, my_y);
    }
  }

}

function mousePressed() {
  //x1 and y1 are where the mouse clicked
  x1 = mouseX - 75;
  y1 = mouseY - 175;
  //image(img,x1,y1);
}
