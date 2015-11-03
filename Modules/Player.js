var Camera = require("./Camera");
var Key = require("./Input").Key;
var Mouse = require("./Input").Mouse;
var Player = function(tileManager)
{
    this.x = 0;
    this.y = 100; //Player x is in screen coords not array coords..
    this.camera = '';
    this.xspeed = 0;
    this.yspeed = 0;
    this.tileManager = tileManager
}
Player.prototype.init = function()
{
    this.camera = new Camera(this, 20, this.tileManager);
};
Player.prototype.update = function()
{
    this.camera.update();
    if (Key.isDown(Key.UP)) this.moveUp();
    if (Key.isDown(Key.LEFT)) this.moveLeft();
    if (Key.isDown(Key.DOWN)) this.moveDown();
    if (Key.isDown(Key.RIGHT)) this.moveRight();

    if (this.xspeed != 0 || this.yspeed !=0)
    {
        
        this.camera.moveSpeedX = Math.abs(this.tileManager.tileSize*this.xspeed);
        this.camera.moveSpeedY = Math.abs(this.tileManager.tileSize*this.yspeed);
    }

    this.x += this.xspeed;
    this.y += this.yspeed;

    //http://www.emanueleferonato.com/2014/01/17/creation-of-an-html5-tile-based-platform-game-with-no-engines-behind-pure-code/
    var baseCol = Math.floor(this.x);
    var baseRow = Math.floor(this.y);
    var rowOverlap = this.y % this.tileManager.tileSize
    
    if (this.xspeed > 0)
    {
        if ((this.tileManager.tileIsSolid(baseCol + 1, baseRow) && !this.tileManager.tileIsSolid(baseCol, baseRow) || this.tileManager.tileIsSolid(baseCol + 1, baseRow + 1) && !this.tileManager.tileIsSolid(baseCol, baseRow + 1)))
        {
            this.x = baseCol;
        }
    }

    if (this.xspeed < 0)
    {
        if ((!this.tileManager.tileIsSolid(baseCol + 1, baseRow) && this.tileManager.tileIsSolid(baseCol, baseRow) || !this.tileManager.tileIsSolid(baseCol + 1, baseRow + 1) && this.tileManager.tileIsSolid(baseCol, baseRow + 1)))
        {
            this.x = baseCol + 1;
        }
    }
    
        if (this.yspeed > 0)
    {
        if ((this.tileManager.tileIsSolid(baseCol, baseRow + 1) && !this.tileManager.tileIsSolid(baseCol, baseRow) || this.tileManager.tileIsSolid(baseCol + 1, baseRow + 1) && !this.tileManager.tileIsSolid(baseCol + 1, baseRow)))
        {
            this.y = baseRow;
        }
    }

    if (this.yspeed < 0)
    {
        if ((!this.tileManager.tileIsSolid(baseCol, baseRow + 1) && this.tileManager.tileIsSolid(baseCol, baseRow) || !this.tileManager.tileIsSolid(baseCol + 1, baseRow + 1) && this.tileManager.tileIsSolid(baseCol + 1, baseRow)))
        {
            this.y = baseRow + 1;
        }
    }

    this.xspeed = 0;
    this.yspeed = 0;


    //Mouse Stuff
    var tileX = Math.floor((Mouse.coords.x - this.camera.screenOffset.x)/this.tileManager.tileSize);
    var tileY = Math.floor((Mouse.coords.y - this.camera.screenOffset.y)/this.tileManager.tileSize);
    this.tileManager.removeTile(tileX,tileY);
};
Player.prototype.draw = function()
{
    var spriteSheet = resourceManager.getResource("tiles");
    ctx.drawImage(spriteSheet, 0, 0, 128, 128, (this.x * this.tileManager.tileSize) + this.camera.screenOffset.x, (this.y * this.tileManager.tileSize) + this.camera.screenOffset.y, 32, 32);
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

module.exports = Player;