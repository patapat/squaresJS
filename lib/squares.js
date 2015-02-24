(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  function redOrBlack () {
    var rand = Math.random();
    var color = "black";
    if (rand < 0.4) {
      color = "red";
    }

    return color;
  }

  function randomLength () {
    return (Math.random() * 15) + 15;
  }

  function randomVelocity () {
    return (Math.random() * 1 + 0.5);
  }

  var Square = Squares.Square = function (options) {
    options.color = redOrBlack();
    options.pos = options.pos || options.game.randomPosition();
    options.vel = randomVelocity();
    options.length = randomLength();
    options.dir = this.randomDir(randomVelocity());

    Squares.MovingSquare.call(this, options);
  };

  Square.COLOR = "#505050";
  // Square.SPEED = 1;

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
