(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  var MovingSquare = Squares.MovingSquare = function (options) {
    this.pos = options.pos;
    this.origVel = options.vel;
    this.dir = options.dir;
    this.radius = options.radius;
    this.length = options.length
    this.color = options.color;
    this.game = options.game;
    this.height = options.height;
    this.powerLength = options.powerLength;
    this.invincible = options.invincible;
    this.type = options.type;
  }

  MovingSquare.SPEED_STEP = 0.5;
  MovingSquare.SIZE = 15;

  MovingSquare.prototype.collideWith = function (otherSquare) {
  }

  MovingSquare.prototype.randomVelocity = function () {
    return (Math.random() + MovingSquare.SPEED_STEP * Squares.Game.SPEED_MULTIPLIER);
  }

  MovingSquare.prototype.randomSize = function () {
    return (Math.random() * MovingSquare.SIZE) + MovingSquare.SIZE;
  }

  MovingSquare.prototype.redOrBlack = function () {
    var rand = Math.random();
    var color = "rgba(0, 0, 0, " + Squares.Game.SQUARE_OPACITY + ")";
    if (rand < 0.4) {
      color = "rgba(255, 0, 0, " + Squares.Game.SQUARE_OPACITY + ")";
    }

    return color;
  }

  MovingSquare.prototype.glowGreen = function (ctx) {
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeRect(this.pos[0] -5, this.pos[1]-5, this.length + 10, this.length + 10);
  }

  MovingSquare.prototype.draw = function (ctx) {
    if (this instanceof Squares.PowerUp) {
      ctx.shadowBlur = 0;
      if (this.type === "invincible") {
        this.glowGreen(ctx);
      }
      ctx.fillStyle = this.color;
      ctx.fillRect(this.pos[0], this.pos[1], this.powerLength, this.height);
    } else if (this instanceof Squares.Square){
      ctx.shadowBlur = 0;
      ctx.fillStyle = this.color;
      ctx.fillRect(this.pos[0], this.pos[1], this.length, this.length);
    } else if (this instanceof Squares.CursorSquare) {
      if (this.invincible) {
        this.glowGreen(ctx);
      }
      ctx.fillStyle = this.color;
      ctx.fillRect(this.pos[0], this.pos[1], this.length, this.length);
    }
  };

  MovingSquare.prototype.drawCircle = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], Math.random() * 5 + this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
  };

  MovingSquare.prototype.isCollidedWith = function (otherSquare) {
    if (this instanceof Squares.Square) {
      var collided = Squares.Util.checkCollision(this, otherSquare)
    } else {
      var collided = Squares.Util.checkCircleCollision(this, otherSquare)
    }

    return collided;
  };

  MovingSquare.prototype.move = function () {
    if (this instanceof Squares.Square || this instanceof Squares.Circle) {
      this.pos = [this.pos[0] + this.dir[0], this.pos[1] + this.dir[1]];
      if (this.game.isOutOfBounds(this.pos)) {
        this.remove();
      }
    } else if (this instanceof Squares.PowerUp) {
      var cursor = Squares.Game.CURSOR_SQUARE;
      this.powerLength -= 1;
      if (this.type === "invincible") {
        cursor.invincible = true;
      }
      if (this.powerLength < 0) {
        if (this.type === "invincible") {
          cursor.invincible = false;
        } else if (this.type === "slowmo") {
          Squares.Game.SPEED_MULTIPLIER = 4;
          this.game.setGlobalSpeed();
          Squares.Game.SPEED_MULTIPLIER = 1;
        }
        this.remove();
      }
    }
  };

  MovingSquare.prototype.remove = function () {
    this.game.remove(this);
  };

  MovingSquare.prototype.randomDir = function (vel) {
    var newDir = [0, 0];
    var rand = Math.random();
    if (rand < .25) {
      newDir = [-1 * vel, 0]
    } else if (rand >= .25 && rand < .5) {
      newDir = [vel, 0]
    } else if (rand >= .5 && rand < .75) {
      newDir = [0, vel * -1]
    } else if (rand >= .75) {
      newDir = [0, vel]
    }

    return newDir;
  }

})();
