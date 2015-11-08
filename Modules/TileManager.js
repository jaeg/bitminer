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