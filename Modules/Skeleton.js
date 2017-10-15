function lengthDir_x(len, dir) {
    var rads = dir * (Math.PI / 180);
    return Math.cos(rads) * len;
}

function lengthDir_y(len, dir) {
    var rads = dir * (Math.PI / 180);
    return Math.sin(rads) * len;
}

var Bone = function() {
    this.name = "";
    this.localPosition = {
        x: 0,
        y: 0
    };
    this.position = {
        x: 0,
        y: 0
    };
    this.flipped = 0;
    this.localAngle = 0;
    this.angle = 0;
    this.length = 0;
    this.parent = null;
    this.children = [];
    this.zindex = 0; //Relative to parent
    this.image = "characters";
    this.imageLocation = {
        x: 0,
        y: 0
    };
    this.imageHeight = 128;
    this.imageWidth = 128;
    this.imageOffset = {
        x: 0,
        y: 0
    };
}

Bone.prototype.flip = function(flip) {
  if (this.flipped !== flip) {
    this.flipped = flip
    this.zindex = this.zindex * -1
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].flip(flip)
    }
    this.resortChildren()
  }
}

Bone.prototype.resortChildren = function() {
  this.children.sort(function(a, b) {
      return -(a.zindex - b.zindex)
  });
  for (var i = 0; i < this.children.length; i++) {
      this.children[i].resortChildren()
  }
}

Bone.prototype.addChild = function(child) {
    this.children.push(child);
    child.parent = this;
    this.children.sort(function(a, b) {
        return -(a.zindex - b.zindex)
    });
}


Bone.prototype.getChild = function(name) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].name == name) {
            return this.children[i];
        }
    }
}

Bone.prototype.update = function() {
    if (this.localAngle > 360) {
        this.localAngle -= 360;
    }

    if (this.localAngle < 0) {
        this.localAngle += 360;
    }
    if (this.parent != null) {
        this.angle = this.localAngle + this.parent.angle ;
        //Do this to preserve the angle for animation purposes since angle will get set via
        //data from a file.
        var worldAngle = this.angle;
        if (this.flipped) {
          worldAngle = 180 - this.angle;
        }

        this.position.x = lengthDir_x(this.length, worldAngle) + this.parent.position.x;
        this.position.y = lengthDir_y(this.length, worldAngle) + this.parent.position.y;
    } else {
        this.angle = this.localAngle;
        this.position = this.localPosition
    }

    for (var child in this.children) {
        this.children[child].update();
    }
}

Bone.prototype.draw = function() {
    var drawnSelf = false;

    for (var child in this.children) {
        if (!drawnSelf && this.zindex < this.children[child].zindex) {
            this.drawImage();
            drawnSelf = true;
        }

        this.children[child].draw();
    }

    if (!drawnSelf) {
        this.drawImage();
    }
}

Bone.prototype.drawImage = function() {
    if (this.parent != null) {
        var spriteSheet = resourceManager.getResource(this.image);
        ctx.save();
        ctx.translate(this.parent.position.x, this.parent.position.y);
        if (this.flipped) {
          ctx.scale(-1,1);
        }
        ctx.rotate((this.angle - 90) * Math.PI / 180);
        ctx.drawImage(spriteSheet, this.imageLocation.x, this.imageLocation.y, this.imageWidth, this.imageHeight, this.imageOffset.x, this.imageOffset.y, this.imageWidth / 2, this.imageHeight / 2);
        ctx.restore();


        ctx.beginPath();
        ctx.moveTo(this.parent.position.x, this.parent.position.y);
        ctx.lineTo(this.position.x, this.position.y);
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
    }
}

var HumanoidFactory = function() {
    var root = new Bone();
    var head = new Bone();

    head.length = 10;
    head.localAngle = 90;
    head.name = "head";
    head.imageHeight = 64;
    head.imageWidth = 64;
    head.imageLocation = {
        x: 0,
        y: 344
    };
    head.imageOffset = {
        x: -16,
        y: -32
    };
    root.addChild(head);
    head.zindex = -1;

    var body = new Bone();
    body.length = 25;
    body.localAngle = 90;
    body.name = "body";
    body.imageHeight = 59;
    body.imageWidth = 44;
    body.imageLocation = {
        x: 88,
        y: 150
    };
    body.imageOffset = {
        x: -11,
        y: 0
    };
    body.zindex = 0;
    root.addChild(body);


    var rightArm = new Bone();
    rightArm.length = 25;
    rightArm.localAngle = 90;
    rightArm.name = "rightArm";
    rightArm.imageHeight = 66;
    rightArm.imageWidth = 28;
    rightArm.imageLocation = {
        x: 158,
        y: 401
    };
    rightArm.imageOffset = {
        x: -7,
        y: 0
    };
    rightArm.zindex = 1;
    root.addChild(rightArm);

    var handItem = new Bone();
    handItem.length = 25;
    handItem.localAngle = 90;
    handItem.name = "rightArm2";
    handItem.imageHeight = 66;
    handItem.imageWidth = 28;
    handItem.imageLocation = {
        x: 158,
        y: 401
    };
    handItem.imageOffset = {
        x: -7,
        y: 0
    };
    handItem.zindex = 1;
    rightArm.addChild(handItem)

    var leftArm = new Bone();
    leftArm.length = 25;
    leftArm.localAngle = 90;
    leftArm.name = "leftArm";
    leftArm.imageHeight = 66;
    leftArm.imageWidth = 28;
    leftArm.imageLocation = {
        x: 158,
        y: 401
    };
    leftArm.imageOffset = {
        x: -7,
        y: 0
    };
    leftArm.zindex = -2;
    root.addChild(leftArm);

    var leftLeg = new Bone();
    leftLeg.length = 25;
    leftLeg.localAngle = 0;
    leftLeg.name = "leftLeg";
    leftLeg.imageHeight = 56;
    leftLeg.imageWidth = 28;
    leftLeg.imageLocation = {
        x: 134,
        y: 139
    };
    leftLeg.imageOffset = {
        x: -7,
        y: 0
    };
    leftLeg.zindex = 1;
    body.addChild(leftLeg);

    var rightLeg = new Bone();
    rightLeg.length = 25;
    rightLeg.localAngle = 0;
    rightLeg.name = "rightLeg";
    rightLeg.imageHeight = 56;
    rightLeg.imageWidth = 28;
    rightLeg.imageLocation = {
        x: 134,
        y: 139
    };
    rightLeg.imageOffset = {
        x: -7,
        y: 0
    };
    rightLeg.zindex = 1;
    body.addChild(rightLeg);

    return root;
}


module.exports.Bone = Bone;
module.exports.HumanoidFactory = HumanoidFactory;
