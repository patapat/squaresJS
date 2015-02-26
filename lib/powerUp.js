(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  var powerUp = Squares.powerUp = function (options) {
    options.color = this.redOrBlack();
    options.pos = options.pos || options.game.randomPosition();
    options.vel = this.randomVelocity();
    options.length = this.randomSize();
    options.dir = this.randomDir(this.randomVelocity());

    Squares.MovingSquare.call(this, options);
  };

  powerUp.prototype.render = function (ctx) {
    this.ctx.fillStyle = "grey";
    this.ctx.fillRect(200, 100, 300, 20);
  }

  Squares.Util.inherits(powerUp, Squares.MovingSquare);
})();
