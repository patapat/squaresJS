(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  function redOrBlack () {
    var rand = Math.random();
    var color = "black";
    if (rand < 0.5) {
      color = "red";
    }


    return color
  }

  var Square = Squares.Square = function (options) {
    options.color = redOrBlack();
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
      this.respawn();
    }
  };

  Square.prototype.respawn = function () {
    this.game.remove(this);
    // this.dir = this.randomDir(Square.SPEED);
    // this.pos = this.game.spawnSquare();
  };
})();
