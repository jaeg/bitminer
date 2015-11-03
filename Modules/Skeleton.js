function lengthDir_x(len, dir){
  var rads = dir * (Math.PI / 180);
  return Math.cos(rads)*len;
}

function lengthDir_y(len,dir){
    var rads = dir * (Math.PI / 180);
    return -Math.sin(rads)*len;
}



var Bone = function(){
    this.name = "";
    this.localPosition = {x:0,y:0};
    this.position = {x:0, y:0};
    this.localAngle = 0;
    this.angle = 0;
    this.length = 0;
    this.parent = null;
    this.children = [];
}

Bone.prototype.addChild = function(child)
{
    this.children[child.name] = child;
    child.parent = this;
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
    //console.log(this);
    if (this.parent != null)
    {
        
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
    
    for (var child in this.children)
    {
        this.children[child].draw();   
    }
    
}

var HumanoidFactory = function()
{
    var root = new Bone();
    var head = new Bone();
    head.length = 20;
    head.localAngle = 90;
    head.name = "head";
    root.addChild(head);
    
    var body = new Bone();
    body.length = 50;
    body.localAngle = 270;
    body.name = "body";
    root.addChild(body);
    
    var rightArm = new Bone();
    rightArm.length = 50;
    rightArm.localAngle = 0;
    rightArm.name = "rightArm";
    root.addChild(rightArm);
    
    var leftArm = new Bone();
    leftArm.length = 50;
    leftArm.localAngle = 0;
    leftArm.name = "leftArm";
    root.addChild(leftArm);
    
    var leftLeg = new Bone();
    leftLeg.length = 50;
    leftLeg.localAngle = 0;
    leftLeg.name = "leftLeg";
    body.addChild(leftLeg);
    
    var rightLeg = new Bone();
    rightLeg.length = 50;
    rightLeg.localAngle = 0;
    rightLeg.name = "rightLeg";
    body.addChild(rightLeg);
    
    return root;
}
module.exports.Bone = Bone;
module.exports.HumanoidFactory = HumanoidFactory;