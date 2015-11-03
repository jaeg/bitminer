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

module.exports = ResourceManager;