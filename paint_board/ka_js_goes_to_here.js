var pen_color_R = 150;
var pen_color_G = 180;
var pen_color_B = 180;

var drawcolorbuttonmeowmeowmeowmeowmeowmeomwomeoemowmeowemeowmeowmeowmewoemeowmeommeowmeowmeowmeowmeowmeow=function(){
stroke(0,0,0);
// Green color Key
fill(150,180,180);
rect(110,0,50,50);
// Black color key
fill(30,30,30);
rect(170,0,50,50);
//yellow color key
fill(180,150,30);
rect(230,0,50,50);
//eraser key
fill(240,240,240);
rect(290,0,50,50);
textSize(15);
fill(0,0,0);
text("Eraser",295,30);
};

var resetbutton = function() {
    background(240,240,240);    
    fill(170,170,170);
    rect(0,0,600,50);
    noStroke();
    fill(100,100,100);
    rect(0,0,100,50);
    //fill(255,255,255);
    textSize(20);
    fill(30,30,30);
    text("Restart",30,25);
    //// draw color botttttons :3!!!!!!!! /////   :DDDD
    drawcolorbuttonmeowmeowmeowmeowmeowmeomwomeoemowmeowemeowmeowmeowmewoemeowmeommeowmeowmeowmeowmeowmeow();

};

resetbutton();
    
draw = function() {
    noStroke();
    fill(pen_color_R,pen_color_G,pen_color_B);
    if(mouseY>55 && mouseIsPressed){
    ellipse(mouseX, mouseY, 20, 20);
    }
    if(mouseY<50 && mouseIsPressed){
            if(mouseX<100){
                resetbutton();
            }
            if(mouseX>110 && mouseX<110+50){
                pen_color_R=150;
                pen_color_B=180;
                pen_color_G=180;
            }
            if(mouseX>170 && mouseX<170+50){
                pen_color_B=30;
                pen_color_G=30;
                pen_color_R=30;
            }
            if(mouseX>230 && mouseX<230+50){
                pen_color_B=30;
                pen_color_G=150;
                pen_color_R=180;
            }
            if(mouseX>290 && mouseX<290+50){
                pen_color_B=240;
                pen_color_G=240;
                pen_color_R=240;
            }
    }
};
//meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow
//byebye :3 meow