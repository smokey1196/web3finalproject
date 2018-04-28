export default class Arrow extends Phaser.Sprite {
    vel: number;

    constructor(game: Phaser.Game, x: number, y: number, dir: string, velocity: number){
        super(game, x, y, 'arrow');

        //physics properties
        this.anchor.setTo(0.5);
        this.vel = velocity;

        this.game.physics.arcade.enable(this);
        this.changeDir(dir);
    }

    changeDir(dir: string){
        //body is not being rotated need to check that out.

        //make sure the arrow is facing right to start with.
        this.angle = this.previousRotation;
        this.scale.x = 1;
        switch (dir){
            case 'l':
                this.body.velocity.x = -this.vel;
                this.scale.x = -1;
                break;
            case 'r':
                this.body.velocity.x = this.vel;
                break;
            case 'u':
                this.body.velocity.y = -this.vel;
                this.angle = 270;
                break;
            case 'd':
                this.body.velocity.y = this.vel;
                this.angle = 90;
                break;
            default:
            console.log('No arrow');
        }
    }
}
