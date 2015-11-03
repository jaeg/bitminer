function lengthDir_x(len, dir){
  var rads = dir * (Math.PI / 180);
  return Math.cos(rads)*len;
}

function lengthDir_y(len,dir){
    var rads = dir * (Math.PI / 180);
    return -Math.sin(rads)*len;
}

var Bone = function(){
    this.localPosition = {x:0,y:0};
    this.position = {x:0, y:0};
    this.localAngle = 0;
    this.angle = 0;
    this.length = 0;
    this.parent = null;
}

Bone.prototype.updatePosition = function()
{
    if (parent != null)
    {
        this.position = {x:this.localPosition.x+this.parent.position.x,y:this.localPosition.y+this.parent.position.y};
    }
    else
    {
     this.position = this.localPosition;   
    }
}

Bone.prototype.draw = function()
{
    if (this.parent != null)
    {
        //console.log(this);
        this.angle = this.localAngle + this.parent.angle;
        this.position.x = lengthDir_x(this.length,this.angle) + this.parent.position.x;
        this.position.y = lengthDir_y(this.length,this.angle) + this.parent.position.y;
        
        ctx.beginPath();
        ctx.moveTo(this.parent.position.x,this.parent.position.y);
        ctx.lineTo(this.position.x,this.position.y);
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
    }
    else
    {
        this.angle = this.localAngle;
        this.position = this.localPosition
    }
    
}
module.exports.Bone = Bone;