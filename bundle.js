(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Animator = function(skeleton) {
    this.skeleton = skeleton;
    this.tick = 0;
}

Animator.prototype.animate = function() {
    this.tick += .5;
    this.skeleton.getChild("body").getChild("leftLeg").localAngle += Math.cos(this.tick) * 10;
    this.skeleton.getChild("body").getChild("rightLeg").localAngle += -Math.cos(this.tick) * 10;

    this.skeleton.getChild("leftArm").localAngle = 189//+= -Math.cos(this.tick) * 10;
    this.skeleton.getChild("rightArm").localAngle += Math.cos(this.tick) * 10;

    this.skeleton.getChild("head").localAngle += Math.cos(this.tick);

}

module.exports = Animator;

},{}],2:[function(require,module,exports){
function Camera(following, moveSpeed, tileManager) {
    this.following = following || null;
    this.moveSpeedX = moveSpeed || 10;
    this.moveSpeedY = moveSpeed || 10;
    this.screenOffset = {
        x: 0,
        y: 0
    };
    this.tolerenceX = canvas.width / 2;
    this.tolerenceY = canvas.height / 2;
    this.tileManager = tileManager;
    this.update = function() {
        //Screen move
        if (this.following.x * this.tileManager.tileSize + this.screenOffset.x + this.tileManager.tileSize > canvas.width - this.tolerenceX) {
            this.screenOffset.x -= this.moveSpeedX;
        }
        if (this.following.x * this.tileManager.tileSize + this.screenOffset.x < 0 + this.tolerenceX)
            this.screenOffset.x += this.moveSpeedX;
        if (this.following.y * this.tileManager.tileSize + this.screenOffset.y + this.tileManager.tileSize > canvas.height - this.tolerenceY)
            this.screenOffset.y -= this.moveSpeedY;
        if (this.following.y * this.tileManager.tileSize + this.screenOffset.y < 0 + this.tolerenceY)
            this.screenOffset.y += this.moveSpeedY;
    }
}

module.exports = Camera;
},{}],3:[function(require,module,exports){
var Key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    isDown: function(keyCode) {
        return this._pressed[keyCode];
    },

    onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup: function(event) {
        delete this._pressed[event.keyCode];
    }
};

var Mouse = {
    Clicked: false,
    coords: {
        x: 0,
        y: 0
    },
    //http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
    setMousePos: function(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        this.coords.x = Math.round((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
        this.coords.y = Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)

    },
}

module.exports = {
    Key: Key,
    Mouse: Mouse
}
},{}],4:[function(require,module,exports){
var Camera = require("./Camera");
var Key = require("./Input").Key;
var Mouse = require("./Input").Mouse;
var Player = function(tileManager) {
    this.x = 0;
    this.y = 100; //Player x is in screen coords not array coords..
    this.camera = '';
    this.xspeed = 0;
    this.yspeed = 0;
    this.tileManager = tileManager
}
Player.prototype.init = function() {
    this.camera = new Camera(this, 20, this.tileManager);
};
Player.prototype.update = function() {
    this.camera.update();
    if (Key.isDown(Key.UP)) this.moveUp();
    if (Key.isDown(Key.LEFT)) this.moveLeft();
    if (Key.isDown(Key.DOWN)) this.moveDown();
    if (Key.isDown(Key.RIGHT)) this.moveRight();

    if (this.xspeed != 0 || this.yspeed != 0) {

        this.camera.moveSpeedX = Math.abs(this.tileManager.tileSize * this.xspeed);
        this.camera.moveSpeedY = Math.abs(this.tileManager.tileSize * this.yspeed);
    }

    this.x += this.xspeed;
    this.y += this.yspeed;

    //http://www.emanueleferonato.com/2014/01/17/creation-of-an-html5-tile-based-platform-game-with-no-engines-behind-pure-code/
    var baseCol = Math.floor(this.x);
    var baseRow = Math.floor(this.y);
    var rowOverlap = this.y % this.tileManager.tileSize

    if (this.xspeed > 0) {
        if ((this.tileManager.tileIsSolid(baseCol + 1, baseRow) && !this.tileManager.tileIsSolid(baseCol, baseRow) || this.tileManager.tileIsSolid(baseCol + 1, baseRow + 1) && !this.tileManager.tileIsSolid(baseCol, baseRow + 1))) {
            this.x = baseCol;
        }
    }

    if (this.xspeed < 0) {
        if ((!this.tileManager.tileIsSolid(baseCol + 1, baseRow) && this.tileManager.tileIsSolid(baseCol, baseRow) || !this.tileManager.tileIsSolid(baseCol + 1, baseRow + 1) && this.tileManager.tileIsSolid(baseCol, baseRow + 1))) {
            this.x = baseCol + 1;
        }
    }

    if (this.yspeed > 0) {
        if ((this.tileManager.tileIsSolid(baseCol, baseRow + 1) && !this.tileManager.tileIsSolid(baseCol, baseRow) || this.tileManager.tileIsSolid(baseCol + 1, baseRow + 1) && !this.tileManager.tileIsSolid(baseCol + 1, baseRow))) {
            this.y = baseRow;
        }
    }

    if (this.yspeed < 0) {
        if ((!this.tileManager.tileIsSolid(baseCol, baseRow + 1) && this.tileManager.tileIsSolid(baseCol, baseRow) || !this.tileManager.tileIsSolid(baseCol + 1, baseRow + 1) && this.tileManager.tileIsSolid(baseCol + 1, baseRow))) {
            this.y = baseRow + 1;
        }
    }

    this.xspeed = 0;
    this.yspeed = 0;


    //Mouse Stuff
    var tileX = Math.floor((Mouse.coords.x - this.camera.screenOffset.x) / this.tileManager.tileSize);
    var tileY = Math.floor((Mouse.coords.y - this.camera.screenOffset.y) / this.tileManager.tileSize);
    this.tileManager.removeTile(tileX, tileY);
};
Player.prototype.draw = function() {
    var spriteSheet = resourceManager.getResource("tiles");
    ctx.drawImage(spriteSheet, 0, 0, 128, 128, (this.x * this.tileManager.tileSize) + this.camera.screenOffset.x, (this.y * this.tileManager.tileSize) + this.camera.screenOffset.y, 32, 32);
};
Player.prototype.moveLeft = function() {
    this.xspeed = -.3;
    humanoid.flip(false);
};
Player.prototype.moveRight = function() {
    this.xspeed = .3;
    humanoid.flip(true)
};
Player.prototype.moveUp = function() {
    this.yspeed = -.3
};
Player.prototype.moveDown = function() {
    this.yspeed = .3;
};

module.exports = Player;

},{"./Camera":2,"./Input":3}],5:[function(require,module,exports){
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
var ResourceManager = function() {
    this.totalResources = 0;
    this.failedResources = 0;
    this.successfulResources = 0;
    this.resources = {};
}

ResourceManager.prototype.loadResources = function(sources, callback, errorCallback) {
    var self = this;
    for (var src in sources) {
        this.totalResources++;
    }

    for (var src in sources) {
        this.resources[src] = new Image();
        this.resources[src].onload = function() {
            self.successfulResources++;
            if (callback) {
                if (self.totalResources == (self.successfulResources + self.failedResources)) {
                    callback();
                }
            }
        };
        this.resources[src].onerror = function() {
            self.failedResources++;
            if (errorCallback) {
                errorCallback(this);
            }

            if (self.totalResources == (self.successfulResources + self.failedResources)) {
                callback();
            }
        }
        this.resources[src].src = sources[src];

    }
}

ResourceManager.prototype.getResource = function(resourceName) {
    if (this.resources[resourceName] != undefined) {
        return this.resources[resourceName];
    }

    return null;
}

module.exports = ResourceManager;
},{}],6:[function(require,module,exports){
function lengthDir_x(len, dir) {
    var rads = dir * (Math.PI / 180);
    return Math.cos(rads) * len;
}

function lengthDir_y(len, dir) {
    var rads = dir * (Math.PI / 180);
    return Math.sin(rads) * len;
}

var Bone = function() {
    this.name = "";
    this.localPosition = {
        x: 0,
        y: 0
    };
    this.position = {
        x: 0,
        y: 0
    };
    this.flipped = 0;
    this.localAngle = 0;
    this.angle = 0;
    this.length = 0;
    this.parent = null;
    this.children = [];
    this.zindex = 0; //Relative to parent
    this.image = "characters";
    this.imageLocation = {
        x: 0,
        y: 0
    };
    this.imageHeight = 128;
    this.imageWidth = 128;
    this.imageOffset = {
        x: 0,
        y: 0
    };
}

Bone.prototype.flip = function(flip) {
  if (this.flipped !== flip) {
    this.flipped = flip
    this.zindex = this.zindex * -1
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].flip(flip)
    }
    this.resortChildren()
  }
}

Bone.prototype.resortChildren = function() {
  this.children.sort(function(a, b) {
      return -(a.zindex - b.zindex)
  });
  for (var i = 0; i < this.children.length; i++) {
      this.children[i].resortChildren()
  }
}

Bone.prototype.addChild = function(child) {
    this.children.push(child);
    child.parent = this;
    this.children.sort(function(a, b) {
        return -(a.zindex - b.zindex)
    });
}


Bone.prototype.getChild = function(name) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].name == name) {
            return this.children[i];
        }
    }
}

Bone.prototype.update = function() {
    if (this.localAngle > 360) {
        this.localAngle -= 360;
    }

    if (this.localAngle < 0) {
        this.localAngle += 360;
    }
    if (this.parent != null) {
        this.angle = this.localAngle + this.parent.angle ;
        //Do this to preserve the angle for animation purposes since angle will get set via
        //data from a file.
        var worldAngle = this.angle;
        if (this.flipped) {
          worldAngle = 180 - this.angle;
        }

        this.position.x = lengthDir_x(this.length, worldAngle) + this.parent.position.x;
        this.position.y = lengthDir_y(this.length, worldAngle) + this.parent.position.y;
    } else {
        this.angle = this.localAngle;
        this.position = this.localPosition
    }

    for (var child in this.children) {
        this.children[child].update();
    }
}

Bone.prototype.draw = function() {
    var drawnSelf = false;

    for (var child in this.children) {
        if (!drawnSelf && this.zindex < this.children[child].zindex) {
            this.drawImage();
            drawnSelf = true;
        }

        this.children[child].draw();
    }

    if (!drawnSelf) {
        this.drawImage();
    }
}

Bone.prototype.drawImage = function() {
    if (this.parent != null) {
        var spriteSheet = resourceManager.getResource(this.image);
        ctx.save();
        ctx.translate(this.parent.position.x, this.parent.position.y);
        if (this.flipped) {
          ctx.scale(-1,1);
        }
        ctx.rotate((this.angle - 90) * Math.PI / 180);
        ctx.drawImage(spriteSheet, this.imageLocation.x, this.imageLocation.y, this.imageWidth, this.imageHeight, this.imageOffset.x, this.imageOffset.y, this.imageWidth / 2, this.imageHeight / 2);
        ctx.restore();


        ctx.beginPath();
        ctx.moveTo(this.parent.position.x, this.parent.position.y);
        ctx.lineTo(this.position.x, this.position.y);
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
    }
}

var HumanoidFactory = function() {
    var root = new Bone();
    var head = new Bone();

    head.length = 10;
    head.localAngle = 90;
    head.name = "head";
    head.imageHeight = 64;
    head.imageWidth = 64;
    head.imageLocation = {
        x: 0,
        y: 344
    };
    head.imageOffset = {
        x: -16,
        y: -32
    };
    root.addChild(head);
    head.zindex = -1;

    var body = new Bone();
    body.length = 25;
    body.localAngle = 90;
    body.name = "body";
    body.imageHeight = 59;
    body.imageWidth = 44;
    body.imageLocation = {
        x: 88,
        y: 150
    };
    body.imageOffset = {
        x: -11,
        y: 0
    };
    body.zindex = 0;
    root.addChild(body);


    var rightArm = new Bone();
    rightArm.length = 25;
    rightArm.localAngle = 90;
    rightArm.name = "rightArm";
    rightArm.imageHeight = 66;
    rightArm.imageWidth = 28;
    rightArm.imageLocation = {
        x: 158,
        y: 401
    };
    rightArm.imageOffset = {
        x: -7,
        y: 0
    };
    rightArm.zindex = 1;
    root.addChild(rightArm);

    var handItem = new Bone();
    handItem.length = 25;
    handItem.localAngle = 90;
    handItem.name = "rightArm2";
    handItem.imageHeight = 66;
    handItem.imageWidth = 28;
    handItem.imageLocation = {
        x: 158,
        y: 401
    };
    handItem.imageOffset = {
        x: -7,
        y: 0
    };
    handItem.zindex = 1;
    rightArm.addChild(handItem)

    var leftArm = new Bone();
    leftArm.length = 25;
    leftArm.localAngle = 90;
    leftArm.name = "leftArm";
    leftArm.imageHeight = 66;
    leftArm.imageWidth = 28;
    leftArm.imageLocation = {
        x: 158,
        y: 401
    };
    leftArm.imageOffset = {
        x: -7,
        y: 0
    };
    leftArm.zindex = -2;
    root.addChild(leftArm);

    var leftLeg = new Bone();
    leftLeg.length = 25;
    leftLeg.localAngle = 0;
    leftLeg.name = "leftLeg";
    leftLeg.imageHeight = 56;
    leftLeg.imageWidth = 28;
    leftLeg.imageLocation = {
        x: 134,
        y: 139
    };
    leftLeg.imageOffset = {
        x: -7,
        y: 0
    };
    leftLeg.zindex = 1;
    body.addChild(leftLeg);

    var rightLeg = new Bone();
    rightLeg.length = 25;
    rightLeg.localAngle = 0;
    rightLeg.name = "rightLeg";
    rightLeg.imageHeight = 56;
    rightLeg.imageWidth = 28;
    rightLeg.imageLocation = {
        x: 134,
        y: 139
    };
    rightLeg.imageOffset = {
        x: -7,
        y: 0
    };
    rightLeg.zindex = 1;
    body.addChild(rightLeg);

    return root;
}


module.exports.Bone = Bone;
module.exports.HumanoidFactory = HumanoidFactory;

},{}],7:[function(require,module,exports){
function Tile(type, tileManager) {
    this.hp = 100;
    this.type = type;
    this.solid = true;
    this.tileManager = tileManager;

    this.draw = function(screenX, screenY) {
        var spriteSheet = resourceManager.getResource("tiles");
        switch (type) {
            case 1:
                ctx.drawImage(spriteSheet, 650, 0, 128, 128, screenX, screenY, this.tileManager.tileSize, this.tileManager.tileSize);
                break;
            case 2:
                ctx.drawImage(spriteSheet, 650, 130, 128, 128, screenX, screenY, this.tileManager.tileSize, this.tileManager.tileSize);
                break;
            case 3:
                ctx.drawImage(spriteSheet, 256, 650, 128, 128, screenX, screenY, this.tileManager.tileSize, this.tileManager.tileSize);
                break;
        }
    }

    this.update = function() {

    }
}

module.exports = Tile;
},{}],8:[function(require,module,exports){
var TileManager = function() {
    this.tileSize = 32;
    this.currentCamera = null;
    this.tiles = [
        []
    ];
}
TileManager.prototype.update = function() {};
TileManager.prototype.draw = function() {
    if (this.currentCamera != null) {
        //Drawing is based off screen offset so get a point near the center for a "camera"
        var cameraX = canvas.width / 2 - this.currentCamera.screenOffset.x;
        var cameraY = canvas.height / 2 - this.currentCamera.screenOffset.y;

        //Get min and max tiles.
        var cameraMinX = Math.floor((cameraX - canvas.width / 2) / this.tileSize);
        var cameraMaxX = Math.floor((cameraX + canvas.width / 2) / this.tileSize);
        var cameraMinY = Math.floor((cameraY - canvas.height / 2) / this.tileSize);
        var cameraMaxY = Math.floor((cameraY + canvas.height / 2) / this.tileSize);
        for (var y = cameraMinY; y <= cameraMaxY; y++) {
            for (var x = cameraMinX; x <= cameraMaxX; x++) {
                if (!this.tiles[y]) this.tiles[y] = []
                var tile = this.tiles[y][x];
                if (tile != null) {
                    tile.draw((x * this.tileSize) + this.currentCamera.screenOffset.x, (y * this.tileSize) + this.currentCamera.screenOffset.y);
                }
            }

        }
    }
};
TileManager.prototype.setCamera = function(camera) {
    this.currentCamera = camera;
};
TileManager.prototype.addTile = function(x, y, tile) {
    tile.tileManager = this;
    if (!this.tiles[y]) this.tiles[y] = []
    this.tiles[y][x] = tile;
};
TileManager.prototype.removeTile = function(x, y) {
    this.tiles[y][x] = undefined;
};
TileManager.prototype.moveTile = function(x1, y1, x2, y2) {
    this.addTile(x2, y2, this.tiles[y1, x1]);
    this.removeTile(x1, y1);
};
TileManager.prototype.tileAt = function(x, y) {
    return tiles[y][x];
}
TileManager.prototype.tileIsSolid = function(x, y) {
    if (this.tiles[y][x] == undefined) {
        return false;
    }
    return this.tiles[y][x].solid;
}

module.exports = TileManager;
},{}],9:[function(require,module,exports){
//http://gamedevelopment.tutsplus.com/tutorials/generate-random-cave-levels-using-cellular-automata--gamedev-9664
var Tile = require("./Tile")
WorldBuilder = function(tileManager) {
    this.dirtDepth = 100;
    this.stoneDepth = 100;
    this.chanceToStartAlive = .60;
    this.tileManager = tileManager;
}
WorldBuilder.prototype.generate = function(width, height) {
    var startY = 100;
    for (var x = 0; x < width; x++) {
        currentY = startY + 1;
        //Grass section
        this.tileManager.addTile(x, startY, new Tile(1));

        //Dirt Section
        while (currentY < startY + this.dirtDepth) {
            if (Math.random() < this.chanceToStartAlive + .20) {
                this.tileManager.addTile(x, currentY, new Tile(2));
            }
            currentY++;
        }

        //Stone Section
        while (currentY < startY + this.dirtDepth + this.stoneDepth) {
            if (Math.random() < this.chanceToStartAlive) {
                this.tileManager.addTile(x, currentY, new Tile(3));
            }
            currentY++;
        }

        startY += Math.ceil((Math.random() * 2 - 1));
    }

    for (var i = 0; i < 100; i++) {
        this.automaStep();
    }
}

WorldBuilder.prototype.countNeighbors = function(x, y) {
    var count = 0;
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            var neighbour_x = x + i;
            var neighbour_y = y + j;
            if (!this.tileManager.tiles[neighbour_y]) this.tileManager.tiles[neighbour_y] = []
            if (i == 0 && j == 0) {

            } else if (neighbour_x < 0 || neighbour_y < 0 || neighbour_y >= this.tileManager.tiles.length || neighbour_x >= this.tileManager.tiles[y].length) {
                count++;
            } else if (this.tileManager.tiles[neighbour_y][neighbour_x] != undefined) {
                count++;
            }
        }
    }

    return count;
}

WorldBuilder.prototype.automaStep = function() {
    deathLimit = 4;
    birthLimit = 5;
    for (var y = 0; y < this.tileManager.tiles.length; y++) {
        if (!this.tileManager.tiles[y]) this.tileManager.tiles[y] = []
        for (var x = 0; x < this.tileManager.tiles[y].length; x++) {
            var neighbourCount = this.countNeighbors(x, y);
            if (this.tileManager.tiles[y][x] != undefined) {
                if (neighbourCount < deathLimit) {
                    this.tileManager.removeTile(x, y);
                }
            } else {

                if (neighbourCount > birthLimit) {
                    this.tileManager.addTile(x, y, new Tile(2));
                }
            }
        }
    }
}


module.exports = WorldBuilder;

},{"./Tile":7}],10:[function(require,module,exports){
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

var Bone = require("./Modules/Skeleton").Bone;

var Factory = require("./Modules/Skeleton").HumanoidFactory;
var Animator = require("./Modules/Animator");

humanoid = Factory();
humanoid.localPosition = {x:200,y:300};

humanoidAnimator = new Animator(humanoid);


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
        worldBuilder.generate(10, 10);

        this.player.init();
        tileManager.setCamera(this.player.camera);
    },
    render: function(tFrame)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tileManager.draw();
        this.player.draw();

        humanoid.draw();
    },
    update: function()
    {
        this.player.update();
        tileManager.update();

        humanoidAnimator.animate()
        humanoid.update();

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

},{"./Modules/Animator":1,"./Modules/Camera":2,"./Modules/Input":3,"./Modules/Player":4,"./Modules/ResourceManager":5,"./Modules/Skeleton":6,"./Modules/Tile":7,"./Modules/TileManager":8,"./Modules/WorldBuilder":9}]},{},[10]);
