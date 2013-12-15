game.Particles = me.ObjectContainer.extend({
  
  addParticle: function (item) {
    this.addChild(item);
    var self = this;
    item.removeParticle = function () {
      self.removeChild(item);
    };
  },
  
  init: function() {
    // call the constructor
    this.parent();
    var self = this;
    this.z = 1000;

    // persistent across level change
    this.isPersistent = false;

    // give a name
    this.name = "Particlez";
  },

  update: function () {
    return this.parent();
  }
});
