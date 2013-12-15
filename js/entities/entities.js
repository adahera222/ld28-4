var iota = 100;
var SPIKE_OBJECT = iota++;
var TEXT_TRIGGER = iota++;
var BAT_WAKER    = iota++;
var FIRE         = iota++;

// Based on level, different things happen when you press [space]:
function onSpaceCastWater() {
  var now = me.timer.getTime();
  if (this.nextSpace > now) { return; }
  this.nextSpace = now + 45 + Math.random() * 20;
  var new_one = new game.WaterParticle(
    this.pos.x + (this.dir < 0 ? 0 : 16),
    this.pos.y + 16,
    {dir: this.dir});
  game.ParticleManager.addParticle(new_one);
}

game.PlayerEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
    
    this.didMakeParticles = false;

    this.nextSpace = 0;
    this.spaceAction = onSpaceCastWater; //null;
    this.dir = 1;

    // set the default horizontal & vertical speed (accel vector)
    this.setVelocity(1.8, 5.2);
    this.gravity =0.25;

    // this.lol = 0;
    this.updateColRect(2, 12, 3, 29);

    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
  },

  update: function() {
    
    if (!this.didMakeParticles) {
      this.didMakeParticles = true;
      // HAAAACK. HAAAAAAACK!
      game.resetParticles();
    }

    // Lateral movement:
    if (me.input.isKeyPressed('left')) {
      this.flipX(true);
      this.dir = -1;
      this.vel.x -= this.accel.x * me.timer.tick;
    
    } else if (me.input.isKeyPressed('right')) {
      this.flipX(false);
      this.dir = 1;
      this.vel.x += this.accel.x * me.timer.tick;
    
    } else {
      this.vel.x = 0;
    }

    // Jumping:
    if (!this.jumping && !this.falling && me.input.isKeyPressed('jump')) {
      this.vel.y = -this.maxVel.y * me.timer.tick;
      this.jumping = true;
    }

    // Sword / Magic / whatever:
    if (game.keysEnabled && this.spaceAction && me.input.isKeyPressed('space')) {
      this.spaceAction();
    }

    this.updateMovement();
 
    var collide = me.game.collide(this);
    if (collide) {
      if (collide.obj.type == TEXT_TRIGGER) {
        collide.obj.collidable = false; // Only once;
        game.showText(collide.obj.target);
      }
      if (collide.obj.type == BAT_WAKER) {
        me.event.publish("BAT_WAKE:" + collide.obj.target, []);
      }
      if (collide.obj.type == me.game.ENEMY_OBJECT) {
        this.renderable.flicker(40);
        console.log("OUCH, BITCH");
      }
      if (collide.obj.type == SPIKE_OBJECT) {
        this.renderable.flicker(40);
        console.log("FUCKING SPIKES");
      }
      if (collide.obj.type == FIRE) {
        this.renderable.flicker(40);
        console.log("OW FIRE");
      }
      
    }

    this.parent();
    game.updatePlayerPos(this);
    
    if (this.vel.x!=0 || this.vel.y!=0) {
      return true;
    }

    return false;
  }
});

game.SlugEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
 
    this.updateColRect(0, 32, 4, 12);
    this.range = settings.range || 32;
    this.lbound = this.pos.x - this.range;
    this.rbound = this.pos.x + this.range;

    this.dir = Math.random() < 0.5 ? -1 : 1;
    this.speed = 0.6;

    this.collidable = true;
    this.type = me.game.ENEMY_OBJECT;
    this.hurtpoints = 2;
  },
 
  update: function() {
    
    this.flipX(this.dir == -1);
    this.vel.x = this.dir * me.timer.tick * this.speed;

    this.updateMovement();
    if (this.pos.x <= this.lbound) {
      this.dir = 1;
    }

    if (this.pos.x >= this.rbound) {
      this.dir = -1;
    }

    this.parent();
    return true;
  }
});
                                
game.BatEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
 
    this.updateColRect(2, 12, 2, 12);
    
    this.speed = 1;
    this.gravity = 0;
    this.awake = false;

    this.collidable = true;
    this.type = me.game.ENEMY_OBJECT;
    this.hurtpoints = 1;
    this.falling = settings.falldist;

    var self = this;

    this.flyanim = new me.AnimationSheet(0, 0, me.loader.getImage("batfly"), 16, 16, 0, 0);

    me.event.subscribe("BAT_WAKE:" + settings.batid, function () {
      self.renderable = self.flyanim;
      self.awake = true;
    });
  },
 
  update: function() {
    if (!this.awake) { return false; }
    
    if (this.falling > 0) {
      
      this.vel.x = 0;
      this.vel.y += 0.2 * me.timer.tick;

      this.falling -= this.vel.y;

      this.updateMovement();
      
      return true;
    }

    var vel = me.timer.tick * this.speed;

    // Get a quick direction:
    this.vel.x = vel * (this.pos.x < game.player_x ? 1 : -1);
    this.vel.y = vel * (this.pos.y < game.player_y ? 1 : -1);

    // Make the direction zero if close:
    if (Math.abs(this.pos.x - game.player_x) < 4) { this.vel.x = 0; }
    if (Math.abs(this.pos.y - game.player_y) < 4) { this.vel.y = 0; }
    
    // Occasionally fuck with the y vel to make it more 'bat' like:
    if (Math.random() < 0.15) { this.vel.y = Math.random() * 6 - 3; }

    this.flipX(this.vel.x > 0);
    
    this.updateMovement();
    
    this.parent();
    return true;
  }
});

game.SpiderEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
 
    this.updateColRect(4, 24, 6, 10);
    
    this.speed = 1;
    this.gravity = 0.25;
    
    this.collidable = true;
    this.type = me.game.ENEMY_OBJECT;
    this.hurtpoints = 1;
  },
 
  update: function() {
    // if (!this.awake) { return false; }
    
    if (!this.jumping && !this.falling) {
      // On ground. JUMP!
      var dir = (this.pos.x < game.player_x) ? 1 : -1;
      var amount = (Math.abs(this.pos.x - game.player_x) > 64) ? 2.5 : 1.2;
      this.vel.x = dir * amount * me.timer.tick;
      this.vel.y = -5.0;
      this.jumping = true;
    }
    this.vel.y = Math.min(this.vel.y, 5.0);
    this.flipX((this.pos.x - game.player_x) < 0);
    
    this.updateMovement();
    
    this.parent();
    return true;
  }
});

// Used to apply damage from spikes:
game.SpikeEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
 
    this.collidable = true;
    this.type = SPIKE_OBJECT;
    this.hurtpoints = 2;
  }
});

game.FireEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
    this.lastFrame = 0;
    this.collidable = true;
    this.type = FIRE;
    this.hurtpoints = 2;
    this.health = 20;
  },
  update: function () {
    var now = me.timer.getTime();
    if (now - this.lastFrame > 50) {
      this.lastFrame = now;
      this.renderable.setAnimationFrame(Math.floor(Math.random() * 4));
    }
    return true;
  }
});

game.SparkEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
    this.lastFrame = 0;
  },
  update: function () {
    var now = me.timer.getTime();
    if (now - this.lastFrame > 50) {
      this.lastFrame = now;
      var diff = Math.random() < 0.5 ? -1 : 1;
      var new_idx = (this.renderable.getCurrentAnimationFrame() + diff) % 3;
      if (new_idx < 0) { new_idx += 3; }
      console.log(new_idx);
      this.renderable.setAnimationFrame(new_idx);
    }
    return true;
  }
});

// Used to trigger notes and the such:
game.TextTriggerEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
 
    this.collidable = true;
    this.type = TEXT_TRIGGER;
    this.target = settings.target;
  }
});

game.BatWakerEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    this.parent(x, y, settings);
 
    this.collidable = true;
    this.type = BAT_WAKER;
    this.target = settings.batid;
  }
});

function diff(a, b) {
  return Math.abs(a - b) > 0.000001;
}

var cachedAsset = null;
game.WaterParticle = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    if (cachedAsset == null) {
      cachedAsset = new me.AnimationSheet(0, 0, me.loader.getImage("waterpart"), 16, 16, 0, 0);
    }

    // call the constructor
    this.parent(x, y, settings);
    
    this.renderable = cachedAsset;

    this.gravity = 0.25;

    this.vel.x = settings.dir * me.timer.tick * (2.5 + Math.random() * 2.5);
    this.vel.y = me.timer.tick * (-3.2 + Math.random() * 1.0);
  },
  update: function () {

    // Shortcut for de-registering this particle:
    var self = this;
    function destroy() {
      self.visible = false;
      self.collidable = false;
      self.removeParticle();
    }

    // Expected position. Will differ if collision with ground:
    // NOTE: @melon.js dude: please add a way to detect collision with collision tiles directly:
    var x = this.pos.x + this.vel.x, y = this.pos.y + this.vel.y + this.gravity;
    this.updateMovement();
    if (diff(x, this.pos.x) || diff(y, this.pos.y)) {
      destroy();
      return false;
    }

    // Check for useful collisions:
    var collide = me.game.collide(this);
    if (collide) {
      if (collide.obj.type == FIRE) {
        collide.obj.health -= 1;
        if (collide.obj.health <= 0) {
          collide.obj.collidable = false;
          collide.obj.visible = false;
          // TODO: Steam.
          destroy();
          return false;
        }
      }
      if (collide.obj.type == me.game.ENEMY_OBJECT) {
        collide.obj.vel.x += 0.2 * this.vel.x;
      }
    }
    this.parent();
    return true;
  }
});
