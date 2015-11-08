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