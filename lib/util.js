(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  };

  var Util = Squares.Util = {};

  var allPos = Util.allPos = function (pos, length) {
    var allPositions = [pos, [pos[0], pos[1] + length], [pos[0] + length, pos[1] + length], [pos[0] + length, pos[1]]]
    return allPositions;
  };

  var posInside = Util.posInside = function (allPos, checkPos) {
    var check = true;
    for (var i = 0; i < checkPos.length; i++) {
      if (checkPos[i] > allPos[0][i] && checkPos[i] < allPos[2][i]) {
      } else {
        check = false;
      }
    }

    return check;
  };

  var checkCollision = Util.checkCollision = function (square1, square2) {
    var collided = false;
    Squares.Util.allPos(square1.pos, square1.length).forEach(function (pos) {
      if (Squares.Util.posInside(Squares.Util.allPos(square2.pos, square2.length), pos)) {
        collided = true;
      }
    });

    Squares.Util.allPos(square2.pos, square2.length).forEach(function (pos) {
      if (Squares.Util.posInside(Squares.Util.allPos(square1.pos, square1.length), pos)) {
        collided = true;
      }
    });
    return collided;
  };

  var inherits = Util.inherits = function (ChildClass, BaseClass) {
    function Surrogate () { this.constructor = ChildClass };
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  };
})();
