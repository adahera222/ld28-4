/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};

// We store all the game strings in here:
var TEXT_THINGS = {};

game.HUD.Container = me.ObjectContainer.extend({

  init: function() {
    // call the constructor
    this.parent();
    
    // persistent across level change
    this.isPersistent = true;
    
    // non collidable
    this.collidable = false;
    
    // make sure our object is always draw first
    this.z = Infinity;

    // give a name
    this.name = "HUD";
    
    var self = this;
    this.addChild(new game.HUD.HealthItem(4, 4));

    // add our child score object at the top left corner
    me.event.subscribe("SHOW_TEXT", function (name) {
      var txt = TEXT_THINGS[name];
      if (!txt) {
        console.log("WARN: Text thing '" + name + "' doesn't exist");
        return;
      }
      self.addChild(txt);
      txt.start();
    });
  }
});

game.HUD.GameNote = me.Renderable.extend({
  init: function(x, y, txt) {
    this.parent(new me.Vector2d(x, y), 10, 10); 
    
    var self = this;

    this.border = 8;

    this.text = txt;

    this.endmsg = "Press [space] to continue...";

    this.font = new me.Font("Arial", 20, "white");
    this.smallfont = new me.Font("Arial", 14, "white");

    this.floating = true;
  },

  start: function () {
    
    game.disableKeys();
    this.skippable = false;
    this.changed = false;
    this.showend = false;
    
    var self = this;

    setTimeout(function () {
      self.showend = true;
      self.changed = true;
      self.skippable = true;
    }, 1500);
  },

  /**
   * update function
   */
  update : function () {
    if (this.visible && this.skippable && me.input.isKeyPressed("space")) {
      this.visible = false;
      game.enableKeys();
      return true;
    }
    if (this.changed) {
      this.changed = false;
      return true;
    }
    return false;
  },

  /**
   * draw the score
   */
  draw : function (ctx) {
    if (! this.visible ) { return; }
    var txt = this.text.join("\n");
    var size = this.font.measureText(ctx, txt);

    ctx.fillStyle = "rgba(20,20,20,0.8)";
    ctx.fillRect(
      this.pos.x - this.border,
      this.pos.y - this.border,
      size.width + 2 * this.border,
      size.height + 20 + 14 + 2 * this.border
    );

    this.font.draw(ctx, txt, this.pos.x, this.pos.y);
    if (this.showend) {
      var y_skip = (this.text.length + 1) * 20;
      this.smallfont.draw(ctx, this.endmsg, this.pos.x, this.pos.y + y_skip);
    }
  }
});

game.HUD.PassiveNote = me.Renderable.extend({
  init: function(x, y, txt, millis) {
    this.parent(new me.Vector2d(x, y), 10, 10); 
    
    var self = this;

    this.border = 8;

    this.text = txt;
    this.millis = millis || 1000;
    this.shown = true;
    this.font = new me.Font("Arial", 14, "white");

    this.floating = false;
  },

  start: function () {
  	var self = this;
  	this.visible = true;
  	setTimeout(function () {
  		self.visible = false;
  	}, this.millis);
  },

  update : function () {
  	if (this.shown && !this.visible) {
  		this.shown = false;
  		return true;
  	}
    return false;
  },

  /**
   * draw the score
   */
  draw : function (ctx) {
    if (! this.visible ) { return; }

    var txt = this.text.join("\n");
    var size = this.font.measureText(ctx, txt);

    ctx.fillStyle = "rgba(20,20,20,0.8)";
    ctx.fillRect(
      this.pos.x - this.border,
      this.pos.y - this.border,
      size.width + 2 * this.border,
      size.height + 2 * this.border
    );

    this.font.draw(ctx, txt, this.pos.x, this.pos.y);
  }
});

/** 
 * a basic HUD item to display score
 */
game.HUD.HealthItem = me.Renderable.extend({  
  init: function(x, y) {
    // call the parent constructor 
    // (size does not matter here)
    this.parent(new me.Vector2d(x, y), 10, 10); 
    
    this.img = me.loader.getImage("hearts");
    
    // local copy of the global score
    this.health = -1;

    // make sure we use screen coordinates
    this.floating = true;
  },

  update : function () {
    if (this.health !== game.data.health) {  
      this.health = game.data.health;
      return true;
    }
    return false;
  },

  drawHeart: function (context, idx, val) {
  	switch(val) {
  		case 2:
  			context.drawImage(
  				this.img, 
  				0, 0, 
  				16, 16, 
  				16 * idx, 0,
  				16, 16
  			);
  			break;

  		case 1:
  			context.drawImage(
  				this.img, 
  				16, 0, 
  				16, 16, 
  				16 * idx, 0,
  				16, 16
  			);
  			break;

  		case 0:
  			context.drawImage(
  				this.img, 
  				32, 0, 
  				16, 16, 
  				16 * idx, 0,
  				16, 16
  			);
  			break;
  	}
  },

  draw : function (context) {
  	this.heath = game.data.health;
  	var h = this.health;
    for (var idx=0; idx<4; idx ++) {
    	var val = h - idx * 2;
    	if (val <= 0) { val = 0; }
    	if (val >= 2) { val = 2; }
    	this.drawHeart(context, idx, val);
    }
  }

});


TEXT_THINGS.intro = new game.HUD.GameNote(96,64, [
  "Greetings,",
  "",
  "I need to meet with you.",
  "I can help with your...",
  "condition...",
  "",
  "I'm on the mountain for",
  "some reason. Go there.",
  "",
  "- Wizard"
]);

var todays_date = moment().format("MMM D, YYYY:");

TEXT_THINGS.health = new game.HUD.GameNote(96,64, [
  todays_date,
  "",
  "I have found that pints",
  "of my immortal blood have",
  "a strong healing effect on",
  "the mortal beasts of this",
  "cave. More experiments",
  "needed...",
  "",
  "- Strange Hermit"
]);

TEXT_THINGS.jump_instruction = new game.HUD.PassiveNote(404, 80, [
	"Press [up] to jump"
], 2000);

TEXT_THINGS.death_caution = new game.HUD.PassiveNote(1232, 270, [
	"Watch out for dangers;",
	"You only have one life."
], 3000);

TEXT_THINGS.magic_instruction = new game.HUD.PassiveNote(200, 1500, [
	"Press [space] to use your water magic"
], 2000);

TEXT_THINGS.enemy_push = new game.HUD.PassiveNote(540, 1160, [
	"You can also push enemies away with",
	"your water stream."
], 3000);

TEXT_THINGS.shock_dude = new game.HUD.PassiveNote(76, 840, [
	"Magic is fun!"
], 1500);

TEXT_THINGS.immortal_asshole_a = new game.HUD.PassiveNote(160, 64, [
	"Oh, hey there, mortal!"
], 1500);

TEXT_THINGS.immortal_asshole_b = new game.HUD.PassiveNote(160, 64, [
	"How are you?"
], 1500);

TEXT_THINGS.immortal_asshole_c = new game.HUD.PassiveNote(160, 64, [
	"You know it's funny..."
], 1500);

TEXT_THINGS.immortal_asshole_d = new game.HUD.PassiveNote(160, 64, [
	"Everyone else in this town has as many lives",
	"as they need..."
], 3500);

TEXT_THINGS.immortal_asshole_e = new game.HUD.PassiveNote(160, 64, [
	"But you..."
], 1500);

TEXT_THINGS.immortal_asshole_f = new game.HUD.PassiveNote(160, 64, [
	"YOU only get one."
], 1500);

TEXT_THINGS.immortal_asshole_last = new game.HUD.PassiveNote(180, 64, [
	"HA ha ha!"
], 1500);

TEXT_THINGS.magic_asshole_a = new game.HUD.PassiveNote(164, 1530, [
	"The people in these parts..."
], 1500);

TEXT_THINGS.magic_asshole_b = new game.HUD.PassiveNote(164, 1530, [
	"They have a mastery of all the elements"
], 1700);

TEXT_THINGS.magic_asshole_c = new game.HUD.PassiveNote(164, 1530, [
	"...of the arcane"
], 1500);

TEXT_THINGS.magic_asshole_d = new game.HUD.PassiveNote(164, 1530, [
	"... and the ..."
], 1500);

TEXT_THINGS.magic_asshole_e = new game.HUD.PassiveNote(164, 1530, [
	"OH!"
], 1500);


TEXT_THINGS.magic_asshole_f = new game.HUD.PassiveNote(164, 1530, [
	"How quaint..."
], 1500);


TEXT_THINGS.magic_asshole_g = new game.HUD.PassiveNote(164, 1530, [
	"It seems you've only mastered one element..."
], 2000);


TEXT_THINGS.magic_asshole_h = new game.HUD.PassiveNote(164, 1530, [
	"LOL!"
], 1500);

TEXT_THINGS.magic_asshole_final = new game.HUD.PassiveNote(96, 1530, [
	"Learned WATER MAGIC!"
], 1500);

TEXT_THINGS.summon_asshole = new game.HUD.PassiveNote(525, 420, [
	"Well, this is awkward..."
], 1500);


TEXT_THINGS.snob_a = new game.HUD.PassiveNote(750, 810, [
	"Not now. Eating."
], 1000);

TEXT_THINGS.snob_b = new game.HUD.PassiveNote(720, 810, [
	"Sorry. No money."
], 1000);

TEXT_THINGS.snob_c = new game.HUD.PassiveNote(687, 810, [
	"Go away"
], 1000);

TEXT_THINGS.snob_d = new game.HUD.PassiveNote(658, 810, [
	"..."
], 1000);

TEXT_THINGS.snob_e = new game.HUD.PassiveNote(592, 810, [
	"Eww. A poor person."
], 1000);

TEXT_THINGS.snob_f = new game.HUD.PassiveNote(557, 810, [
	"Get a job"
], 1000);

TEXT_THINGS.snob_g = new game.HUD.PassiveNote(525, 810, [
	"Om nom nom"
], 1000);

TEXT_THINGS.snob_h = new game.HUD.PassiveNote(498, 810, [
	"Why are you talking to me?"
], 1000);


TEXT_THINGS.confiscate_a = new game.HUD.PassiveNote(220, 720, [
	"Whoa, whoa!"
], 1000);

TEXT_THINGS.confiscate_b = new game.HUD.PassiveNote(220, 720, [
	"Hey, now"
], 1000);

TEXT_THINGS.confiscate_c = new game.HUD.PassiveNote(220, 720, [
	"None of that magic stuff in here!"
], 1500);

TEXT_THINGS.confiscate_d = new game.HUD.PassiveNote(220, 720, [
	"We have all the money in the world..."
], 1500);

TEXT_THINGS.confiscate_e = new game.HUD.PassiveNote(220, 720, [
	"and we aren't too keen on being doused",
	"by magic water"
], 2500);

TEXT_THINGS.confiscate_f = new game.HUD.PassiveNote(220, 720, [
	"BTW: Passage is 2 coins"
], 1500);

TEXT_THINGS.confiscate_g = new game.HUD.PassiveNote(220, 720, [
	"What? You don't have any coins?"
], 1750);

TEXT_THINGS.confiscate_h = new game.HUD.PassiveNote(220, 720, [
	"Well, I have millions of coins..."
], 1750);

TEXT_THINGS.confiscate_i = new game.HUD.PassiveNote(220, 720, [
	"But you can only have... ONE..."
], 2000);

TEXT_THINGS.confiscate_j = new game.HUD.PassiveNote(180, 720, [
	"Received 1 COIN"
], 1500);

TEXT_THINGS.boss_start = new game.HUD.PassiveNote(528, 1480, [
	"Hey! How dare you interupt a perfectly",
	"good food coma!"
], 2500);

TEXT_THINGS.boss_instr = new game.HUD.PassiveNote(528, 1525, [
	"Press [space] here to catapult food"
], 2500);
