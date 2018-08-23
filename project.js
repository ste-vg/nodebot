var five = require("johnny-five");
var Tessel = require("tessel-io");
var Circle = require("./modules/circle");

var board = new five.Board({
  io: new Tessel()
});

board.on("ready", () => 
{
    let circle = new Circle(board);
    circle.start();

    var button = new five.Button("b3");
    button.on("press", () => circle.setState('flash'));
    button.on("release", () => circle.setState('spin'));

    var spdt = new five.Switch("b2");
    spdt.on("close", () => circle.setDirection('ccw'));
    spdt.on("open", () => circle.setDirection('cw'));

    var sensor = new five.Sensor("b4");
    sensor.on("change", () => circle.setSpeed(sensor.scaleTo([20, 1])));
});