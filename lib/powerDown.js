(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  function randomType () {
    var rand = Math.random() * 3;
    if (rand < 1) {
      return "redness";
    } else if (rand >= 1 && rand < 2) {
      return "grow";
    } else if (rand >= 2) {
      return "speedup";
    }
  }

  var PowerDown = Squares.PowerDown = function (options) {
    options.color = "rgba(255, 0, 0, 0.2)";
    options.pos = [100, 100];
    options.powerLength = 400;
    options.height = 20;
    options.type = randomType();
    options.invincible = true;

    Squares.MovingSquare.call(this, options);
  };

  Squares.Util.inherits(PowerDown, Squares.MovingSquare);
})();
