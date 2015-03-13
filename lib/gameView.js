(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  var GameView = Squares.GameView = function (game, ctx) {
    this.canvasEl = document.getElementById("myCanvas");
    this.ctx = ctx;
    this.game = game;
    this.timerId = null;
    this.gameIsOver = false;
    this.mouseEvent = this.buttonInteraction.bind(this)
  };

  GameView.playButtonSensor = {
    color: "black",
    width: 100,
    height: 40,
    top: (Squares.Game.DIM_Y / 2) - 20,
    left: (Squares.Game.DIM_X / 2) - 50,
    text: "Play"
  }

  GameView.restartButtonSensor = {
    color: "black",
    width: 200,
    height: 40,
    top: (Squares.Game.DIM_Y / 2) - 20,
    left: (Squares.Game.DIM_X / 2) - 100,
    text: "Play Again"
  }

  GameView.prototype.stop = function () {
    clearInterval(this.timerId);
  };

  function resetGameValues () {
    Squares.MovingSquare.SPEED_STEP = 0.5;
    Squares.Game.SPEED_MULTIPLIER = 1;
  }

  GameView.prototype.startGame = function () {
    resetGameValues();
    this.canvasEl.style.cursor = "none";
    var ctx = document.getElementById("myCanvas").getContext("2d");
    var game = new Squares.Game(ctx);
    if (this.gameIsOver) {
      new Squares.GameView(game, ctx).start();
    } else {
      this.start();
    }

    this.canvasEl.removeEventListener('click', this.mouseEvent);
    this.canvasEl.removeEventListener('mousemove', this.mouseEvent);
    Squares.Game.OVER = false;
  }

  GameView.prototype.buttonInteraction = function (event) {
    var button = GameView.playButtonSensor;
    if (this.gameIsOver) {
      button = GameView.restartButtonSensor;
    }

    var x = event.pageX - this.canvasEl.offsetLeft;
    var y = event.pageY - this.canvasEl.offsetTop;

    if (y > button.top && y < button.top + button.height
        && x > button.left && x < button.left + button.width) {
          if (event.type === "click") {
            this.startGame();
          } else if (event.type === "mousemove") {
            if (this.ctx.fillStyle === "#000000") {
              this.renderPlayButton("red", button);
            }
          }
    } else {
      if (this.ctx.fillStyle === "#ff0000") {
        this.renderPlayButton("black", button);
      }
    }
  }

  GameView.prototype.renderPlayButton = function (color, button) {
    this.ctx.fillStyle = Squares.Game.BG_COLOR;
    this.ctx.fillRect(0, 0, Squares.Game.DIM_X, Squares.Game.DIM_Y);
    if (this.gameIsOver) {
      this.renderScore();
    }
    this.ctx.fillStyle = color;
    this.ctx.font = "40px Arial";
    this.ctx.fillText(button.text, button.left + 5, button.top + 30);
  }

  GameView.prototype.renderScore = function () {
    this.ctx.fillStyle = "black";
    this.ctx.font = "30px Arial"
    this.ctx.fillText("Score:"
                      + this.game.score
                      + " Squares:"
                      + this.game.squareScore,
                      this.game.dimX / 2 - 130,
                      this.game.dimY / 2 - 50);
  }

  GameView.prototype.start = function () {
    var gameView = this;
    var speedStep = setInterval(function () {
      Squares.MovingSquare.SPEED_STEP += .2;
    }, 5000);
    this.timerId = setInterval(
      function () {
        gameView.game.step(gameView.ctx);
        gameView.game.draw(gameView.ctx);
        if (gameView.game.endGame()) {
          gameView.gameIsOver = true;
          gameView.stop();
          gameView.gameOver();
          clearInterval(speedStep);
        }
      }, 1000 / Squares.Game.FPS
    );

  };

  GameView.prototype.gameOver = function () {
    clearInterval(this.game.pointInterval);
    this.ctx.fillStyle = Squares.Game.BG_COLOR;
    this.ctx.fillRect(0, 0, Squares.Game.DIM_X, Squares.Game.DIM_Y);
    this.canvasEl.style.cursor = "pointer";
    if (this.gameIsOver) {
      this.renderPlayButton("black", GameView.restartButtonSensor);
    } else {
      this.renderPlayButton("black", GameView.playButtonSensor);
    }

    this.canvasEl.addEventListener('click', this.mouseEvent);
    this.canvasEl.addEventListener('mousemove', this.mouseEvent);
  }
})();
