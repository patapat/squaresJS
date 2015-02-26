(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  setInterval(function () {
    MovingSquare.SPEED_STEP += .2;
    console.log(MovingSquare.SPEED_STEP);
  }, 5000);

  var MovingSquare = Squares.MovingSquare = function (options) {
    this.pos = options.pos;
    this.origVel = options.vel;
    this.dir = options.dir;
    this.radius = options.radius;
    this.length = options.length
    this.color = options.color;
    this.game = options.game;
    this.invincible = options.invincible;
  }

  MovingSquare.SPEED_STEP = 0.5;
  MovingSquare.SIZE = 15;

  MovingSquare.prototype.collideWith = function (otherSquare) {
  }

  MovingSquare.prototype.randomVelocity = function () {
    return (Math.random() + MovingSquare.SPEED_STEP);
  }

  MovingSquare.prototype.randomSize = function () {
    return (Math.random() * MovingSquare.SIZE) + MovingSquare.SIZE;
  }

  MovingSquare.prototype.redOrBlack = function () {
    var rand = Math.random();
    var color = "rgba(0, 0, 0, 0.5)";
    if (rand < 0.4) {
      color = "rgba(255, 0, 0, 0.5)";
    }

    return color;
  }
  MovingSquare.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos[0], this.pos[1], this.length, this.length);
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
