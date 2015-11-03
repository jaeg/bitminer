//http://gamedevelopment.tutsplus.com/tutorials/generate-random-cave-levels-using-cellular-automata--gamedev-9664
var Tile = require("./Tile")
WorldBuilder = function(tileManager)
{
    this.dirtDepth = 100;
    this.stoneDepth = 100;
    this.chanceToStartAlive = .60;
    this.tileManager = tileManager;
}
WorldBuilder.prototype.generate = function(width, height)
{
        var startY = 100;
        for (var x = 0; x < width; x++)
        {
            currentY = startY + 1;
            //Grass section
            this.tileManager.addTile(x, startY, new Tile(1));

            //Dirt Section
            while (currentY < startY + this.dirtDepth)
            {
                if (Math.random() < this.chanceToStartAlive + .20)
                {
                    this.tileManager.addTile(x, currentY, new Tile(2));
                }
                currentY++;
            }

            //Stone Section
            while (currentY < startY + this.dirtDepth + this.stoneDepth)
            {
                if (Math.random() < this.chanceToStartAlive)
                {
                    this.tileManager.addTile(x, currentY, new Tile(3));
                }
                currentY++;
            }

            startY += Math.ceil((Math.random() * 2 - 1));
        }

        for (var i = 0; i < 100; i++)
        {
            this.automaStep();
        }
}

WorldBuilder.prototype.countNeighbors = function(x, y)
{
        var count = 0;
        for (var i = -1; i < 2; i++)
        {
            for (var j = -1; j < 2; j++)
            {
                var neighbour_x = x + i;
                var neighbour_y = y + j;
                if (!this.tileManager.tiles[neighbour_y]) this.tileManager.tiles[neighbour_y] = []
                if (i == 0 && j == 0)
                {

                }
                else if (neighbour_x < 0 || neighbour_y < 0 || neighbour_y >= this.tileManager.tiles.length || neighbour_x >= this.tileManager.tiles[y].length)
                {
                    count++;
                }
                else if (this.tileManager.tiles[neighbour_y][neighbour_x] != undefined)
                {
                    count++;
                }
            }
        }

        return count;
}

WorldBuilder.prototype.automaStep = function()
{
        deathLimit = 4;
        birthLimit = 5;
        for (var y = 0; y < this.tileManager.tiles.length; y++)
        {
            if (!this.tileManager.tiles[y]) this.tileManager.tiles[y] = []
            for (var x = 0; x < this.tileManager.tiles[y].length; x++)
            {
                var neighbourCount = this.countNeighbors(x, y);
                if (this.tileManager.tiles[y][x] != undefined)
                {
                    if (neighbourCount < deathLimit)
                    {
                        this.tileManager.removeTile(x, y);
                    }
                }
                else
                {

                    if (neighbourCount > birthLimit)
                    {
                        this.tileManager.addTile(x, y, new Tile(2));
                    }
                }
            }
        }
}


module.exports = WorldBuilder;