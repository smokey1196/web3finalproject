import Enemy from '../enemy';

export default class Bat extends Enemy{
    constructor(game: Phaser.Game, x: number, y: number, key: string){
        super(game, x, y, key);

        this.health = 5;
        this.knockbackSpeed = 200;
        this.movementSpeed = 160;
        this.vision = 400;

        //Create animations
        this.animations.add('move', [50,51,52,53,54,55,56,57,58,59]);
        this.animations.add('death', [90,91,92,93,94,95,96,97,98,99]);
        this.animations.play('move', 10, true);

        //Set Physics
        game.physics.arcade.enable(this);
        this.anchor.setTo(0.5);
        this.body.setSize(13, 14, 9, 6);
        this.scale.setTo(2);
    }
}
