canvas = document.getElementById('tilesCanvas');
ctx = canvas.getContext('2d');

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

var TileManager = {
    currentCamera: null,
    tiles: [[]],
    update: function(){},
    draw: function(){
        if (this.currentCamera != null)
        {
            var startx =  Math.floor((this.currentCamera.x - 640 / 2)/32)
            var endx = Math.floor((this.currentCamera.x + Math.ceil(640 / 2))/32)
            var starty = Math.floor((this.currentCamera.y - 480 / 2)/32)
            var endy = Math.floor((this.currentCamera.y + Math.ceil(480 / 2))/32)
            
            for (var x = startx; x < endx; x ++)
            {
                
                for (var y = starty; y < endy; y ++)
                {
                    if (!this.tiles[y]) this.tiles[y] = []
                    var tile = this.tiles[y][x];
                    if (tile != null)
                    {
                        
                        tile.draw((x-this.currentCamera.x)*32, (y-this.currentCamera.y)*32);
                    }

                }
            }
        }
    },
    setCamera: function(camera){
        this.currentCamera = camera;   
    },
    addTile: function(x,y,tile){
        if (!this.tiles[y]) this.tiles[y] = []
        this.tiles[y][x] = tile;
    }
}

function Tile(type){
    this.hp = 100;
    this.type = type;
    
    this.draw = function(screenX,screenY){
        var spriteSheet = ResourceManager.getResource("tiles");
        ctx.drawImage(spriteSheet,650,130,128,128,screenX,screenY,32,32);
    }
    
    this.update = function(){
        
    }
}

var player = {
    x: 0,
    y: 0,
    draw: function()
    {
        var spriteSheet = ResourceManager.getResource("tiles");
        ctx.drawImage(spriteSheet,0,0,128,128,this.x,this.y,32,32);
    }
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
        
        for (var x = 0; x<100; x++)
        {
            for (var y = 0; y<100; y++)
            {
                var tile = new Tile(1);   
                TileManager.addTile(x,y,tile);
            }
        }
        TileManager.setCamera(player);
    },
    render: function(tFrame){
        ctx.clearRect(0,0,640,480);
        TileManager.draw();
        player.draw();
        //console.log("Render");
    },
    update: function(){
        TileManager.update();
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