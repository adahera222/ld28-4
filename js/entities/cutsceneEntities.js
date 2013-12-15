game.ImmortalAssholeEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
    
    this.timed_strings = [
      ["immortal_asshole_a", 1750],
      ["immortal_asshole_b", 1750],
      ["immortal_asshole_c", 1750],
      ["immortal_asshole_d", 3750],
      ["immortal_asshole_e", 1750],
      ["immortal_asshole_f", 1750],
    ];

    this.updateColRect(0, 16, -32, 64);
    this.gravity = 0.25;

    this.collidable = true;
    this.type = game.CUTSCENE;

    this.started = false;
    this.frame = 0;
    this.runAway = false;
  },

  startScene: function (player) {
    if (this.started) { return; }
    this.started = true;

    game.disableKeys();
    player.vel.x = 0;

    // Yay, async recursion! :D
    var self = this;
    function nextString() {
      if (!self.timed_strings.length) {
        setTimeout(doDamage, 500);
        return;
      }
      var data = self.timed_strings.shift();
      game.showText(data[0]);
      setTimeout(nextString, data[1]);
    }

    function doDamage() {
      player.hurt(1);
      player.vel.x -= 3;
      player.vel.y -= 3;
      self.frame = 1;
      setTimeout(runAway, 200);
    }

    function runAway() {
      game.showText("immortal_asshole_last");
      self.runAway = true;
      self.frame = 0;
      setTimeout(destroy, 2000);
    }

    function destroy() {
      self.collidable = false;
      self.visible = false;
      game.enableKeys();
    }

    nextString();
  },
  
  update: function() {
    if (!this.started || !this.visible) { return false; }

    this.renderable.setAnimationFrame(this.frame);

    if (this.runAway) {
      this.vel.x = 4.1;
      this.updateMovement();
    }

    return true;
  }
});

game.MagicAssholeEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
    
    this.timed_strings = [
      ["magic_asshole_a", 1750],
      ["magic_asshole_b", 2000],
      ["magic_asshole_c", 1750],
      ["magic_asshole_d", 2400],
      ["magic_asshole_e", 1750],
      ["magic_asshole_f", 1750],
      ["magic_asshole_g", 2250],
      ["magic_asshole_h", 1750],
    ];

    this.updateColRect(0, 16, -32, 64);
    this.gravity = 0.25;

    this.collidable = true;
    this.type = game.CUTSCENE;

    this.started = false;
  },

  startScene: function (player) {
    if (this.started) { return; }
    this.started = true;

    game.disableKeys();
    player.vel.x = 0;

    // Yay, async recursion! :D
    var self = this;
    function nextString() {
      if (!self.timed_strings.length) {
        setTimeout(destroy, 500);
        return;
      }
      var data = self.timed_strings.shift();
      game.showText(data[0]);
      setTimeout(nextString, data[1]);
    }

    function destroy() {
      player.giveWater();
      game.showText("magic_asshole_final");
      self.collidable = false;
      //self.visible = false;
      game.enableKeys();
    }

    nextString();
  },
  
  update: function() {
    if (!this.started || !this.collidable) { return false; }

    return true;
  }
});

game.SummonAssholeEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
    
    this.updateColRect(0, 16, -32, 64);
    this.gravity = 0.25;

    this.collidable = true;
    this.type = game.CUTSCENE;

    this.started = false;
  },

  startScene: function (player) {
    if (this.started) { return; }
    this.started = true;

    game.showText("summon_asshole");
    this.collidable = false;
  },
  
  update: function() {
    if (!this.started || !this.collidable) { return false; }

    return true;
  }
});

game.FatAssholeEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
    this.txt = settings.snobtext;
    this.collidable = true;
    this.type = CUTSCENE;
    this.target = settings.target;
  },

  startScene: function (player) {
    if (this.started) { return; }
    this.started = true;

    game.showText(this.txt);
    this.collidable = false;
  },
  
  update: function() {
    if (!this.started || !this.collidable) { return false; }

    return true;
  }
});

// Used to trigger notes and the such:
game.TriggerSummonEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
 
    this.collidable = true;
    this.type = CUTSCENE;
    this.target = settings.target;
  },

  startScene: function (player) {
    if (this.started) { return; }
    this.started = true;
    var count = 15;

    function summon() {
      if (--count < 0) { return; }
      var new_one = new game.SpiderParticle(
        450 + Math.random() * 205,
        500,
        {}
      );
      game.ParticleManager.addParticle(new_one);
      setTimeout(summon, 750);
    }
    this.collidable = false;
    summon();
  },
  
  update: function() {
    if (!this.started || !this.collidable) { return false; }

    return true;
  }
});