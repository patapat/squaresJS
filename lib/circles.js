(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  function randomRadius () {
    return (Math.random() * 15) + 15;
  }


  var Circle = Squares.Circle = function (options) {
    options.color = this.redOrBlack();
    options.pos = options.pos || options.game.randomPosition();
    options.vel = this.randomVelocity();
    options.radius = randomRadius();
    options.dir = this.randomDir(this.randomVelocity());

    Squares.MovingSquare.call(this, options);
  };

  Squares.Util.inherits(Circle, Squares.MovingSquare);

  Circle.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof Squares.CursorSquare) {
      this.game.powerUp();
      this.respawn();
    }
  };

  Circle.prototype.respawn = function () {
    this.game.remove(this);
  };
})();
