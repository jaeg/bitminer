var Animator = function(skeleton) {
    this.skeleton = skeleton;
    this.tick = 0;
}

Animator.prototype.animate = function() {
    this.tick += .5;
    this.skeleton.getChild("body").getChild("leftLeg").localAngle += Math.cos(this.tick) * 10;
    this.skeleton.getChild("body").getChild("rightLeg").localAngle += -Math.cos(this.tick) * 10;

    this.skeleton.getChild("leftArm").localAngle += -Math.cos(this.tick) * 10;
    this.skeleton.getChild("rightArm").localAngle += Math.cos(this.tick) * 10;

    this.skeleton.getChild("head").localAngle += Math.cos(this.tick);

}

module.exports = Animator;