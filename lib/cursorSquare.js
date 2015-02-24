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
    // options.color = options.color || randomColor();
    options.color = "red"
    Squares.MovingSquare.call(this, options)
  };

  CursorSquare.LENGTH = 20;

  Squares.Util.inherits(CursorSquare, Squares.MovingSquare);


  CursorSquare.prototype.length = function () {
    // this.pos = [this.pos[0], this.pos[1] + 1]
  };

  CursorSquare.prototype.relocate = function () {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
  };
})();
