(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  var Square = Squares.Square = function (options) {
    options.color = Square.COLOR;
    options.pos = options.pos || options.game.randomPosition();
    options.vel = Square.SPEED;
    options.length = Square.LENGTH;
    options.dir = this.randomDir(Square.SPEED);

    Squares.MovingSquare.call(this, options);
  };

  Square.COLOR = "#505050";
  Square.LENGTH = 10;
  Square.SPEED = .5;

  Squares.Util.inherits(Square, Squares.MovingSquare);

  Square.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof Squares.CursorSquare) {
      otherObject.relocate();
    }
  };
})();
