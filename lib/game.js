(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  function moveCursorSquare () {
    var canvas = document.getElementsByTagName('canvas')[0];
    var context = canvas.getContext('2d');

    var cs = Game.CURSOR_SQUARE;
    cs.draw(context)
    canvas.addEventListener('mousemove', function(evt) {
      var mousePos = Game.prototype.getMousePos(canvas, evt);
      cs.pos = [mousePos.x, mousePos.y]
      cs.draw(context)
      // var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
      // writeMessage(canvas, message);
    }, false);
  }

  var Game = Squares.Game = function (ctx) {
    this.ctx = ctx;
    this.squares = [];
    this.dimX = Game.DIM_X;
    this.dimY = Game.DIM_Y;
    this.score = Game.SCORE;
    this.squareScore = Game.SQUARE_SCORE;
    setInterval( function () {
      Game.SCORE += 1;
    }, 1000);
    this.addSquares();
    moveCursorSquare();
  };

  Game.BG_COLOR = "#FFFFFF";
  Game.DIM_X = 600;
  Game.DIM_Y = 600;
  Game.FPS = 100;
  Game.BUFFER = 20;
  Game.NUM_SQUARES = 100;
  Game.SQUARE_SCORE = 0;
  Game.SCORE = 0;
  Game.CURSOR_SQUARE = new Squares.CursorSquare({
    pos: [Game.DIM_X * 0.5, Game.DIM_Y * 0.5],
    game: this
  });
  Game.OVER = false;

  Game.prototype.add = function (object) {
    if (object instanceof Squares.Square) {
      this.squares.push(object);
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
    return [].concat(this.squares).concat(Game.CURSOR_SQUARE);
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    // ctx.fillStyle = Game.BG_COLOR;
    // ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    var that = this;

    this.allSquares().forEach(function (square) {
      square.draw(ctx);
    });
    ctx.fillStyle = "grey";
    ctx.font = "20px Arial"
    ctx.fillText("Squares:" + Game.SQUARE_SCORE, (Game.DIM_X / 2) - 15, Game.DIM_Y / 2);
    ctx.fillText("Score:" + Game.SCORE, (Game.DIM_X / 2) - 15, (Game.DIM_Y / 2) + 20);
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < -Game.BUFFER) || (pos[1] < -Game.BUFFER)
      || (pos[0] > Game.DIM_X + Game.BUFFER) || (pos[1] > Game.DIM_Y + Game.BUFFER);
  };

  Game.prototype.randomPosition = function () {
    var rand = Math.random();
    if (rand < 0.25) {
      return [
        Game.DIM_X * Math.random(),
        Game.BUFFER * Math.random() + Game.DIM_Y
      ];
    } else if (rand >= 0.25 && rand < 0.5) {
      return [
        Game.BUFFER * Math.random() + Game.DIM_X,
        Game.DIM_Y * Math.random()
      ];
    } else if (rand >= 0.5 && rand < 0.75) {
      return [
        -Game.BUFFER * Math.random(),
        Game.DIM_Y * Math.random()
      ];
    } else {
      return [
        Game.DIM_Y * Math.random(),
        -Game.BUFFER * Math.random()
      ];
    }
  };

  Game.prototype.getMousePos = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  Game.prototype.checkCollisions = function () {
    var game = this;

    this.allSquares().forEach(function (obj1) {
      var cursorSquare = game.allSquares()[game.allSquares().length - 1];
      if (obj1 == cursorSquare) {
        // don't allow self-collision
        return;
      }

      if (obj1.isCollidedWith(cursorSquare)) {
        if (obj1.color === cursorSquare.color) {
          cursorSquare.grow();
          Game.SQUARE_SCORE += 1;
          Game.SCORE += 10;
          obj1.collideWith(cursorSquare);
        } else {
          Game.OVER = true;
        }
      }
    });

    Game.prototype.endGame = function () {
      return Game.OVER;
    }

    Game.prototype.spawnSquare = function () {
      var rand = Math.random();
      if (rand < .5) {
        return [Game.DIM_X * Math.random(), 0]
      } else {
        return [0, Game.DIM_Y * Math.random()]
      }
    }
  };

  Game.prototype.remove = function (object) {
    if (object instanceof Squares.Square) {
      var idx = this.squares.indexOf(object);
      this.squares[idx] = new Squares.Square({ game: this });
    } else if (object instanceof Squares.CursorSquare) {
      Game.CURSOR_SQUARE.splice(Game.CURSOR_SQUARE.indexOf(object), 1);
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.step = function () {
    this.moveSquares();
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
