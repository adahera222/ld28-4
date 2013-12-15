var GameOverText = me.Renderable.extend({
  init: function() {

    this.parent(new me.Vector2d(0, 0), 10, 10); 
    
    var self = this;

    this.border = 8;

    this.text = "GAME OVER";

    this.font = new me.Font("Arial", 20, "white");

    this.floating = true;
  },

  update : function () {
    // Never updates
    return false;
  },

  /**
   * draw the score
   */
  draw : function (ctx) {
    if (! this.visible ) { return; }

    var size = this.font.measureText(ctx, this.text);

    var screen_w = me.game.viewport.getWidth();
    var screen_h = me.game.viewport.getHeight();

    var top = (screen_h - size.height - 2 * this.border) / 2.0;
    var left = (screen_w - size.width - 2 * this.border) / 2.0;

    ctx.fillStyle = "rgba(20,20,20,0.8)";
    ctx.fillRect(
      left,
      top,
      size.width + 2 * this.border,
      size.height + 2 * this.border
    );

    this.font.draw(ctx, this.text, left + this.border, top + this.border);
  }
});

game.GameOverScreen = me.ScreenObject.extend({

  onResetEvent: function() {
    var got = new GameOverText();
    me.game.world.addChild(got);
  },

  onDestroyEvent: function() {
    // Honestly, should never happen. 
    me.game.world.removeChild(got);
  }

});
