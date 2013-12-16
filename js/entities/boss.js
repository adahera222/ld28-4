
game.BossEntity = me.ObjectEntity.extend({

  throwAtPlayer: function () {
    var width2 = this.width / 2;
    var center_x = this.pos.x + width2 + this.side * width2 * 0.8;
    var center_y = this.pos.y + this.height / 2;
    
    this.side *= -1;
    var x_dist = game.player_x - center_x;
    
    var new_one = new game.BoneParticle(
      center_x,
      center_y,
      {}
    );
    
    new_one.vel.x = 0.02 * x_dist;
    new_one.vel.y = -4 + Math.random();
    
    game.ParticleManager.addParticle(new_one);
  },

  hurt: function () {
    if (this.health <= 0) { return; }
    this.rate -= 45;
    this.health --;
    if (this.health <= 0) {
      this.die();
    }
    this.renderable.flicker(30);
  },

  die: function () {

    var center_x = this.pos.x + this.width / 2;
    var center_y = this.pos.y + this.height / 2;

    for (var i=0; i<32; i++) {
      var new_one = new game.GibParticle(
        center_x + Math.random() * this.width - this.width / 2,
        center_y + Math.random() * this.height - this.height / 2,
        {}
      );
    
      new_one.vel.x = 4 * Math.random() - 2;
      new_one.vel.y = -4 + Math.random() + 1;
      
      game.ParticleManager.addParticle(new_one);
    }

    this.visible = false;
    me.event.publish("UNLOCK:boss");
  },

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);

    this.side = -1;
    
    this.gravity = 0;
    this.awake = false;
    this.rate = 1000;
    this.health = 16;
    this.lastthrow = 0;

    var self = this;
    me.event.subscribe("WAKE:boss", function () {
      if (self.awake) { return; }
      game.showText("boss_start");
      self.awake = true;
      self.lastthrow = me.timer.getTime() + 2000;
      setTimeout(function () {
        game.showText("boss_instr");
      }, 2500);
    });
  },
 
  update: function() {
    if (!this.awake && this.visible) { return false; }
    
    var now = me.timer.getTime();
    if (now - this.lastthrow >= this.rate) {
      this.throwAtPlayer();
      this.lastthrow = now;
    }

    var collide = me.game.collideType(this, game.PASTRY);
    if (collide) {
      collide.obj.removeParticle();
      collide.obj.collidable = false;
      this.hurt();
    }
    this.parent();
    return true;
  }
});

game.BoneParticle = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    
    this.parent(x, y, settings);
    
    this.renderable = new me.AnimationSheet(0, 0, me.loader.getImage("bone"), 16, 16, 0, 0);
    
    this.collidable = true;
    this.type = game.BONE;
    this.hurtpoints = 1;

    this.gravity = 0.25;
    this.destroyed = false;
  },
  update: function () {

    // Shortcut for de-registering this particle:
    var self = this;
    function destroy() {
      if (self.destroyed) { return; }
      
      self.destroyed = true;

      self.renderable.flicker(1000);
      setTimeout(function () {
        self.visible = false;
        self.collidable = false;
        self.removeParticle();
      }, 500);
    }

    // Expected position. Will differ if collision with ground:
    // NOTE: @melon.js dude: please add a way to detect collision with collision tiles directly:
    var x = this.pos.x + this.vel.x, y = this.pos.y + this.vel.y + this.gravity;
    this.updateMovement();
    if (diff(x, this.pos.x) || diff(y, this.pos.y)) {
      destroy();
      return true;
    }

    this.parent();
    return true;
  }
});

game.PastryParticle = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    
    this.parent(x, y, settings);
    
    this.renderable = new me.AnimationSheet(0, 0, me.loader.getImage("pastry"), 16, 16, 0, 0);
    
    this.collidable = true;
    this.type = game.PASTRY;

    this.gravity = 0.25;
    this.destroyed = false;
  },
  update: function () {

    // Shortcut for de-registering this particle:
    var self = this;
    function destroy() {
      if (self.destroyed) { return; }
      
      self.destroyed = true;

      self.renderable.flicker(1000);
      setTimeout(function () {
        self.visible = false;
        self.collidable = false;
        self.removeParticle();
      }, 500);
    }

    // Expected position. Will differ if collision with ground:
    // NOTE: @melon.js dude: please add a way to detect collision with collision tiles directly:
    var x = this.pos.x + this.vel.x, y = this.pos.y + this.vel.y + this.gravity;
    this.updateMovement();
    if (diff(x, this.pos.x) || diff(y, this.pos.y)) {
      destroy();
      return true;
    }

    this.parent();
    return true;
  }
});

game.GibParticle = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    
    this.parent(x, y, settings);
    
    this.renderable = new me.AnimationSheet(0, 0, me.loader.getImage("gib"), 16, 16, 0, 0);
    
    this.gravity = 0.25;
    this.destroyed = false;
  },
  update: function () {

    // Shortcut for de-registering this particle:
    var self = this;
    function destroy() {
      if (self.destroyed) { return; }
      
      self.destroyed = true;

      self.renderable.flicker(1000);
      setTimeout(function () {
        self.visible = false;
        self.collidable = false;
        self.removeParticle();
      }, 500);
    }

    // Expected position. Will differ if collision with ground:
    // NOTE: @melon.js dude: please add a way to detect collision with collision tiles directly:
    var x = this.pos.x + this.vel.x, y = this.pos.y + this.vel.y + this.gravity;
    this.updateMovement();
    if (diff(x, this.pos.x) || diff(y, this.pos.y)) {
      destroy();
      return true;
    }

    this.parent();
    return true;
  }
});
