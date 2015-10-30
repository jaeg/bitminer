function lengthDir_x(len, dir){
  var rads = dir * (Math.PI / 180);
  return Math.cos(rads)*len;
}

function lengthDir_y(len,dir){
    var rads = dir * (Math.PI / 180);
    return -Math.sin(rads)*len;
}
var Skeleton = function(){
    this.rootBone = new Bone();
    this.bones = {};
}
Skeleton.prototype.addChildBone = function(parent,bone)
{
    this.bones[bone.name] = bone;
    parent.children[bone.name] = bone;
    bone.parent = parent;
}

Skeleton.prototype.draw = function()
{
    for (var bone in this.bones)
    {
        this.bones[bone].draw();   
    }
}

var Bone = function(coords, angle, length, name){
    this.name = name;
    this.coords = coords || {x:0,y:0};
    this.angle = angle || 10;
    this.length = length || 0;
    this.children = {};
    this.parent = null;
}

Bone.prototype.translate = function(x,y)
{
    this.coords.x += x;
    this.coords.y += y;
    for (var child in this.children)
    {
        this.children[child].translate(x,y);
    }
}

Bone.prototype.rotate = function(angle)
{
    this.angle = angle;
    for (var child in this.children)
    {
        //this.children[child].rotate(angle);
        var childBone = this.children[child];
        this.children[child].coords= {childBone.coords.x + lengthDir_x(childBone.length,angle),childBone.coords.y + lengthDir_y(childBone.length,angle));
    }
}

Bone.prototype.draw = function(){
    if (this.parent != null)
    {
        ctx.strokeStyle='#00cc00';
        ctx.beginPath();
        ctx.moveTo(this.parent.coords.x,this.parent.coords.y);
        ctx.lineTo(this.coords.x,this.coords.y);
        ctx.stroke();
        ctx.strokeStyle='black';
    }
}

module.exports.Skeleton = Skeleton;
module.exports.Bone = Bone;