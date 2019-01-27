 var sketchProc = function(processingInstance) {
      with (processingInstance) {
    size(400, 400); 
    frameRate(30);
    
////////// Program Code Goes Under Here ////////////
//Inspired by NBA Jam...
//I released this game with a bunch of glitches, I've fixed a lot of them now. Still comment if you come across any. Instead of freezing the game will now just print a line that you can dismiss pretty fast.
/**
 * BASKETBALL
 * PLAYER 1 CONTROLS
 * arrow keys to move
 * With Ball: enter to pass, shift to shoot. When shooting, hold the shoot button until you are at the peak of your jump.Press shoot while moving towards the basket to dunk and keep holding towards the basket so you actually hit the basket
 * without Ball: enter to steal, shift to jump to block/rebound
 * PLAYER 2 CONTROLS
 * wasd to move
 * With Ball: g to pass, f to shoot. When shooting, hold the shoot button until you are at the peak of your jump. Press shoot while moving towards the basket to dunk and keep holding towards the basket so you actually hit the basket
 * without Ball: g to steal, f to jump to block/rebound
 **/
//setup{
noStroke();
textAlign(CENTER);
smooth();
textFont(createFont("Verdana"));
var scene = "home";
var tipoff = true;
var blueScore = 0;
var redScore = 0;
var half = 1;
var minutes = 4;
var seconds = 0;
var turnover = false;
var turnoverTeam = "";
var goaltending = false;
var shotclock = 24;
var shotclockViolation = false;
var tips = ["Press shift/f to rebound after a ball misses. Grabbing a rebound can give you another chance to score or take away another players chance to score", "Don't try and block the ball when it's moving downwards. It will be goaltending, and the other team will automatically score", "Press enter/g to attempt to steal. You have to be very close to the ball to steal it, so get close", "Watch out for the shot clock! If you don't shoot for 24 seconds, you'll get a shotclock violation and you'll lose the ball", "Press shoot while moving towards the hoop to attempt a dunk. Keep moving towards the basket so you hit it. Dunks are harder to block than regular shots, so use em"];
//}
//key and mouse functions{
var keys = {};
var releaseKeys = {};
keyPressed= function(){
    keys[keyCode] = true;
    keys[key] = true;
};
keyReleased = function(){
    keys[keyCode] = false;
    keys[key] = false;
    releaseKeys[keyCode] = true;
    releaseKeys[key] = true;
};
var clicked = false;
mouseReleased = function(){
    clicked = true;
};
//}
//player object{
var playerX = [[], [], [], []];
var playerZ = [[], [], [], []];
var Player = function(x, y, z, color, number, cpu, controls, ID, hoop){
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;
    this.number = number;
    this.cpu = cpu;
    this.controls = controls;
    if(this.x>550){
        this.direction = "left";
    } else{
        this.direction = "right";
    }
    this.yvel = 0;
    this.rightArmY = 0;
    this.leftArmY = 0;
    this.carryingBall = false;
    this.ID = ID;
    this.hoop = hoop;
    this.passCooldown = 0;
    this.shooting = false;
    this.shootCooldown = 0;
    if(this.hoop === "right"){
        this.side = 0;
        this.reverse = 1;
    } else{
        this.side = 1;
        this.reverse = -1;
    }
    this.dunkHang = 60;
    this.jumpX = 0;
    this.dunking = false;
    this.stealing = 0;
    this.canMove = false;
    this.wannaBeX = 0;
    this.wannaBeZ = 0;
    this.noBallWait = 0;
    this.setWannaBe = false;
};
Player.prototype.run = function(ball, players, hoops){
    this.draw();
    this.update(ball, hoops);
    if(this.canMove){
        if(!this.cpu){
            this.control(ball, players, hoops);
        } else{
            if(ball.carriedBy=== this.ID-1){
                this.cpuBallOffense(players, hoops, ball);
            } if((this.ID === 1&&ball.carriedBy === 1)||(this.ID === 2&&ball.carriedBy === 0)||(this.ID === 3&&ball.carriedBy === 3)||(this.ID === 4&&ball.carriedBy === 2)){
                this.cpuNoBallOffense(ball, hoops);
            } if(((this.ID === 1||this.ID === 2)&&(ball.carriedBy === 2||ball.carriedBy === 3||ball.shotBy === "red"))||((this.ID === 3||this.ID === 4)&&(ball.carriedBy === 0||ball.carriedBy ===1||ball.shotBy === "blue"))){
                this.cpuDefense(players, ball);
            } if(ball.carriedBy === ""&&ball.shotBy === ""){
                this.cpuGetBall(ball);
            }
        }
    }
    this.passCooldown ++;
    this.shootCooldown ++;
    if(this.stealing>0&&!this.carryingBall){
        this.steal(ball, players);
        if(this.stealing<20){
            this.stealing ++;
        } else{
            this.stealing = 0;
        }
    }
    if(ball.y<-260){
        this.canMove = true;
    }
    playerX[this.ID-1].unshift(this.x);
    playerZ[this.ID-1].unshift(this.z);
};
Player.prototype.draw = function() {
    fill(0, 0, 0, 150);
    ellipse(this.x+2, this.z, 35, 18);
    fill(255,205,148);
    rect(this.x-12, this.z+this.y-27, 10, 23);
    rect(this.x+5, this.z+this.y-27, 10, 23);
    if((this.direction === "right"||this.direction === "up")){
        rect(this.x+15, this.z+this.y-85+this.rightArmY, 10, 54, 2);
    }
    if((this.direction === "left" ||this.direction === "up")&&this.stealing === 0){
        rect(this.x-23, this.z+this.y-85+this.leftArmY, 10, 54, 2);
    } 
    fill(10, 9, 9);
    if(this.direction === "left"){
        ellipse(this.x+10, this.z+this.y, 14, 10);
        ellipse(this.x-7, this.z+this.y, 14, 10);
    }else{
        ellipse(this.x+11, this.z+this.y, 14, 10);
        ellipse(this.x-5, this.z+this.y, 14, 10);
    }
    fill(this.color);
    rect(this.x+3, this.z+this.y-47, 15, 26);
    rect(this.x-14, this.z+this.y-47, 15, 26);
    rect(this.x-14, this.z+this.y-85, 32, 40); 
    fill(255, 255, 255);
    textSize(16);
    if(this.direction === "up"){}else{
        text(this.number, this.x+1, this.z+this.y-60);
    }
    fill(255,205,148);
    ellipse(this.x+1, this.z+this.y-96, 25, 25);
    if((this.direction === "right"||this.direction==="down")&&this.stealing === 0){
        rect(this.x-23, this.z+this.y-85+this.leftArmY, 10, 54, 2);
    } if((this.direction === "left"||this.direction==="down")){
        rect(this.x+15, this.z+this.y-85+this.rightArmY, 10, 54, 2);
    } if((this.direction === "left"||this.direction==="down")&&this.stealing > 0){
        rect(this.x-63, this.z+this.y-85, 54, 10, 2);
    } if((this.direction === "right"||this.direction==="up")&&this.stealing>0){
        rect(this.x-15, this.z+this.y-85, 54, 10, 2);
    }
    fill(this.color);
    textSize(20);
    if(this.controls === "arrows"){
        text("P1", this.x, this.z+this.y-115);
    }if(this.controls === "wasd"){
        text("P2", this.x, this.z+this.y-115);
    }
};
Player.prototype.control = function(ball, players, hoops){
    if(((this.controls === "arrows"&&releaseKeys[ENTER])||(this.controls === "wasd"&&releaseKeys.g))&&this.stealing === 0&&!this.carryingBall&&this.passCooldown>100){
        this.stealing ++;
    }
    if(this.controls === "arrows"&&this.canDunk&&this.dunkHang>59){
        if(keys[UP]){
            this.z -= 3;
            this.direction = "up";
        }  if(keys[DOWN]){
            this.z += 3;
            this.direction = "down";
        } if(keys[LEFT]){
            this.x -= 3;
            this.direction = "left";
        } if(keys[RIGHT]){
            this.x += 3;
            this.direction = "right";
        } if(keys[SHIFT]&&this.y === 0){
            this.jump(hoops);
        } if(this.carryingBall&&releaseKeys[ENTER]&&this.passCooldown>30){
            this.pass(ball, players);
        }
    }
    if(((this.controls === "arrows"&&releaseKeys[SHIFT])||(this.controls === "wasd"&&releaseKeys.f))&&this.shooting&&this.x===this.jumpX){
        this.release(ball, hoops);
    }
    if(this.controls === "wasd"&&this.canDunk&&this.dunkHang>59){
        if(keys.w){
            this.z -= 3;
            this.direction = "up";
        }  if(keys.s){
            this.z += 3;
            this.direction = "down";
        } if(keys.a){
            this.x -= 3;
            this.direction = "left";
        } if(keys.d){
            this.x += 3;
            this.direction = "right";
        } if(keys.f&&this.y === 0){
            this.jump(hoops);
        } if(this.carryingBall&&releaseKeys.g&&this.passCooldown>30){
            this.pass(ball, players);
        }
    }
};
Player.prototype.steal = function(ball, players){
    try{
    if(this.x+25>ball.x-9&&this.x-25<ball.x+9&&this.z+25>ball.z-5&&this.z-25<ball.z+5&&this.y === 0&&ball.stealCooldown>30){
        if(round(random(0, 1)) === 0){
            for(var i in players){
                players[i].carryingBall = false;
                players[i].passCooldown = 0;
                ball.dribbling =false;
                ball.carriedBy ="";
                ball.x -= 20;
                ball.xvel = -2;
            }
            shotclock = 24;
        } else{
            ball.dribbling = true;
            for(var i in players){
                players[i].carryingBall = false;
                players[i].passCooldown = 0;
            }
            ball.stealCooldown = 0;
            this.stealing = 21;
            this.passCooldown = 0;
            ball.carriedBy = this.ID-1;
            ball.x = this.x-15;
            this.carryingBall = true;
        }
    } else{
        ball.stealCooldown = 0;
    }
    }catch(e){
        println(e);
    }
};
Player.prototype.jump = function(hoops){
    this.yvel = -10.5;
    this.jumpX = this.x;
    if(this.carryingBall){
        this.yvel = -8;
        this.shootCooldown = 0;
        this.shooting = true;
        if(this.hoop === "right"){
        this.side = 0;
        this.reverse = 1;
    } else{
        this.side = 1;
        this.reverse = -1;
    }
    try{
        if(dist(this.x, this.z, hoops[this.side].x, hoops[this.side].z)<175&&dist(this.x, this.z, hoops[this.side].x, hoops[this.side].z)>30&&this.carryingBall){
            this.canDunk = true;
            this.dunkHang = 60;
            if(dist(this.x, this.z, hoops[this.side].x, hoops[this.side].z)>135){
                this.yvel = -10.7;
            }
        } else{
            this.canDunk = false;
        }
    }catch(e){
        println(e);
    }
        this.leftArmY = -50;
        this.rightArmY = -40;
        if(this.hoop === "right"&&this.direction === "left"){
            this.direction = "right";
        } if(this.hoop === "left"&&this.direction === "right"){
            this.direction = "left";
        }
    }else if(this.direction === "right"){
        this.leftArmY = -50;
        this.yvel = -10.7;
    } else if(this.direction === "left"){
        this.rightArmY = -50;
        this.yvel = -10.7;
    } else{
        this.rightArmY = -50;
        this.leftArmY = -50;
        this.yvel = -10.7;
    }
};
Player.prototype.pass = function(ball, players){
    if(this.ID === 1){
        this.passTarget = 2;
    } else if(this.ID === 2){
        this.passTarget = 1;
    } else if(this.ID === 3){
        this.passTarget = 4;
    } else{
        this.passTarget = 3;
    }
    this.passTarget --;
    this.carryingBall = false;
    this.passCooldown = 0;
    ball.dribbling = false;
    ball.heightLimit = true;
    ball.carriedBy = "";
    try{
    ball.xvel = (players[this.passTarget].x+20-this.x)/20;
    ball.zvel = (players[this.passTarget].z-this.z)/20;
    ball.yvel = 4;
    }catch(e){
        println(e.message);
    }
};
Player.prototype.release = function(ball, hoops){
    this.releaseY = this.y;
    if(this.hoop === "right"){
        this.side = 0;
        this.reverse = 1;
    } else{
        this.side = 1;
        this.reverse = -1;
    }
    this.carryingBall = false;
    this.passCooldown = 0;
    this.shotDistance = (dist(this.x, this.z*2.3, hoops[this.side].x, hoops[this.side].z*2.3));
    this.shotDistance = map(this.shotDistance,0,1000,1,0.05);
    ball.y = -260;
    ball.dribbling = false;
    ball.carriedBy = "";
    try{
    ball.xvel = ((hoops[this.side].x-this.x)/105);
    ball.zvel = ((hoops[this.side].z-this.z)/105);
    ball.yvel = -4;
    var releaseChance = map(this.releaseY,-150, 0,1,0);
    ball.shotChance = releaseChance*this.shotDistance*100+4;
    ball.shotChance = constrain(ball.shotChance, 5, 95);
    this.shootCooldown = 0;
    if(this.ID === 1||this.ID === 2){
        ball.shotBy = "blue";
    } else{
        ball.shotBy = "red";
    }
    if(dist(this.x, this.z*1.4, hoops[this.side].x, hoops[this.side].z*1.4)>220){
        ball.pointsWorth = 3;
    } else{
        ball.pointsWorth = 2;
    }
    }catch(e){
        println(e);
    }
    ball.shot = true;
};
Player.prototype.update = function(ball, hoops){
    this.y += this.yvel;
    this.y = constrain(this.y, -250, 0);
    this.yvel += 0.35;
    this.z = constrain(this.z, 50, 400);
    this.x = constrain(this.x, 10, 1120);
    if(this.y === 0){
        this.shooting = false;
        this.canDunk = true;
    }
    if(this.jumpX !== this.x&&this.canDunk&&this.shooting){
        ball.dunking = true;
        this.dunking = true;
    }
    if(this.carryingBall&&!this.shooting){
        if(ball.yvel<0){
            this.leftArmY = -4;
            this.rightArmY = 0;
        } else{
            this.leftArmY = 4;
            this.rightArmY = 0;
        }
    }else if(this.y === 0){
        this.rightArmY = 0;
        this.leftArmY = 0;
    }
    if(ball.x === this.x-15){
        this.carryingBall = true;
    }else{
        this.carryingBall = false;
    }
    if(this.canDunk&&this.shooting&&this.x>hoops[this.side].x-20&&this.x<hoops[this.side].x+20&&this.z>hoops[this.side].z-20&&this.z<hoops[this.side].z+20&&this.y<-20&&this.y>hoops[this.side].y-10){
        this.carryingBall = false;
        this.shooting = false;
        this.dunkHang = 0;
        try{
        this.x = hoops[this.side].x;
        this.z = hoops[this.side].z;
        this.y = hoops[this.side].y+120;
        this.rightArmY = -50;
        this.leftArmY = -50;
        this.dunking = false;
        ball.dunking = false;
        ball.carriedBy = "";
        ball.xvel = 0;
        ball.zvel = 0;
        ball.x = hoops[this.side].x;
        ball.z = hoops[this.side].z;
        ball.y = hoops[this.side].y-20;
        }catch(e){
            println(e);
        }
        if(this.ID === 1||this.ID === 2){
            blueScore += 2;
            turnoverTeam = "red";
        } else{
            redScore += 2;
            turnoverTeam = "blue";
        }
        turnover = true;
    }
    this.dunkHang ++;
    if(this.dunkHang<60){
        this.yvel = 0;
    }
};
var player1 = new Player(534, 0, 210, color(8, 58, 115), 1, false, "arrows", 1, "right");
var player2 = new Player(348, 0, 210, color(8, 58, 115), 2, true, "", 2, "right");
var player3 = new Player(584, 0, 210, color(184, 2, 2), 1, false,"wasd", 3, "left");
var player4 = new Player(770, 0, 210, color(184, 2, 2), 2, true, "", 4, "left");
var players = [player1, player2, player3, player4];
//}
//cpu stuff{
Player.prototype.cpuMove = function(){
    if(this.z>this.wannaBeZ){
        this.z -= 3;
        this.direction = "up";
    } if(this.z<this.wannaBeZ){
        this.z += 3;
        this.direction = "down";
    } if(this.x>this.wannaBeX){
        this.x -= 3;
        this.direction = "left";
    } if(this.x<this.wannaBeX){
        this.x += 3;
        this.direction = "right";
    } 
};
Player.prototype.cpuBallOffense = function(players, hoops, ball){
    if(!this.setWannaBe){
        try{
        if(hoops[this.side].side === "right"){
            this.wannaBeX = hoops[this.side].x-random(280, 50);
        } else{
            this.wannaBeX = hoops[this.side].x+random(280, 50);
        }
        }catch(e){
            println(e.message);
        }
        this.wannaBeZ = random(50, 400);
        this.setWannaBe = true;
    }
    if(this.x>this.wannaBeX-5&&this.x<this.wannaBeX+5&&this.z>this.wannaBeZ-5&&this.z<this.wannaBeZ+5&&this.y===0){
        if(round(random(0, 2))===0){
            this.pass(ball, players);
        }else{
            this.y = -1;
            this.jump(hoops);
            this.cpuReleaseY = random(-65, -100);
        }
    }
    if(this.y>this.cpuReleaseY-20&&this.y<this.cpuReleaseY+20&&!ball.shot){
        this.release(ball, hoops);
    }
    if(!this.shooting){
        this.cpuMove();
    }
};
Player.prototype.cpuNoBallOffense = function(ball, hoops){
    try{
    if(this.noBallWait<120){
        this.wannaBeX = hoops[this.side].x;
        this.wannaBeZ = hoops[this.side].z+50;
    } else if(this.noBallWait<240){
        this.wannaBeX = hoops[this.side].x;
        this.wannaBeZ = hoops[this.side].z+300;
    } else if(this.noBallWait<360){
        this.wannaBeX = hoops[this.side].x;
        this.wannaBeZ = hoops[this.side].z-300;
    } else if(this.noBallWait<480){
        if(hoops[this.side].side === "right"){
            this.wannaBeX = hoops[this.side].x - 280;
        } else{
            this.wannaBeX = hoops[this.side].x + 280;
        }
        this.wannaBeZ = 210;
    }else{
        this.noBallWait = 0;
    }
    }catch(e){
        println(e.message);
    }
    this.noBallWait ++;
    this.cpuMove();
};
Player.prototype.cpuGetBall = function(ball){
    if(dist(this.x, this.z, ball.x, ball.z)<100&&ball.y<-100&&this.y === 0&&ball.yvel>2&&round(random(0, 2))===0&&!this.shot){
        this.jump();
    }
    this.wannaBeX = ball.x;
    this.wannaBeZ = ball.z;
    this.cpuMove();
};
Player.prototype.cpuDefense = function(player, ball){
    if(this.ID === 1){
        this.guarding = 2;
    } else if(this.ID === 2){
        this.guarding = 3;
    } else if(this.ID === 3){
        this.guarding = 0;
    } else{
        this.guarding = 1;
    } 
    try{
    this.wannaBeZ = playerZ[this.guarding][15];
    if(this.guarding === 0||this.guarding === 1){
        if(player[this.guarding].x>800){
            this.wannaBeX = playerX[this.guarding][30] + 70;
        } else{
            this.wannaBeX = 870;
        }
    } else{
        if(player[this.guarding].x<300){
            this.wannaBeX = player[this.guarding].x - 70;
        } else{
            this.wannaBeX = 225;
        }
    }
    if(player[this.guarding].dunking){
        this.wannaBeX = player[this.guarding].x;
    }
    if(player[this.guarding].shooting&&this.y===0&&player[this.guarding].y<-40&&ball.yvel<-3){
        this.jump();
    }
    } catch(e){
        println(e.message);
    }
    if(this.y === 0){
        this.cpuMove();
    }
};
//}
//basketball object{
var Basketball = function(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    this.xvel = 0;
    this.yvel = 0;
    this.zvel = 0;
    this.dribbling = false;
    this.carriedBy = "";
    this.facing = 0;
    this.heightLimit = false;
    this.maxSpeed = 15;
    this.speedMag = 0;
    this.shotChance = 0;
    this.shot = false;
    this.shotChance = 0;
    this.dunking = false;
    this.stealCooldown = 0;
    this.pointsWorth = 2;
    this.shotBy = "";
};
Basketball.prototype.run = function(ball, players, hoops){
        for(var i = 0; i<players.length;i++){
            if(this.shotBy === "blue"&&(i===0||i===1)){
                i = 2;
            }if(this.shotBy === "red"&&(i===2||i===3)){
                break;
            }
            if(!this.dribbling){
                this.collide(players, i);
            }
        }
        if(this.shot){
            this.hoopCollide(hoops);
        }
    this.update(hoops, players);
    this.draw();
    this.stealCooldown ++;
    if(!turnover&&shotclock!==0&&frameCount%60===0&&this.carriedBy !== ""){
        shotclock --;
    } if(shotclock === 0&&this.y>-1&&!turnover){
        shotclockViolation = true;
        this.shot = false;
        this.dunking = false;
        if(this.carriedBy === 0||this.carriedBy === 1||this.shotBy === "blue"){
            turnoverTeam = "red";
        } else{
            turnoverTeam = "blue";
        }
        if(this.carriedBy !== ""){
            players[this.carriedBy].dunking = false;
            this.dribbling = false;
            players[this.carriedBy].carryingBall = false;
            players[this.carriedBy].passCooldown = 0;
        }
        this.z = 210;
        turnover = true;
    }
};
Basketball.prototype.draw = function() {
    fill(0, 0, 0, 150);
    ellipse(this.x, this.z, 22, 18);
    fill(207, 83, 0);
    ellipse(this.x, this.z+this.y, 18, 18);
    stroke(0, 0, 0);
    strokeWeight(1.5);
    line(this.x-9, this.z+this.y, this.x+8, this.z+this.y);
    fill(0, 0, 0, 0);
    ellipse(this.x, this.z+this.y-0, 18, 13);
    noStroke();
};
Basketball.prototype.update = function(hoops, player){
    this.yvel += 0.1;
    this.y += this.yvel;
    this.z = constrain(this.z, 50, 400);
    this.x = constrain(this.x, 10, 1110);
    if(this.heightLimit){
        this.y = constrain(this.y, -10, 0);
    }else{
        this.y = constrain(this.y, -500, 0);
    }
    if(this.y>-0.1){
        this.dunking = false;
        this.shot = false;
        this.shotChance = 0;
        if(this.dribbling){
            this.yvel = -3;
        }else if(turnover){
            this.yvel = 0;
            if(turnoverTeam === "red"&&player[2].passCooldown>30){
                this.x = 1110;
            } else if(turnoverTeam === "blue"&&player[0].passCooldown>30){
                this.x = 20;
            }
            
        }else{
            this.yvel *= -0.9;
            this.shotBy = "";
        }
    }
    if(this.carriedBy !== ""){
        if(players[this.carriedBy].shooting){
            this.dribbling = false;
            this.yvel = 0;
            this.y = player[this.carriedBy].y-130;
            this.x = player[this.carriedBy].x + 5;
            this.z = player[this.carriedBy].z + 5;
        }
        if(this.dribbling){
            player[this.carriedBy].carryingBall = true;
            this.x = players[this.carriedBy].x-15;
            this.z = players[this.carriedBy].z+this.facing;
            if(player[this.carriedBy].direction === "up"){
                this.facing = -1;
            } else{
                this.facing = 1;
            }
        }
        this.speedMag = mag(this.xvel, this.zvel);
        if(this.speedMag>this.maxSpeed){
            var m = this.maxSpeed/this.speedMag;
            this.xvel*=m;
            this.zvel*=m;
        }
    }
    this.x += this.xvel;
    this.z += this.zvel;
};
Basketball.prototype.collide = function(player, i){
    try{
        if(this.x-9>player[i].x-28&&this.x+9<player[i].x+28&&this.z>player[i].z-35&&this.z<player[i].z+35&&abs(this.y)+player[i].y<30&&player[i].passCooldown>30&&!player[i].shooting&&!this.shot&&this.dunking === false){
            this.dribbling = true;
            this.heightLimit = false;
            this.carriedBy = i;
            this.zvel = 0;
            this.xvel = 0;
            this.yvel = 0;
            this.x = player[i].x-15;
            player[i].carryingBall = true;
            if(i === 1&&player[0].controls === "arrows"){
                player[0].controls = "";
                player[0].cpu = true;
                player[1].cpu = false;
                player[1].controls = "arrows";
            }if(i === 0&&player[1].controls === "arrows"){
                player[1].controls = "";
                player[1].cpu = true;
                player[0].cpu = false;
                player[0].controls = "arrows";
            }if(i === 2&&player[3].controls === "wasd"){
                player[3].controls = "";
                player[3].cpu = true;
                player[2].cpu = false;
                player[2].controls = "wasd";
            } if(i === 3&&player[2].controls === "wasd"){
                player[2].controls = "";
                player[2].cpu = true;
                player[3].cpu = false;
                player[3].controls = "wasd";
            }
            player[i].setWannaBe = false;
        } if(((this.shot)||(this.dunking&&player[i].y<-40&&!player[i].dunking&&player[this.carriedBy].shooting))&&player[i].shootCooldown>30&&this.x-9>player[i].x-28&&this.x+9<player[i].x+28&&this.z>player[i].z-38&&this.z<player[i].z+38&&abs(this.y)+player[i].y-130<80){
            var chance = round(random(0, 2));
            if(this.dunking&&chance === 0){
                player[i].shootCooldown = 0;
                player[i].yvel = 5;
            }
            if(this.dunking&&chance === 1){
                this.dunking= false;
                player[this.carriedBy].dunking = false;
                player[this.carriedBy].shooting = false;
                player[this.carriedBy].carryingBall = false;
                this.carriedBy = "";
                this.shot = false;
                this.x -= 10;
                this.xvel *= random(-0.8, -1.2);
                this.zvel *= random(-0.8, -1.2);
                this.yvel *= random(-0.2, -0.6);
            }else if(!this.dunking&&this.shot){
                player[i].shooting = false;
                this.shot = false;
                if(this.yvel<0){
                    this.xvel *= random(-0.6, -0.9);
                    this.zvel *= random(-0.2, -0.6);
                    this.yvel *= random(-0.2, -0.6);
                } else{
                    turnover = true;
                    this.z = 210;
                    this.y = 0;
                    this.yvel = 0;
                    this.xvel = 0;
                    this.zvel = 0;
                    if(this.shotBy === "red"){
                        turnoverTeam = "blue";
                        redScore += this.pointsWorth;
                        this.x = 20;
                    } if(this.shotBy === "blue"){
                        turnoverTeam = "red";
                        blueScore += this.pointsWorth;
                        this.x = 1110;
                    }
                    goaltending = true;
                }
                this.shot = false;
            }
        } 
    }catch(e){
        println(e);
    }
};
Basketball.prototype.hoopCollide = function(hoops){
    if(this.y>-133&&this.z>205&&this.z<225&&((this.x>1066)||(this.x<56))){
        this.shot = false;
        if(random(0, 100)<=this.shotChance){
            this.xvel = 0;
            this.zvel = 0;
            if(this.shotBy === "blue"){
                blueScore += this.pointsWorth;
                turnoverTeam = "red";
            } else if(this.shotBy === "red"){
                redScore += this.pointsWorth;
                turnoverTeam = "blue";
            }
            this.shotBy = "";
            turnover = true;
            shotclock = 24;
        } else{
            this.yvel = -3;
            this.xvel *= random(-0.2, -0.5);
            this.zvel *= random(-0.2, -0.5);
            shotclock = 24;
            this.shotBy = "";
        }
    }
    
};
var ball = new Basketball(560, 0, 208);
var testBall = new Basketball(width/2, 0, height/2);
//}
//hoop object{
var Hoop = function(x, y, z, side){
    this.x = x;
    this.y = y;
    this.z = z;
    this.side = side;
};
Hoop.prototype.draw = function() {
    pushMatrix();
    translate(this.x,this.z);
    stroke(224, 224, 224);
    strokeWeight(5);
    fill(247, 232, 232);
    if(this.side==="left"){
        scale(-1,1);
    }
    pushMatrix();
    translate(20, -134);
    quad(0, -40, 10, -35, 10, 25, 0, 15);
    popMatrix();
    noStroke();
    fill(0, 0, 0, 150);
    ellipse(0,0, 20, 15);
    strokeWeight(1);
    stroke(255); //credit to paradox programming for making the net
    for(var i = 0; i < 360; i += 20){
        var x = sin(i);
        var z = cos(i);
        var x2 = sin(i+34);
        var z2 = cos(i+34);
        var netHeight = 25;
        var d =3;
        line(x*12.5,z*17/2+this.y,x2*25/d,z2*17/d+netHeight+this.y);
        line(x*12.5,-z*17/2+this.y,x2*25/d,-z2*17/d+netHeight+this.y);
    }
    stroke(196, 19, 19);
    strokeWeight(3);
    fill(0, 0, 0, 0);
    ellipse(0, this.y, 25, 17);
    line(12.5, this.y, 23, this.y);
    noStroke();
    popMatrix();
};
Hoop.prototype.run = function(){
    this.draw();
};
var rightHoop = new Hoop(1076, -133, 212, "right");
var leftHoop = new Hoop(49, -133, 212, "left");
var menuHoop = new Hoop(371, -133, 288, "right");
var hoops = [rightHoop, leftHoop];
//} //thanks to paradox programming for designing the net
//scenery functions{
var fanX = -170;
var fanY = -200;
var fans = [];
var fansColor = [];
while(fanY<50){
    fans.push({
        x: fanX,
        y: fanY,
    });
    if(round(random(0, 1)) === 1){
            fansColor.push(color(204, 10, 10));
        } else{
            fansColor.push(color(7, 56, 179));
        }
    if(fanX>1250){
        fanX = -170;
        fanY += 50;
    }else{
        fanX += 35;
    }
}
var drawFans = function(){
    for(var i in fans){
        fill(245, 225, 147);
        ellipse(fans[i].x, fans[i].y-60, 20, 20);
        fill(fansColor[i]);
        rect(fans[i].x-15, fans[i].y-50, 30, 63, 3);
    }
};
var drawCourt = function(){
    fill(31, 44, 191);
    rect(-193, 28, 1632, 390);
    pushMatrix();
    scale(1.25);
    translate(0, -71);
    strokeWeight(3.5);
    stroke(255, 255, 255);
    fill(219, 156, 96);
    quad(0, 390, 30, 110, 870, 110, 900, 390);
    line(450, 110, 450, 390);
    ellipse(450, 244, 120, 120);
    arc(879, 244, 466, 251, 87, 268);
    fill(255, 0, 0);
    ellipse(701, 244, 103, 76);
    fill(31, 44, 191);
    quad(879, 206, 700, 206, 708, 283, 889, 284);
    fill(219, 156, 96);
    arc(21, 244, 466, 251, -87, 94);
    fill(255, 0, 0);
    ellipse(199, 244, 103, 76);
    fill(31, 44, 191);
    quad(21, 206, 200, 206, 192, 283, 11, 284);
    popMatrix();
    fill(219, 17, 17);
    pushMatrix();
    translate(1216, 0);
    rotate(82);
    textSize(60);
    text("Tannerderp", 204, 124);
    popMatrix();
    pushMatrix();
    translate(166, 0);
    rotate(99);
    text("Tannerderp", 244, 167);
    popMatrix();
    noStroke();
    drawFans();
    fill(48, 48, 48);
    rect(-200, -7, 1523, 35);
};
//}
//buttons{
var Button = function(x, y, width, height, radius, color, text, textSize, textColor, react){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.textSize = textSize;
    this.textColor = textColor;
    this.react = react || function(){println("MAKE A FUNCTION FOR ME!!!!!");};
};
Button.prototype.update = function(){
    if(mouseX>this.x&&mouseX<this.x+this.width&&mouseY>this.y&&mouseY<this.y+this.height){
        cursor(HAND);
        if(clicked){
            clicked = false;
            this.react();
        }
    }
};
Button.prototype.draw = function() {
    this.update();
    fill(this.color);
    rect(this.x, this.y, this.width, this.height, this.radius);
    fill(this.textColor);
    textSize(this.textSize);
    text(this.text, this.x+this.width/2, this.y+this.height/1.7);
};
var playervsplayer = new Button(-4, 99, 409, 71, 5, color(36, 36, 36), "Player vs Player", 22, color(255, 255, 255), function(){scene = "game";});
var playervscpu = new Button(-4, 231, 409, 71, 5, color(36, 36, 36), "Player vs CPU", 22, color(255, 255, 255), function(){player3.cpu = true;player3.controls = "";scene = "game";});
var resume = new Button(-4, 99, 409, 71, 5, color(36, 36, 36), "Resume", 30, color(255, 255, 255), function(){scene = "game";});
var quit = new Button(-4, 230, 409, 71, 5, color(36, 36, 36), "Quit", 30, color(255, 255, 255), function(){Program.restart();});
//}
//game functions{
var tipped = false;
var addedZero = "0";
var displayScoreBoard = function(){
    fill(31, 30, 30);
    rect(315, 330, 80, 64);
    fill(17, 60, 189);
    rect(315, 330,  80, 23);
    fill(194, 10, 10);
    rect(315, 353,  80, 23);
    fill(255, 255, 255);
    textSize(18);
    text("P1:    "+blueScore, 353, 347);
    if(player3.controls === "wasd"||player4.controls === "wasd"){
        text("P2:    "+redScore, 353, 371);
    } else{
        text("CPU:  "+redScore, 353, 371);
    }
    textSize(17);
    if(half  === 1){
        text("1st", 330, 390);
    } else if(half === 2){
        text("2nd", 330, 390);
    } else{
        text(half-2+"OT", 330, 390);
    }
    text(minutes+":"+addedZero+seconds, 368, 390);
    if(tipped){
        if(frameCount%60 === 0&&!turnover){
            seconds --;
        }
    }
    if(seconds<0&&minutes !== 0){
        seconds = 59;
        minutes --;
    }
    if(seconds<10){
        addedZero = "0";
    } else{
        addedZero = "";
    }
    if(shotclock<13){
        fill(0, 0, 0);
        textSize(20);
        text("Shot", 36, 338);
        rect(14, 342, 46, 46);
        fill(186, 15, 15);
        textSize(40);
        text(shotclock, 37, 378);
    }
};
var tipoff = function(){
    if(frameCount%160 === 0){
        ball.yvel = -7.5;
        tipped = true;
    }
    if(ball.carriedBy !== ""||tipped){
        tipoff = false;
    }
};
var Turnover = function(){
    if(turnoverTeam === "red"){
        try{
        if(players[0].x<750&&players[1].x<750&&players[3].carryingBall){
            shotclock = 24;
            shotclockViolation = false;
            turnover = false;
            goaltending = false;
            turnoverTeam = "";
            for(var i in players){
                players[i].canMove = true;
            }
        } else{
            for(var i in players){
                players[i].canMove = false;
            }
            if(ball.y>-50&&players[2].x<905){
                ball.x = 1110;
                ball.y = 0;
                ball.yvel = 0;
            } if(players[0].x>749&&players[0].y === 0){
                players[0].x -= 3.5;
                players[0].passCooldown = 0;
                if(players[0].carryingBall){
                    ball.dribbling = false;
                    ball.carriedBy = "";
                    players[0].carryingBall = false;
                    players[0].passCooldown = 0;
                    ball.x = 1110;
                    ball.y = 0;
                    ball.yvel = 0;
                }
            }if(players[1].x>749&&players[1].y === 0){
                players[1].x -= 3.5;
                players[1].passCooldown = 0;
                if(players[1].carryingBall){
                    ball.dribbling = false;
                    ball.carriedBy = "";
                    players[1].carryingBall = false;
                    players[1].passCooldown = 0;
                    ball.x = 1110;
                    ball.y = 0;
                    ball.yvel = 0;
                }
            }if(players[2].x<1115&&players[2].y === 0){
                players[2].x += 3;
                if(players[2].z>210){
                    players[2].z -= 3;
                }if(players[2].z<210){
                    players[2].z += 3;
                }
            } if(players[3].x<900){
                players[3].x += 3;
                if(players[3].z>210){
                    players[3].z -= 3;
                }if(players[3].z<210){
                    players[3].z += 3;
                }
            }else if(players[2].carryingBall&&players[0].x<751&&players[1].x<751){
                shotclock = 24;
                shotclockViolation = false;
                players[2].pass(ball, players);
            } else if(players[2].z>213){
                players[2].z -= 3;
            }else if(players[2].z<207){
                players[2].z += 3;
            } 
        }
        }catch(e){
            println("Well that failed");
        }
        
    }
    if(turnoverTeam === "blue"){
        try{
        if(players[2].x>300&&players[3].x>300&&players[1].carryingBall){
            shotclock = 24;
            shotclockViolation = false;
            turnover = false;
            turnoverTeam = "";
            goaltending = false;
            for(var i in players){
                players[i].canMove = true;
            }
        } else{
            for(var i in players){
                players[i].canMove = false;
            }
            if(ball.y>-50&&players[0].x>12){
                ball.x = 20;
                ball.y = 0;
                ball.yvel = 0;
            } if(players[2].x<400&&players[2].y === 0){
                players[2].x += 3.5;
                if(players[2].carryingBall){
                    ball.dribbling = false;
                    ball.carriedBy = "";
                    players[2].carryingBall = false;
                    players[2].passCooldown = 0;
                    ball.x = 0;
                    ball.y = 0;
                    ball.yvel = 0;
                }
            }if(players[3].x<400&&players[3].y === 0){
                players[3].x += 3.5;
                if(players[3].carryingBall){
                    ball.dribbling = false;
                    ball.carriedBy = "";
                    players[3].carryingBall = false;
                    players[3].passCooldown = 0;
                    ball.x = 0;
                    ball.y = 0;
                    ball.yvel = 0;
                }
            }if(players[0].x>0&&players[0].y === 0){
                players[0].x -= 3;
                if(players[0].z>210){
                    players[0].z -= 3;
                }if(players[0].z<210){
                    players[0].z += 3;
                }
            } if(players[0].x<10&&players[0].y === 0){
                players[0].x += 3;
                if(players[0].z>210){
                    players[0].z -= 3;
                }if(players[0].z<210){
                    players[0].z += 3;
                }
            }
            if(players[1].x>225){
                players[1].x -= 3;
                if(players[1].z>210){
                    players[1].z -= 3;
                }if(players[1].z<210){
                    players[1].z += 3;
                }
            } else if(players[0].carryingBall&&players[2].x>300&&players[3].x>300){
                shotclock = 24;
                shotclockViolation = false;
                ball.dribbling = true;
                ball.x= players[0].x-17;
                ball.z = 210;
                players[0].pass(ball, players);
                players[0].passCooldown = 0;
            } else if(players[0].z>214){
                players[0].z -= 3;
            }else if(players[0].z<206){
                players[0].z += 3;
            }
            if(players[0].canMove === false&&ball.z>399){
                players[1].carryingBall = true;
                ball.carriedBy = 1;
                ball.x = players[1].x;
                ball.z = players[1].z;
            }
        }
        }catch(e){
            println(e.message);
        }
    }
};
//}
//array sorting(3d) function{
var world = [player1, player2, player3, player4, ball, rightHoop, leftHoop];
var sortWorld = function(){
    world.sort(function(a, b){
            return a.z-b.z;
        });
};
//}
//scenes{
var goToTransX = -100;
var transX = goToTransX;
var goToTransY = 0;
var transY = goToTransY;
var game = function(){
    if(tipoff){
        tipoff();
    }
    background(87, 87, 87);
    pushMatrix();
    goToTransX = -ball.x+200;
    transX+=(goToTransX-transX)/10;
    if(ball.y<-150){
        goToTransY = -ball.y-130;
    } else{
        goToTransY = 0;
    }
    transY += (goToTransY-transY)/10;
    translate(transX, transY);
    drawCourt();
    sortWorld();
    for(var i in world){
        world[i].run(ball, players, hoops);
    }
    popMatrix();
    displayScoreBoard();
    if(turnover === true){
        Turnover();
    } 
    fill(181, 11, 11);
    textSize(55);
    minutes = constrain(minutes, 0, 100);
    seconds = constrain(seconds, 0, 100);
    if(goaltending){
        text("GOALTENDING!", width/2, height/2);
    } if(shotclockViolation){
        text("SHOTCLOCK\nVIOLATION!", width/2, height/2);
    } if(minutes === 0&&seconds === 0&&ball.y>-1){
        if(half === 1){
            scene = "halftime";
        } else if(redScore === blueScore){
            scene = "overtime";
        } else{
            scene = "results";
        }
    }
    fill(224, 224, 224, 230);
    rect(359, 5, 10, 33);
    rect(377, 5, 10, 33);
    if(mouseX>359&&mouseY<40){
        cursor(HAND);
        if(clicked){
            scene = "pause";
        }
    }
    releaseKeys = {};
};
var pause = function(){
    background(207, 207, 207);
    fill(181, 23, 23);
    rect(0, 0, width, 59, 5);
    rect(0, height-59, width, 59, 5);
    fill(0, 0, 0);
    textSize(57);
    text("Paused", width/2, 44);
    resume.draw();
    quit.draw();
};
var home = function(){
    background(207, 207, 207);
    fill(181, 23, 23);
    rect(0, 0, width, 59, 5);
    rect(0, height-59, width, 59, 5);
    fill(0, 0, 0);
    textSize(57);
    text("Basketball", width/2,46);
    textSize(34);
    text("Created By Tannerderp", width/2, 380);
    playervsplayer.draw();
    playervscpu.draw();
};
var tip  = round(random(0, tips.length-1));
var halftime = function(){
    background(207, 207, 207);
    fill(181, 23, 23);
    rect(0, 0, width, 59, 5);
    fill(0, 0, 0);
    textSize(57);
    text("Halftime", width/2, 46);
    textSize(40);
    text("Tip:", width/2, 91);
    textSize(20);
    text(tips[tip], 2, 183, 400, 200);
    if(frameCount%830===0||clicked){
        minutes = 4;
        seconds = 0;
        half = 2;
        shotclock = 24;
        scene = "game";
    }
    cursor(HAND);
};
var overtime = function(){
    background(207, 207, 207);
    fill(181, 23, 23);
    rect(0, 0, width, 59, 5);
    fill(0, 0, 0);
    textSize(55);
    text("Overtime", width/2, 44);
    textSize(30);
    text("Wow the game still isn't decided, dang. Well good luck!", 3, 183, 400, 200);
    if(frameCount%750===0){
        minutes = 2;
        seconds = 0;
        half ++;
        shotclock = 24;
        scene = "game";
    }
};
var results = function(){
    background(207, 207, 207);
    fill(181, 23, 23);
    rect(0, 0, width, 59, 5);
    textSize(50);
    fill(0, 0, 0);
    if(blueScore>redScore){
        text("Player 1 Wins!", width/2, 44);
    } else{
        text("Player 2 Wins!", width/2, 44);
    }
    textSize(67);
    text(blueScore+" - "+redScore, width/2, 234);
    textSize(40);
    text("Thanks for playing!", width/2, 300);
    if(frameCount%500===0){
        Program.restart();
    }
};
//}
draw = function() {
    cursor("default");
    switch(scene){
        case"game":game();break;
        case"home":home();break;
        case"pause":pause();break;
        case"halftime":halftime();break;
        case"overtime":overtime();break;
        case"results":results();break;
    }
    clicked = false;
};
////////// Kids code go above here..////////////
}};
// Get the canvas that Processing-js will use
    var canvas = document.getElementById("mycanvas"); 
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
    var processingInstance = new Processing(canvas, sketchProc); 
