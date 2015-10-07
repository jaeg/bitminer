/*The resource manager controls the loading of game resources.  loadResources has optional callback and errorCallback functions to inform the rest of the program when
loading is complete.
Example sources object:
		var sources = {
			tiles: "images/spritesheet_tiles.png",
			characters: "images/spritesheet_characters.png",
			items: "images/spritesheet_items.png",
			particles: "images/spritesheet_particles.png"
		}

*/
var ResourceManager = {
    totalResources: 0,
	failedResources: 0,
	successfulResources: 0,
	resources: {},
	loadResources: function(sources, callback, errorCallback){
		var self = this;
		for (var src in sources)
		{
			this.totalResources++;
		}
		
		for (var src in sources)
		{
			this.resources[src] = new Image();
			this.resources[src].onload = function() {
				self.successfulResources++;
				if (callback)
				{
					if (self.totalResources == (self.successfulResources + self.failedResources))
					{
						callback();
					}
				}
			};
			this.resources[src].onerror = function() {
				self.failedResources++;	
				if (errorCallback)
				{
					errorCallback(this);
				}
				
				if (self.totalResources == (self.successfulResources + self.failedResources))
				{
					callback();
				}
			}
			this.resources[src].src = sources[src];
			
		}
	},
	getResource: function(resourceName){
		if (this.resources[resourceName] != undefined)
		{
			return this.resources[resourceName];
		}
		
		return null;
	}
}

function TileManager() {
    
}


//Base Game Class.  Call Init, Render, and Update as needed.  
var Game = {
    stopMain: null,
    lastRender: 0,
    lastTick: 0,
    tickLength: 30,
    init: function()
    {
		var sources = {
			tiles: "images/spritesheet_tiles.png",
			characters: "images/spritesheet_characters.png",
			items: "images/spritesheet_items.png",
			particles: "images/spritesheet_particles.png"
		}
		ResourceManager.loadResources(sources);
        console.log("Init");
    },
    render: function(tFrame){
        //console.log("Render");
    },
    update: function(){
        //console.log("Update");
    }
 
    
}


//Based on example from https://developer.mozilla.org/en-US/docs/Games/Anatomy
;(function () {
  function main( tFrame ) {
    Game.stopMain = window.requestAnimationFrame( main );
    var nextTick = Game.lastTick + Game.tickLength;
    var numTicks = 0;

    //If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
    //If tFrame = nextTick then 1 tick needs to be updated (and so forth).
    //Note: As we mention in summary, you should keep track of how large numTicks is.
    //If it is large, then either your game was asleep, or the machine cannot keep up.
    if (tFrame > nextTick) {
      var timeSinceTick = tFrame - Game.lastTick;
      numTicks = Math.floor( timeSinceTick / Game.tickLength );
    }

    queueUpdates( numTicks );
    Game.render( tFrame );
    Game.lastRender = tFrame;
  }

  function queueUpdates( numTicks ) {
    for(var i=0; i < numTicks; i++) {
      Game.lastTick = Game.lastTick + Game.tickLength; //Now lastTick is this tick.
      Game.update();
    }
  }

  Game.lastTick = performance.now();
  Game.lastRender = Game.lastTick; //Pretend the first draw was on first update.
  Game.tickLength = 50; //This sets your simulation to run at 20Hz (50ms)
  
  Game.init();
  main(performance.now()); // Start the cycle
})();