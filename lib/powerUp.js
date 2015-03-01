(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  var PowerUp = Squares.PowerUp = function (options) {
    options.color = "grey"
    options.pos = [200, 100]
    options.powerLength = 300;
    options.height = 20;
    options.invincible = true;

    Squares.MovingSquare.call(this, options);
  };

  PowerUp.prototype.draw = function (ctx) {
    debugger;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos[0], this.pos[1], this.powerLength, this.height);
  }

  PowerUp.prototype.move = function () {
    debugger;
    this.powerLength -= 10;
  }


  Squares.Util.inherits(PowerUp, Squares.MovingSquare);
})();
