var iota = 100;
var SPIKE_OBJECT = iota++;
var TEXT_TRIGGER = iota++;

game.PlayerEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
 
    // set the default horizontal & vertical speed (accel vector)
    this.setVelocity(1.8, 5);
    this.gravity =0.25;
    
    // this.lol = 0;
    this.updateColRect(2, 12, 2, 30);

    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
  },

  update: function() {
 
    if (me.input.isKeyPressed('left')) {
      this.flipX(true);
      this.vel.x -= this.accel.x * me.timer.tick;
    
    } else if (me.input.isKeyPressed('right')) {
      this.flipX(false);
      this.vel.x += this.accel.x * me.timer.tick;
    
    } else {
      this.vel.x = 0;
    }

    if (!this.jumping && !this.falling && me.input.isKeyPressed('jump')) {
      this.vel.y = -this.maxVel.y * me.timer.tick;
      this.jumping = true;
    }

    this.updateMovement();
 
    var collide = me.game.collide(this);
    if (collide) {
      if (collide.obj.type == TEXT_TRIGGER) {
        collide.obj.collidable = false; // Only once;
        game.showText(collide.obj.target);
      }
      if (collide.obj.type == me.game.ENEMY_OBJECT) {
        this.renderable.flicker(40);
        console.log("OUCH, BITCH");
      }
      if (collide.obj.type == SPIKE_OBJECT) {
        this.renderable.flicker(40);
        console.log("FUCKING SPIKES");
      }
      
    }

    if (this.vel.x!=0 || this.vel.y!=0) {
      this.parent();
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
    this.lbound = this.pos.x - 32;
    this.rbound = this.pos.x + 32;

    this.dir = Math.random() < 0.5 ? -1 : 1;
    this.speed = 0.6;

    this.collidable = true;
    this.type = me.game.ENEMY_OBJECT;
  },

  // draw: function (ctx) {
  //   var saved = this.pos.y;
  //   this.pos.y -= 8 * Math.abs(Math.sin(this.lol * 0.08));
  //   this.parent(ctx);
  //   this.pos.y = saved;
  // },
 
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

// Used to apply damage from spikes:
game.SpikeEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
 
    this.collidable = true;
    this.type = SPIKE_OBJECT;
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