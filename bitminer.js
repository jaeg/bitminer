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
    tileSize: 16,
    currentCamera: null,
    tiles: [[]],
    update: function(){},
    draw: function(){
        if (this.currentCamera != null)
        {
            //Drawing is based off screen offset so get a point near the center for a "camera"
            var cameraX = canvas.width/2 - this.currentCamera.screenOffset.x;
            var cameraY = canvas.height/2 - this.currentCamera.screenOffset.y  ;

            //Get min and max tiles.
            var cameraMinX = Math.floor((cameraX - canvas.width/2 )/this.tileSize);
            var cameraMaxX = Math.floor((cameraX + canvas.width/2 )/this.tileSize);
            var cameraMinY = Math.floor((cameraY - canvas.height/2)/this.tileSize);
            var cameraMaxY = Math.floor((cameraY + canvas.height/2 )/this.tileSize);
            for (var y = cameraMinY; y <= cameraMaxY; y++)
            {
                for (var x = cameraMinX; x <= cameraMaxX; x++)
                {
                    if (!this.tiles[y]) this.tiles[y] = []
                    var tile = this.tiles[y][x];
                    if (tile != null)
                    {
                        tile.draw((x*this.tileSize) + this.currentCamera.screenOffset.x, (y*this.tileSize)+this.currentCamera.screenOffset.y);
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
        switch (type)
        {
            case 1:ctx.drawImage(spriteSheet,650,0,128,128,screenX,screenY,TileManager.tileSize,TileManager.tileSize);break;
            case 2:ctx.drawImage(spriteSheet,650,130,128,128,screenX,screenY,TileManager.tileSize,TileManager.tileSize);break;
            case 3:ctx.drawImage(spriteSheet,256,650,128,128,screenX,screenY,TileManager.tileSize,TileManager.tileSize);break;
        }
    }
    
    this.update = function(){
        
    }
}

//http://gamedevelopment.tutsplus.com/tutorials/generate-random-cave-levels-using-cellular-automata--gamedev-9664
WorldBuilder = {
    dirtDepth: 100,
    stoneDepth: 100,
    chanceToStartAlive: .60,
    generate: function(width, height){
        var startY = 6;
        for (var x = 0; x < width; x++)
        {
            currentY = startY + 1;
            //Grass section
            TileManager.addTile(x,startY,new Tile(1));

            //Dirt Section
            while (currentY < startY+this.dirtDepth)
            {
                if (Math.random() < this.chanceToStartAlive)
                {
                    TileManager.addTile(x,currentY,new Tile(2));
                }
                currentY++;
            }

            //Stone Section
            while (currentY < startY+this.dirtDepth+this.stoneDepth)
            {
                if (Math.random() < this.chanceToStartAlive)
                {
                    TileManager.addTile(x,currentY,new Tile(3));
                }
                currentY++;
            }

           // startY += Math.ceil((Math.random()*2 - 2));
        }

        for (var i = 0; i < 100; i++)
        {
          this.automaStep();
        }
    },

    countNeighbors: function(x,y){
        var count = 0;
        for (var i = -1; i <2; i++)
        {
            for (var j = -1; j<2; j++)
            {
                var neighbour_x = x+i;
                var neighbour_y = y+j;
                if (!TileManager.tiles[neighbour_y]) TileManager.tiles[neighbour_y] = []
                if (i == 0 && j ==0)
                {

                }
                else if(neighbour_x < 0 || neighbour_y < 0 || neighbour_y >= TileManager.tiles.length || neighbour_x >= TileManager.tiles[y].length)
                {
                    count++;
                }
                else if(TileManager.tiles[neighbour_y][neighbour_x] != undefined){
                    count++;
                }
            }
        }

        return count;
    },

    automaStep: function(){
        deathLimit = 4;
        birthLimit = 5;
        for (var y = 0; y < TileManager.tiles.length; y++)
        {
            if (!TileManager.tiles[y]) TileManager.tiles[y] = []
            for (var x = 0; x < TileManager.tiles[y].length; x++)
            {
                var neighbourCount = this.countNeighbors(x,y);
                if (TileManager.tiles[y][x] != undefined)
                {
                    if (neighbourCount < deathLimit)
                    {
                        TileManager.tiles[y][x] = undefined;
                    }
                }
                else
                {

                    if (neighbourCount > birthLimit)
                    {
                        TileManager.addTile(x,y,new Tile(2));
                    }
                }
            }
        }
    }
}

function Camera(following, moveSpeed){
    this.following = following || null;
    this.moveSpeed = moveSpeed || 3;
    this.screenOffset = {x:0, y:0};
    this.update = function()
    {
        //Screen move
        if (this.following.x + this.screenOffset.x + TileManager.tileSize > canvas.width)
        {
            this.screenOffset.x -= this.moveSpeed;
        }
        if (this.following.x + this.screenOffset.x < 0)
            this.screenOffset.x += this.moveSpeed;
        if (this.following.y + this.screenOffset.y + TileManager.tileSize > canvas.height)
            this.screenOffset.y -= this.moveSpeed;
        if (this.following.y + this.screenOffset.y < 0)
            this.screenOffset.y += this.moveSpeed;
    }
}

var player = {
    x: 0,
    y: 0,
    camera: '',
    init: function(){
        this.camera = new Camera(this,20);
        window.addEventListener('keydown', function(event) {
          switch (event.keyCode) {
            case 37: // Left
              player.moveLeft();
            break;

            case 38: // Up
              player.moveUp();
            break;

            case 39: // Right
              player.moveRight();
            break;

            case 40: // Down
              player.moveDown();
            break;
            }
        }, false);
    },
    update: function(){
        this.camera.update();
    },
    draw: function()
    {
        var spriteSheet = ResourceManager.getResource("tiles");
        ctx.drawImage(spriteSheet,0,0,128,128,this.x + this.camera.screenOffset.x,this.y+this.camera.screenOffset.y,32,32);
    },
    moveLeft: function(){
        this.x -= 10;
    },
    moveRight: function(){
        this.x +=10;
    },
    moveUp: function(){
        this.y -= 10;
    },
    moveDown: function(){
        this.y += 10;
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
        //Image sources for the game
		var sources = {
			tiles: "images/spritesheet_tiles.png",
			characters: "images/spritesheet_characters.png",
			items: "images/spritesheet_items.png",
			particles: "images/spritesheet_particles.png"
		}
		ResourceManager.loadResources(sources);
        
        //Randomly create a world
        console.log("create world");
        WorldBuilder.generate(1000,10);
        /*
        for (var x = 0; x<1000; x++)
        {
            for (var y = 0; y<1000; y++)
            {
                var tile = new Tile(Math.ceil(Math.random()*2));   
                TileManager.addTile(x,y,tile);
            }
        }*/
        

        player.init();
        TileManager.setCamera(player.camera);
    },
    render: function(tFrame){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        TileManager.draw();
        player.draw();
    },
    update: function(){
        player.update();
        TileManager.update();
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