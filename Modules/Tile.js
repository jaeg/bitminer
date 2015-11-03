function Tile(type, tileManager)
{
    this.hp = 100;
    this.type = type;
    this.solid = true;
    this.tileManager = tileManager;

    this.draw = function(screenX, screenY)
    {
        var spriteSheet = resourceManager.getResource("tiles");
        switch (type)
        {
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