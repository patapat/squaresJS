(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  var GameView = Squares.GameView = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.cursorSquare = this.game.addCursorSquare();
    this.timerId = null;
  };

  GameView.prototype.stop = function () {
    clearInterval(this.timerId);
  };

  GameView.prototype.start = function () {
    var gameView = this;
    this.timerId = setInterval(
      function () {
        gameView.game.step();
        gameView.game.draw(gameView.ctx);
      }, 1000 / Squares.Game.FPS
    );

    // this.bindKeyHandlers();
  };
})();
