(function () {
  if (typeof Squares === "undefined") {
    window.Squares = {};
  }

  var MovingSquare = Squares.MovingSquare = function (options) {
    this.pos = options.pos;
    this.origVel = options.vel;
    this.dir = options.dir;
    // this.vel = [options.vel, options.vel];
    this.length = options.length
    this.color = options.color;
    this.game = options.game;
  }

  MovingSquare.prototype.collideWith = function (otherSquare) {
  }

  MovingSquare.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos[0], this.pos[1], this.length, this.length);
  };

  MovingSquare.prototype.isCollidedWith = function (otherSquare) {
    var collided = Squares.Util.checkCollision(this, otherSquare)
    if (collided) {
      console.log("collided");
    }
    // console.log(collided);
    return collided;
  };

  MovingSquare.prototype.isWrappable = true;

  MovingSquare.prototype.move = function () {
    if (this instanceof Squares.Square) {
      this.pos = [this.pos[0] + this.dir[0], this.pos[1] + this.dir[1]];
      if (this.game.isOutOfBounds(this.pos)) {
        if (this.isWrappable) {
          this.pos = this.game.wrap(this.pos);
        } else {
          this.remove();
        }
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
