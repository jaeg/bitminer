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