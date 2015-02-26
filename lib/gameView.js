(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  var GameView = Squares.GameView = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.timerId = null;
  };

  GameView.prototype.stop = function () {
    clearInterval(this.timerId);
  };


  GameView.prototype.start = function () {
    var gameView = this;
    this.timerId = setInterval(
      function () {
        gameView.game.step(gameView.ctx);
        gameView.game.draw(gameView.ctx);
        if (gameView.game.endGame()) {
          clearInterval(gameView.timerId);
          gameView.ctx.clearRect(0, 0, gameView.game.dimX, gameView.game.dimY);
          gameView.ctx.fillStyle = "black";
          gameView.ctx.font = "30px Arial"
          gameView.ctx.fillText("BOO YOU SUCK!\nScore:" + gameView.game.score + "\nSquares:" + gameView.game.squareScore, 20, gameView.game.dimY / 2)
          document.getElementById("myCanvas").style.cursor = "pointer";
        }
      }, 1000 / Squares.Game.FPS
    );

    // this.bindKeyHandlers();
  };

  GameView.prototype.gameOver = function () {
    
  }
})();
