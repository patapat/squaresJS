(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }
  var Game = Squares.Game = function () {
    this.squares = [];
    this.cursorSquares = [];

    this.addSquares();
  };

  Game.BG_COLOR = "#FFFFFF";
  Game.DIM_X = 300;
  Game.DIM_Y = 300;
  Game.FPS = 100;
  Game.NUM_SQUARES = 5;

  Game.prototype.add = function (object) {
    if (object instanceof Squares.Square) {
      this.squares.push(object);
    } else if (object instanceof Squares.CursorSquare) {
      this.cursorSquares.push(object);
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.addSquares = function (numSquares) {
    for (var i = 0; i < Game.NUM_SQUARES; i++) {
      this.add(new Squares.Square({ game: this }));
    }
  };

  Game.prototype.addCursorSquare = function () {
    var cursorSquare = new Squares.CursorSquare({
      pos: [Game.DIM_X * 0.5, Game.DIM_Y * 0.5],
      game: this
    });

    this.add(cursorSquare);
    return cursorSquare;
  };

  Game.prototype.allSquares = function () {
    return [].concat(this.squares).concat(this.cursorSquares);
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    var that = this;

    this.allSquares().forEach(function (square) {
      square.draw(ctx);
    });
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < 0) || (pos[1] < 0)
      || (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  };

  Game.prototype.randomPosition = function () {
    return [
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
    ];
  };

  Game.prototype.getMousePos = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  Game.prototype.moveCursorSquare = function () {
    var canvas = document.getElementsByTagName('canvas')[0];
    var context = canvas.getContext('2d');
    var that = this;
    var cs = that.cursorSquares[0]
    cs.draw(context)
    canvas.addEventListener('mousemove', function(evt) {
      var mousePos = Game.prototype.getMousePos(canvas, evt);
      cs.pos = [mousePos.x, mousePos.y]
      cs.draw(context)
      // var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
      // writeMessage(canvas, message);
    }, false);
  }

  Game.prototype.checkCollisions = function () {
    var game = this;

    this.allSquares().forEach(function (obj1) {
      var obj2 = game.allSquares()[game.allSquares().length - 1];
      if (obj1 == obj2) {
        // don't allow self-collision
        return;
      }

      if (obj1.isCollidedWith(obj2)) {
        obj1.collideWith(obj2);
      }
    });
  };

  Game.prototype.remove = function (object) {
    if (object instanceof Squares.Square) {
      var idx = this.squares.indexOf(object);
      this.squares[idx] = new Squares.Square({ game: this });
    } else if (object instanceof Squares.CursorSquare) {
      this.cursorSquares.splice(this.cursorSquares.indexOf(object), 1);
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.step = function () {
    this.moveSquares();
    this.moveCursorSquare();
    this.checkCollisions();
  };

  Game.prototype.moveSquares = function () {
    this.allSquares().forEach(function (square) {
      square.move();
    });
  };


  Game.prototype.wrap = function (pos) {
    return [
      wrap(pos[0], Game.DIM_X), wrap(pos[1], Game.DIM_Y)
    ];

    function wrap (coord, max) {
      if (coord < 0) {
        return max - (coord % max);
      } else if (coord > max) {
        return coord % max;
      } else {
        return coord;
      }
    }
  }
})();
