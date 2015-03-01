(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  var PowerUp = Squares.PowerUp = function (options) {
    options.color = "grey"
    options.pos = [100, 100]
    options.powerLength = 400;
    options.height = 20;
    options.invincible = true;

    Squares.MovingSquare.call(this, options);
  };

  Squares.Util.inherits(PowerUp, Squares.MovingSquare);
})();
