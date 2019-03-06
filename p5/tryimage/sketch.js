var my_x=300;
var my_y=300;
var x1=300;
var y1=300;
var walk=new Array(9);
var stand,facing;
var frame = 0;

function setup() {
createCanvas(1200, 600);

  walk[0] = loadImage('pic/07.png');
  walk[1] = loadImage('pic/08.png');
  walk[2] = loadImage('pic/09.png');
  walk[3] = loadImage('pic/10.png');
  walk[4] = loadImage('pic/11.png');
  walk[5] = loadImage('pic/12.png');
  walk[6] = loadImage('pic/12.png');
  walk[7] = loadImage('pic/14.png');
  walk[8] = loadImage('pic/15.png');
  stand   = loadImage('pic/15.png');

//size(window.innerWidth, window.innerHeight, P3D);
background(230);
frameRate(60);
image(stand,my_x,my_y);
}

function draw(){
  var xd,yd,d,x_new,y_new;
if (my_x != x1 || my_y != y1){ //// display walking images
    xd=x1-my_x;
    yd=y1-my_y;
    d=sqrt(xd*xd+yd*yd);
    if(xd>0){
      facing = "right";
    }else{
      facing = "left";
    }
    if (d>10){
      x_new = my_x + xd*10/d;
      y_new = my_y + yd*10/d;
    }else{
      x_new = x1;
      y_new = y1;
    }
    background(230);
    my_x=x_new;
    my_y=y_new;
    image(walk[frame],my_x,my_y);
    frame++;
    if (frame>8){
      frame = 0;
    }  
  } else { /////// display stand image
    background(230);
    image(stand,my_x,my_y);
  }

}

function mousePressed(){
  //x1 and y1 are where the mouse clicked
  x1=mouseX-75;
  y1=mouseY-175;
  //image(img,x1,y1);
}

