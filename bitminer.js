canvas = document.getElementById('tilesCanvas');
ctx = canvas.getContext('2d');

var Key = require("./Modules/Input").Key;
var Mouse = require("./Modules/Input").Mouse;
var ResourceManager = require("./Modules/ResourceManager");
var TileManager = require("./Modules/TileManager");
var Tile = require("./Modules/Tile");
var WorldBuilder = require("./Modules/WorldBuilder");
var Camera = require("./Modules/Camera");
var Player = require("./Modules/Player");

//http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/
window.addEventListener('keyup', function(event)
{
    Key.onKeyup(event);
}, false);
window.addEventListener('keydown', function(event)
{
    Key.onKeydown(event);
}, false);

window.addEventListener('mousemove', function(evt) {
    Mouse.setMousePos(canvas, evt);
}, false);


resourceManager = new ResourceManager();

var DependencyInjector = function()
{
    this.dependencies = {};
    this.addDependency = function(name, system)
    {
        this.dependencies[name] = system;
    }
    this.getDependencies = function(dependencyList)
    {
        var list = {};
        var self = this;
        dependencyList.forEach(function(element, index, array)
        {
            list [element] = self.dependencies[element];
        });
        
        return list;
    }
}

var tileManager = new TileManager();


//Base Game Class.  Call Init, Render, and Update as needed.  
var Game = {
    stopMain: null,
    lastRender: 0,
    lastTick: 0,
    tickLength: 10,
    player: new Player(tileManager),
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
        worldBuilder = new WorldBuilder(tileManager);
        worldBuilder.generate(1000, 10);

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