 var sketchProc = function(processingInstance) {
      with (processingInstance) {
    size(400, 400); 
    frameRate(30);
    
////////// Program Code Goes Under Here ////////////
    
function draw_eyes(){
   ellipse(250, 200, 10, 10);
   ellipse(153, 200, 10, 10);
}

    
    fill(255, 255, 0);
    ellipse(200, 200, 200, 200);
    noFill();
    stroke(0, 0, 0);
    strokeWeight(2);
    arc(200, 200, 150, 100, 0, PI);
    fill(0, 0, 0);
    draw_eyes();
    
////////// Kids code go above here..////////////
}};
// Get the canvas that Processing-js will use
    var canvas = document.getElementById("mycanvas"); 
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
    var processingInstance = new Processing(canvas, sketchProc); 
