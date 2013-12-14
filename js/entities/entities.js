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

    // draw: function (ctx) {
    //   var saved = this.pos.y;
    //   this.pos.y -= 8 * Math.abs(Math.sin(this.lol * 0.08));
    //   this.parent(ctx);
    //   this.pos.y = saved;
    // },
 
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
 
        if (this.vel.x!=0 || this.vel.y!=0) {
            // this.lol += me.timer.tick;
            this.parent();
            return true;
        }
        // if (this.lol) {
        //   var start = this.lol;
        //   this.lol += me.timer.tick;
        //   console.log(Math.floor(start* 0.08 / (3.1415926535)), Math.floor(this.lol* 0.08 / (3.1415926535)))
        //   if (Math.floor(start* 0.08 / (3.1415926535)) != Math.floor(this.lol* 0.08 / (3.1415926535))) {
        //     this.lol = 0;
        //     return false;
        //   }
        //   return true;
        // }
        return false;
    }
});