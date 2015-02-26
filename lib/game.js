(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  function moveCursorSquare () {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext('2d');

    var cs = Game.CURSOR_SQUARE;
    cs.draw(context)
    canvas.addEventListener('mousemove', function(evt) {
      var mousePos = Game.prototype.getMousePos(canvas, evt);
      cs.pos = [mousePos.x, mousePos.y]
      cs.draw(context)
    }, false);
  }

  var Game = Squares.Game = function (ctx) {
    this.ctx = ctx;
    this.squares = [];
    this.circles = [];
    this.dimX = Game.DIM_X;
    this.dimY = Game.DIM_Y;
    this.score = 0;
    this.squareScore = 0;
    var that = this;
    setInterval( function () {
      that.score += 1;
    }, 1000);
    this.addSquares();
    moveCursorSquare();
  };

  Game.BG_COLOR = "#EAE3E3";
  Game.DIM_X = 600;
  Game.DIM_Y = 600;
  Game.FPS = 50;
  Game.BUFFER = 20;
  Game.NUM_SQUARES = 50;
  Game.CIRCLE_PROB = .02;
  Game.CURSOR_SQUARE = new Squares.CursorSquare({
    pos: [Game.DIM_X * 0.5, Game.DIM_Y * 0.5],
    game: this
  });
  Game.OVER = false;

  Game.prototype.add = function (object) {
    if (object instanceof Squares.Square) {
      this.squares.push(object);
    } else if (object instanceof Squares.Circle){
      this.circles.push(object)
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.powerUp = function () {
    this.ctx.fillStyle = "grey";
    this.ctx.fillRect(200, 100, 300, 20);
  }

  Game.prototype.addSquares = function (numSquares) {
    for (var i = 0; i < Game.NUM_SQUARES; i++) {
      var rand = Math.random();
      if (rand > Game.CIRCLE_PROB) {
        // this.add(new Squares.Circle({ game: this }));
        this.add(new Squares.Square({ game: this }));
      } else {
        this.add(new Squares.Circle({ game: this }));
      }
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
    return [].concat(this.squares).concat(this.circles).concat(Game.CURSOR_SQUARE);
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allSquares().forEach(function (square) {
      if (square instanceof Squares.Circle) {
        square.drawCircle(ctx);
      } else {
        square.draw(ctx);
      }
    });
    this.renderScore(ctx);
  };

  Game.prototype.renderScore = function (ctx) {
    ctx.fillStyle = "grey";
    ctx.font = "20px Arial"
    ctx.fillText("Squares:" + this.squareScore, (Game.DIM_X / 2) - 60, Game.DIM_Y / 2);
    ctx.fillText("Score:" + this.score, (Game.DIM_X / 2) - 60, (Game.DIM_Y / 2) + 20);
  }

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < -Game.BUFFER) || (pos[1] < -Game.BUFFER)
      || (pos[0] > Game.DIM_X + Game.BUFFER) || (pos[1] > Game.DIM_Y + Game.BUFFER);
  };

  Game.prototype.randomPosition = function () {
    var rand = Math.random();
    if (rand < 0.25) {
      return [
        Game.DIM_X * Math.random(),
        (Game.BUFFER / 2) * Math.random() + (Game.BUFFER / 2) + Game.DIM_Y
      ];
    } else if (rand >= 0.25 && rand < 0.5) {
      return [
        (Game.BUFFER / 2) * Math.random() + (Game.BUFFER / 2) + Game.DIM_X,
        Game.DIM_Y * Math.random()
      ];
    } else if (rand >= 0.5 && rand < 0.75) {
      return [
        -(Game.BUFFER / 2) * Math.random() - (Game.BUFFER / 2),
        Game.DIM_Y * Math.random()
      ];
    } else {
      return [
        Game.DIM_Y * Math.random(),
        -(Game.BUFFER / 2) * Math.random() - (Game.BUFFER / 2)
      ];
    }
  };

  Game.prototype.getMousePos = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };

  Game.prototype.stepSpeed = function () {
    return this.squareScore % 10 === 0;
  };

  Game.prototype.checkCollisions = function () {
    var game = this;

    this.allSquares().forEach(function (obj1) {
      var cursorSquare = game.allSquares()[game.allSquares().length - 1];
      if (obj1 == cursorSquare) {
        // don't allow self-collision
        return;
      }

      if (obj1.isCollidedWith(cursorSquare)) {
        if (obj1.color === "rgba(0, 0, 0, 0.5)") {
          cursorSquare.grow();
          game.squareScore += 1;
          game.score += 10;
          obj1.collideWith(cursorSquare);
        } else {
          cursorSquare.length = 0;
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
        return [Game.DIM_X * Math.random(), -10]
      } else {
        return [0, Game.DIM_Y * Math.random()]
      }
    }
  };

  Game.prototype.remove = function (object) {
    var rand = Math.random();
    if (object instanceof Squares.Square) {
      var idx = this.squares.indexOf(object);
      if (rand > Game.CIRCLE_PROB) {
        this.squares[idx] = new Squares.Square({ game: this });
      } else {
        this.squares.splice(idx, 1);
        this.circles.push(new Squares.Circle({ game: this }));
      }
    } else if (object instanceof Squares.CursorSquare) {
      Game.CURSOR_SQUARE.splice(Game.CURSOR_SQUARE.indexOf(object), 1);
    } else if (object instanceof Squares.Circle) {
      var idx = this.circles.indexOf(object);
      if (rand > Game.CIRCLE_PROB) {
        this.circles.splice(idx, 1);
        this.squares.push(new Squares.Square({ game: this }));
      } else {
        this.circles[idx] = new Squares.Circle({ game: this });
      }
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
