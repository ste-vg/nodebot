var five = require("johnny-five");
var Tessel = require("tessel-io");
var Game = require("./game");

var board = new five.Board({
    io: new Tessel()
 });
  
board.on("ready", () => 
{
    let game = new Game(board);
    game.start();
})