var five = require("johnny-five");

class Game
{
    constructor(board)
    {
        this.board = board;
        this.leds = new five.Leds(["a2", "a3", "a4", "a5"]);
        this.buttons = [
            new five.Button("b2"),
            new five.Button("b3"),
            new five.Button("b4"),
            new five.Button("b5")]
        this.gameState = "loading";
        this.moves = [];
        this.guessCount = 0;
    }

    start()
    {
        for(let i = 0; i < this.buttons.length; i++)
        {
            this.buttons[i].on("press", () => this.onButtonPress(i))
            this.buttons[i].on("release", () => this.onButtonUp(i))
        }
        
        this.newGame();
    }

    newGame(skip)
    {
        this.moves = [];

        this.leds.on();
        setTimeout(() => {
            this.leds.off();
            this.addMove();
        }, skip ? 0 : 1000)
    }

    addMove()
    {
        this.moves.push(Math.floor(Math.random() * this.leds.length));
        this.gameState = "showing";
        //console.log(this.moves);
        setTimeout(() => {
            this.startSequence();
        }, 500)
    }

    startSequence()
    {
        let i = 0
        let skip = false;

        this.board.loop(400, (end) => 
        {
            this.leds.off();
            
            if(i >= this.moves.length)
            {
                this.waitForInput();
                end();
            }
            else if(!skip)
            {
                this.leds[this.moves[i]].on();
                i++;
            }
            skip = !skip;
        })
    }

    waitForInput()
    {
        this.gameState = "input";
        this.guessCount = 0;
    }

    gameOver()
    {
        this.leds.on();
        this.gameState = 'over';
        console.log('SCORE: ', this.moves.length - 1)
    }

    onButtonPress(i)
    {
        if(this.gameState == 'input')
        {
            this.leds.off();
            this.leds[i].on();
        }
    }

    onButtonUp(i)
    {
        if(this.gameState == 'input')
        {
            this.leds.off();
            if(this.moves[this.guessCount] == i)
            {
                this.guessCount++;
                if(this.guessCount >= this.moves.length)
                {
                    this.addMove();
                }
            } 
            else
            {
                this.gameOver();
            }
        }
        else if(this.gameState == 'over')
        {
            this.newGame(true);
        }
    }

}
    
module.exports = Game;