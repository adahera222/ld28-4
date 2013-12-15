game.PlayScreen = me.ScreenObject.extend({
	
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {

		me.levelDirector.loadLevel("level1");

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		
		// Hack, cause a leve change doesn't trigger any events that I
	  // know about... :X
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
		me.game.world.removeChild(game.Particles);
		this.Particles = null;
	}
});
