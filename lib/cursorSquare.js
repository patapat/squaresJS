(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  function randomColor () {
    var hexDigits = "0123456789ABCDEF";

    var color = "#";
    for (var i = 0; i < 3; i ++) {
      color += hexDigits[Math.round((Math.random() * 16))];
    }

    return color;
  }

  var CursorSquare = Squares.CursorSquare = function (options) {
    options.pos = options.pos
    options.length = CursorSquare.LENGTH;
    options.vel = options.vel || [0, 0];
    options.color = "black";
    options.invincible = false;
    Squares.MovingSquare.call(this, options)
  };

  CursorSquare.LENGTH = 20;

  Squares.Util.inherits(CursorSquare, Squares.MovingSquare);

  CursorSquare.prototype.grow = function () {
    this.length += 0.5;
  }
})();
