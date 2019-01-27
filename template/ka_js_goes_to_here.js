var pen_color_R = 150;
var pen_color_G = 180;
var pen_color_B = 180;

var drawcolorbuttonmeowmeowmeowmeowmeowmeomwomeoemowmeowemeowmeowmeowmewoemeowmeommeowmeowmeowmeowmeowmeow=function(){
fill(150,180,180);
stroke(0,0,0);
rect(110,0,50,50);
fill(30,30,30);
rect(170,0,50,50);
fill(180,150,30);
rect(230,0,50,50);
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
    }
};