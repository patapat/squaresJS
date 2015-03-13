(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  var Homescreen = Squares.Homescreen = function (options) {
    this.ctx = options.ctx

    Squares.Game.call(this, options);
  }

  Squares.Util.inherits(Homescreen, Squares.Game);

  Homescreen.prototype.step = function () {
    this.moveSquares();
  }

  Homescreen.prototype.sterilize = function () {
    Squares.Game.CURSOR_SQUARE.length = 0;
    clearInterval(this.pointInterval);
  }

  Homescreen.prototype.renderScore = function () {
    return; //override Game.renderScore()
  }

  Homescreen.prototype.draw = function (ctx) {
    // ctx.clearRect(0, 0, Squares.Game.DIM_X, Squares.Game.DIM_Y);
    ctx.fillStyle = Squares.Game.BG_COLOR;
    ctx.fillRect(0, 0, Squares.Game.DIM_X, Squares.Game.DIM_Y);

    this.allSquares().forEach(function (square) {
      if (square instanceof Squares.Circle) {
        square.drawCircle(ctx);
      } else {
        square.draw(ctx);
      }
    });
  };
})();
