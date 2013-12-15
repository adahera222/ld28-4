game.PlayScreen = me.ScreenObject.extend({
	
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {

		me.levelDirector.loadLevel("level3");

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		
		// Hack, cause a level change doesn't trigger any events that I
	  // know about... :X
	  // NOTE @melon.js devs: That'd be useful, cause many non-persistent
	  // entities need to be re-added to the new level at that point...
	  var self = this;
	  game.resetParticles = function () {
			// Called when the player is added:
			game.ParticleManager = self.Particles = new game.Particles();
			me.game.world.addChild(self.Particles);
		};

		me.game.world.addChild(this.HUD);
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		console.log("DESTROY");
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	}
});
