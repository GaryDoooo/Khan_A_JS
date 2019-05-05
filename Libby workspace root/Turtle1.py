from turtle import *
wn = Screen()
alex = Turtle()
 
for aColor in ["yellow", "red", "purple", "blue"]:
   alex.color(aColor)
   alex.forward(50)
   alex.left(90)
 
wn.exitonclick()