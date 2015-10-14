canvas = document.getElementById('tilesCanvas');
ctx = canvas.getContext('2d');

//http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/
var Key = {
    _pressed:
    {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    isDown: function(keyCode)
    {
        return this._pressed[keyCode];
    },

    onKeydown: function(event)
    {
        this._pressed[event.keyCode] = true;
    },

    onKeyup: function(event)
    {
        delete this._pressed[event.keyCode];
    }
};
window.addEventListener('keyup', function(event)
{
    Key.onKeyup(event);
}, false);
window.addEventListener('keydown', function(event)
{
    Key.onKeydown(event);
}, false);

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
var ResourceManager = function()
{
    this.totalResources = 0;
    this.failedResources = 0;
    this.successfulResources = 0;
    this.resources = {};
}

ResourceManager.prototype.loadResources = function(sources, callback, errorCallback)
{
    var self = this;
    for (var src in sources)
    {
        this.totalResources++;
    }

    for (var src in sources)
    {
        this.resources[src] = new Image();
        this.resources[src].onload = function()
        {
            self.successfulResources++;
            if (callback)
            {
                if (self.totalResources == (self.successfulResources + self.failedResources))
                {
                    callback();
                }
            }
        };
        this.resources[src].onerror = function()
        {
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
}

ResourceManager.prototype.getResource = function(resourceName)
{
    if (this.resources[resourceName] != undefined)
    {
        return this.resources[resourceName];
    }

    return null;
}

resourceManager = new ResourceManager();

var TileManager = function()
{
    this.tileSize = 32;
    this.currentCamera = null;
    this.tiles = [
        []
    ];
}
TileManager.prototype.update = function() {};
TileManager.prototype.draw = function()
{
    if (this.currentCamera != null)
    {
        //Drawing is based off screen offset so get a point near the center for a "camera"
        var cameraX = canvas.width / 2 - this.currentCamera.screenOffset.x;
        var cameraY = canvas.height / 2 - this.currentCamera.screenOffset.y;

        //Get min and max tiles.
        var cameraMinX = Math.floor((cameraX - canvas.width / 2) / this.tileSize);
        var cameraMaxX = Math.floor((cameraX + canvas.width / 2) / this.tileSize);
        var cameraMinY = Math.floor((cameraY - canvas.height / 2) / this.tileSize);
        var cameraMaxY = Math.floor((cameraY + canvas.height / 2) / this.tileSize);
        for (var y = cameraMinY; y <= cameraMaxY; y++)
        {
            for (var x = cameraMinX; x <= cameraMaxX; x++)
            {
                if (!this.tiles[y]) this.tiles[y] = []
                var tile = this.tiles[y][x];
                if (tile != null)
                {
                    tile.draw((x * this.tileSize) + this.currentCamera.screenOffset.x, (y * this.tileSize) + this.currentCamera.screenOffset.y);
                }
            }

        }
    }
};
TileManager.prototype.setCamera = function(camera)
{
    this.currentCamera = camera;
};
TileManager.prototype.addTile = function(x, y, tile)
{
    if (!this.tiles[y]) this.tiles[y] = []
    this.tiles[y][x] = tile;
};
TileManager.prototype.removeTile = function(x, y)
{
    this.tiles[y][x] = undefined;
};
TileManager.prototype.moveTile = function(x1, y1, x2, y2)
{
    this.addTile(x2, y2, this.tiles[y1, x1]);
    this.removeTile(x1, y1);
};
TileManager.prototype.tileAt = function(x, y)
{
    return tiles[y][x];
}
TileManager.prototype.tileIsSolid = function(x, y)
{
    if (this.tiles[y][x] == undefined)
    {
        return false;
    }
    return this.tiles[y][x].solid;
}

var tileManager = new TileManager();

function Tile(type)
{
    this.hp = 100;
    this.type = type;
    this.solid = true;
    this.draw = function(screenX, screenY)
    {
        var spriteSheet = resourceManager.getResource("tiles");
        switch (type)
        {
            case 1:
                ctx.drawImage(spriteSheet, 650, 0, 128, 128, screenX, screenY, tileManager.tileSize, tileManager.tileSize);
                break;
            case 2:
                ctx.drawImage(spriteSheet, 650, 130, 128, 128, screenX, screenY, tileManager.tileSize, tileManager.tileSize);
                break;
            case 3:
                ctx.drawImage(spriteSheet, 256, 650, 128, 128, screenX, screenY, tileManager.tileSize, tileManager.tileSize);
                break;
        }
    }

    this.update = function() {

    }
}

//http://gamedevelopment.tutsplus.com/tutorials/generate-random-cave-levels-using-cellular-automata--gamedev-9664
WorldBuilder = function()
{
    this.dirtDepth = 100;
    this.stoneDepth = 100;
    this.chanceToStartAlive = .60;
}
WorldBuilder.prototype.generate = function(width, height)
    {
        var startY = 100;
        for (var x = 0; x < width; x++)
        {
            currentY = startY + 1;
            //Grass section
            tileManager.addTile(x, startY, new Tile(1));

            //Dirt Section
            while (currentY < startY + this.dirtDepth)
            {
                if (Math.random() < this.chanceToStartAlive + .20)
                {
                    tileManager.addTile(x, currentY, new Tile(2));
                }
                currentY++;
            }

            //Stone Section
            while (currentY < startY + this.dirtDepth + this.stoneDepth)
            {
                if (Math.random() < this.chanceToStartAlive)
                {
                    tileManager.addTile(x, currentY, new Tile(3));
                }
                currentY++;
            }

            startY += Math.ceil((Math.random() * 2 - 1));
        }

        for (var i = 0; i < 100; i++)
        {
            this.automaStep();
        }
    },

    WorldBuilder.prototype.countNeighbors = function(x, y)
    {
        var count = 0;
        for (var i = -1; i < 2; i++)
        {
            for (var j = -1; j < 2; j++)
            {
                var neighbour_x = x + i;
                var neighbour_y = y + j;
                if (!tileManager.tiles[neighbour_y]) tileManager.tiles[neighbour_y] = []
                if (i == 0 && j == 0)
                {

                }
                else if (neighbour_x < 0 || neighbour_y < 0 || neighbour_y >= tileManager.tiles.length || neighbour_x >= tileManager.tiles[y].length)
                {
                    count++;
                }
                else if (tileManager.tiles[neighbour_y][neighbour_x] != undefined)
                {
                    count++;
                }
            }
        }

        return count;
    },

    WorldBuilder.prototype.automaStep = function()
    {
        deathLimit = 4;
        birthLimit = 5;
        for (var y = 0; y < tileManager.tiles.length; y++)
        {
            if (!tileManager.tiles[y]) tileManager.tiles[y] = []
            for (var x = 0; x < tileManager.tiles[y].length; x++)
            {
                var neighbourCount = this.countNeighbors(x, y);
                if (tileManager.tiles[y][x] != undefined)
                {
                    if (neighbourCount < deathLimit)
                    {
                        tileManager.removeTile(x, y);
                    }
                }
                else
                {

                    if (neighbourCount > birthLimit)
                    {
                        tileManager.addTile(x, y, new Tile(2));
                    }
                }
            }
        }
    }

function Camera(following, moveSpeed)
{
    this.following = following || null;
    this.moveSpeed = moveSpeed || 3;
    this.screenOffset = {
        x: 0,
        y: 0
    };
    this.update = function()
    {
        //Screen move
        if (this.following.x * tileManager.tileSize + this.screenOffset.x + tileManager.tileSize > canvas.width)
        {
            this.screenOffset.x -= this.moveSpeed;
        }
        if (this.following.x * tileManager.tileSize + this.screenOffset.x < 0)
            this.screenOffset.x += this.moveSpeed;
        if (this.following.y * tileManager.tileSize + this.screenOffset.y + tileManager.tileSize > canvas.height)
            this.screenOffset.y -= this.moveSpeed;
        if (this.following.y * tileManager.tileSize + this.screenOffset.y < 0)
            this.screenOffset.y += this.moveSpeed;
    }
}



var Player = function()
{
    this.x = 0;
    this.y = 100; //Player x is in screen coords not array coords..
    this.camera = '';
    this.xspeed = 0;
    this.yspeed = 0;
}
Player.prototype.init = function()
{
    this.camera = new Camera(this, 20);
};
Player.prototype.update = function()
{
    this.camera.update();
    if (Key.isDown(Key.UP)) this.moveUp();
    if (Key.isDown(Key.LEFT)) this.moveLeft();
    if (Key.isDown(Key.DOWN)) this.moveDown();
    if (Key.isDown(Key.RIGHT)) this.moveRight();

    this.x += this.xspeed;
    this.y += this.yspeed;

    //http://www.emanueleferonato.com/2014/01/17/creation-of-an-html5-tile-based-platform-game-with-no-engines-behind-pure-code/
    var baseCol = Math.floor(this.x);
    var baseRow = Math.floor(this.y);
    var rowOverlap = this.y % tileManager.tileSize
    console.log(!tileManager.tileIsSolid(baseCol, baseRow));
    if (this.xspeed > 0)
    {
        if ((tileManager.tileIsSolid(baseCol + 1, baseRow) && !tileManager.tileIsSolid(baseCol, baseRow) || tileManager.tileIsSolid(baseCol + 1, baseRow + 1) && !tileManager.tileIsSolid(baseCol, baseRow + 1)))
        {
            this.x = baseCol;
        }
    }

    if (this.xspeed < 0)
    {
        if ((!tileManager.tileIsSolid(baseCol + 1, baseRow) && tileManager.tileIsSolid(baseCol, baseRow) || !tileManager.tileIsSolid(baseCol + 1, baseRow + 1) && tileManager.tileIsSolid(baseCol, baseRow + 1)))
        {
            this.x = baseCol + 1;
        }
    }

    this.xspeed = 0;
    this.yspeed = 0;
};
Player.prototype.draw = function()
{
    var spriteSheet = resourceManager.getResource("tiles");
    ctx.drawImage(spriteSheet, 0, 0, 128, 128, (this.x * tileManager.tileSize) + this.camera.screenOffset.x, (this.y * tileManager.tileSize) + this.camera.screenOffset.y, 32, 32);
};
Player.prototype.moveLeft = function()
{
    this.xspeed = -.3;
};
Player.prototype.moveRight = function()
{
    this.xspeed = .3;
};
Player.prototype.moveUp = function()
{
    this.yspeed = -.3
};
Player.prototype.moveDown = function()
{
    this.yspeed = .3;
};



//Base Game Class.  Call Init, Render, and Update as needed.  
var Game = {
    stopMain: null,
    lastRender: 0,
    lastTick: 0,
    tickLength: 10,
    player: new Player(),
    init: function()
    {
        //Image sources for the game
        var sources = {
            tiles: "images/spritesheet_tiles.png",
            characters: "images/spritesheet_characters.png",
            items: "images/spritesheet_items.png",
            particles: "images/spritesheet_particles.png"
        }
        resourceManager.loadResources(sources);

        //Randomly create a world
        console.log("create world");
        worldBuilder = new WorldBuilder();
        worldBuilder.generate(1000, 10);
        /*
        for (var x = 0; x<1000; x++)
        {
            for (var y = 0; y<1000; y++)
            {
                var tile = new Tile(Math.ceil(Math.random()*2));   
                tileManager.addTile(x,y,tile);
            }
        }*/


        this.player.init();
        tileManager.setCamera(this.player.camera);
    },
    render: function(tFrame)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tileManager.draw();
        this.player.draw();
    },
    update: function()
    {
        this.player.update();
        tileManager.update();
    }


}


//Based on example from https://developer.mozilla.org/en-US/docs/Games/Anatomy
;
(function()
{
    function main(tFrame)
    {
        Game.stopMain = window.requestAnimationFrame(main);
        var nextTick = Game.lastTick + Game.tickLength;
        var numTicks = 0;

        //If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
        //If tFrame = nextTick then 1 tick needs to be updated (and so forth).
        //Note: As we mention in summary, you should keep track of how large numTicks is.
        //If it is large, then either your game was asleep, or the machine cannot keep up.
        if (tFrame > nextTick)
        {
            var timeSinceTick = tFrame - Game.lastTick;
            numTicks = Math.floor(timeSinceTick / Game.tickLength);
        }

        queueUpdates(numTicks);
        Game.render(tFrame);
        Game.lastRender = tFrame;
    }

    function queueUpdates(numTicks)
    {
        for (var i = 0; i < numTicks; i++)
        {
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