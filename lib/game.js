(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  function moveCursorSquare () {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext('2d');

    var cs = Game.CURSOR_SQUARE;
    var offset = cs.length / 2;
    cs.draw(context)
    canvas.addEventListener('mousemove', function(evt) {
      var mousePos = Game.prototype.getMousePos(canvas, evt);
      // cs.pos = [mousePos.x, mousePos.y]
      cs.pos = [mousePos.x - offset, mousePos.y - offset];
      cs.draw(context);
    }, false);
  }

  var Game = Squares.Game = function (ctx) {
    this.ctx = ctx;
    this.squares = [];
    this.circles = [];
    this.powerUps = [];
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

  Game.SPEED_MULTIPLIER = 1;
  Game.BG_COLOR = "#EAE3E3";
  Game.DIM_X = 600;
  Game.DIM_Y = 600;
  Game.FPS = 100;
  Game.BUFFER = 20;
  Game.NUM_SQUARES = 50;
  Game.CIRCLE_PROB = .2;
  Game.CURSOR_SQUARE = new Squares.CursorSquare({
    pos: [Game.DIM_X * 0.5, Game.DIM_Y * 0.5],
    game: this
  });
  Game.OVER = false;

  Game.prototype.add = function (object) {
    if (object instanceof Squares.Square) {
      this.squares.push(object);
    } else if (object instanceof Squares.Circle) {
      this.circles.push(object)
    } else if (object instanceof Squares.PowerUp) {
      this.powerUps.push(object)
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.addSquares = function (numSquares) {
    for (var i = 0; i < Game.NUM_SQUARES; i++) {
      var rand = Math.random();
      if (rand > Game.CIRCLE_PROB) {
        this.add(new Squares.Square({ game: this }));
      } else {
        this.add(new Squares.Circle({ game: this }));
      }
    }
  };

  Game.prototype.setGlobalSpeed = function () {
    this.allSquares().forEach(function (square) {
      if (square instanceof Squares.Square || square instanceof Squares.Circle) {
        square.dir[0] *= Squares.Game.SPEED_MULTIPLIER;
        square.dir[1] *= Squares.Game.SPEED_MULTIPLIER;
      }
    })
  }

  Game.prototype.checkPowerUps = function (type) {
    var powerUpExists = false;
    this.powerUps.forEach(function (square) {
      if (square.type === type) {
        powerUpExists = true;
      }
    });

    return powerUpExists;
  }

  Game.prototype.fetchPowerUp = function (type) {
    var powerUp;
    this.powerUps.forEach(function (square) {
      if (square.type === type) {
        powerUp = square;
      }
    });

    return powerUp;
  }

  Game.prototype.addPowerUp = function () {
    var powerUp = new Squares.PowerUp({ game: this });
    if (powerUp.type === "shrink") {
      if (Game.CURSOR_SQUARE.length > 10) {
        Game.CURSOR_SQUARE.length /= 2;
      }
    } else {
      if (powerUp.type === "slowmo" && !this.checkPowerUps(powerUp.type)) {
        this.add(powerUp);
        Squares.Game.SPEED_MULTIPLIER = 0.25;
        this.setGlobalSpeed();
      } else if (powerUp.type === "invincible" && !this.checkPowerUps(powerUp.type)) {
        this.add(powerUp);
      } else {
        var fetched = this.fetchPowerUp(powerUp.type)
        fetched.powerLength = 400;
      }
    }

    return powerUp;
  }

  Game.prototype.addCursorSquare = function () {
    var cursorSquare = new Squares.CursorSquare({
      pos: [Game.DIM_X * 0.5, Game.DIM_Y * 0.5],
      game: this
    });

    this.add(cursorSquare);
    return cursorSquare;
  };

  Game.prototype.allSquares = function () {
    return [].concat(this.powerUps).concat(this.squares).concat(this.circles).concat(Game.CURSOR_SQUARE);
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.renderScore(ctx);
    this.allSquares().forEach(function (square) {
      if (square instanceof Squares.Circle) {
        square.drawCircle(ctx);
      } else {
        square.draw(ctx);
      }
    });
  };

  Game.prototype.renderScore = function (ctx) {
    ctx.shadowBlur = 0;
    ctx.fillStyle = "grey";
    ctx.font = "40px Arial"
    ctx.fillText(this.score, (Game.DIM_X / 2) - Game.DIM_X / 18, (Game.DIM_Y / 2) + 20);
    ctx.font = "20px Arial"
    ctx.fillText(this.squareScore, (Game.DIM_X / 2) - Game.DIM_X / 50, Game.DIM_Y / 2 + Game.DIM_Y / 3.5);
    ctx.fillText("Squares", (Game.DIM_X / 2) - Game.DIM_X / 15, Game.DIM_Y / 2 + Game.DIM_Y / 3);
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
      var cursorSquare = Squares.Game.CURSOR_SQUARE;
      if (obj1 == cursorSquare) {
        return; // don't allow self-collision
      }

      if (obj1.isCollidedWith(cursorSquare)) {
        if (obj1.color === "rgba(0, 0, 0, 0.5)" && obj1 instanceof Squares.Square) {
          cursorSquare.grow();
          game.squareScore += 1;
          game.score += 10;
          obj1.collideWith(cursorSquare);
        } else if (obj1 instanceof Squares.Circle) {
          game.addPowerUp();
          obj1.collideWith(cursorSquare)
        } else if (!cursorSquare.invincible) {
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
    } else if (object instanceof Squares.PowerUp) {
      this.powerUps.splice(this.powerUps.indexOf(object), 1);
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
