(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  };

  var Util = Squares.Util = {};

  var allPos = Util.allPos = function (pos, length) {
    var allPositions = [pos, [pos[0], pos[1] + length], [pos[0] + length, pos[1] + length], [pos[0] + length, pos[1]]]
    return allPositions;
  };

  var dist = Util.dist = function (pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  };

  var circleAllPos = Util.circleAllPos = function (pos, radius) {
    return [[pos[0] + radius, pos[1]], [pos[0] - radius, pos[1]], [pos[0], pos[1] + radius], [pos[0] + radius, pos[1] - radius]];
  }

  var squareAllPos = Util.squareAllPos = function (pos, length) {
    var allSquarePos = [
      pos,
      [pos[0], pos[1] + length],
      [pos[0] + length, pos[1] + length],
      [pos[0] + length, pos[1]],
      [pos[0] + length/2, pos[1] + length],
      [pos[0], pos[1] + length/2],
      [pos[0] + length, pos[1] + length/2],
      [pos[0] + length/2, pos[1]]
    ]

    return allSquarePos;
  }

  var posInside = Util.posInside = function (allPos, checkPos) {
    var check = true;
    for (var i = 0; i < checkPos.length; i++) {
      if (!(checkPos[i] > allPos[0][i] && checkPos[i] < allPos[2][i])) {
        check = false;
      }
    }

    return check;
  };

  var checkCircleCollision = Util.checkCircleCollision = function (circle, cursor) {
    // if (cursor.invincible) { return false; }
    var collided = false;
    Squares.Util.circleAllPos(circle.pos, circle.radius).forEach(function (pos) {
      if (Squares.Util.posInside(Squares.Util.allPos(cursor.pos, cursor.length), pos)) {
        collided = true;
      }
    });

    Squares.Util.allPos(cursor.pos, cursor.length).forEach(function (pos) {
      if (Squares.Util.dist(circle.pos, pos) <= circle.radius) {
        collided = true;
      }
    });

    return collided;
  }

  var checkCollision = Util.checkCollision = function (square1, square2) {
    // if (square1.invincible || square2.invincible) { return false; }
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
