var five = require("johnny-five");

class Circle
{
    
    constructor(board)
    {
        this.direction = 'cw';
        this.state = 'spin';
        this.board = board;
        this.count = 0;
        this.speed = 10;
    }

    setDirection(newDirection)
    {
        this.direction = newDirection;
    }

    setState(newState)
    {
        this.state = newState;
        this.count = 0;
    }

    setSpeed(newSpeed)
    {
        this.speed = newSpeed;
        if(this.speed < 1) this.speed = 1;
        if(this.speed > 20) this.speed = 20;
    }

    start()
    {
        var rgb = new five.Led.RGB({
            pins: {
              red: "b7",
              green: "b5",
              blue: "b6",
            }
          });
        var colors = ["red", "orange", "yellow", "green", "lightblue", "blue"];
        var leds = new five.Leds(["a2", "a3", "a4", "a5", "a6", "a7"]);
        var spinIndex = 0;
        var flash = true;

        this.board.loop(10, () => 
        {
            if(this.state == 'spin' && this.count % this.speed == 0)
            {               
                leds.off();
                leds[spinIndex].on();
                rgb.color(colors[spinIndex]);
                spinIndex += this.direction == 'cw' ? 1 : -1;
                if (spinIndex >= leds.length) spinIndex = 0;
                if( spinIndex < 0) spinIndex = leds.length - 1;
            }
            
            if(this.state == 'flash')
            {      
                if(this.count % (this.speed * 4) < (this.speed * 4) / 2)
                {
                    leds.off();
                    rgb.off();
                }
                else
                {
                    leds.on();
                    rgb.color('white');
                };
            }

            this.count++;
            
        });
    }
}

module.exports = Circle;