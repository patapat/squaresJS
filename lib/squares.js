(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  var Square = Squares.Square = function (options) {
    options.color = this.redOrBlack();
    options.pos = options.pos || options.game.randomPosition();
    options.vel = this.randomVelocity();
    options.length = this.randomSize();
    options.dir = this.randomDir(this.randomVelocity());

    Squares.MovingSquare.call(this, options);
  };

  Squares.Util.inherits(Square, Squares.MovingSquare);

  Square.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof Squares.CursorSquare) {
      this.respawn();
    }
  };

  Square.prototype.respawn = function () {
    this.game.remove(this);
  };
})();
