(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  function randomType () {
    var rand = Math.random() * 3;
    if (rand < 1) {
      return "invincible";
    } else if (rand >= 1 && rand < 2) {
      return "shrink";
    } else if (rand >= 2) {
      return "slowmo";
    }
  }

  var PowerUp = Squares.PowerUp = function (options) {
    options.color = "grey"
    options.pos = [100, 100]
    options.powerLength = 400;
    options.height = 20;
    options.type = randomType();
    options.invincible = true;

    Squares.MovingSquare.call(this, options);
  };


  Squares.Util.inherits(PowerUp, Squares.MovingSquare);
})();
