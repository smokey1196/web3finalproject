import Enemy from '../enemy';

export default class Slime extends Enemy{
    hasSplit: boolean;
    constructor(game: Phaser.Game, x: number, y: number, key: any, split: boolean){
        super(game, x, y, key);

        this.hasSplit = split;
        this.health = 10;
        this.knockbackSpeed = 200;
        this.movementSpeed = 100;

        //Create animations
        this.animations.add('move', [21,22,23,24,25,26,27,28,29,30]);
        this.animations.play('move', 10, true);

        //Set Physics
        game.physics.arcade.enable(this);
        this.anchor.setTo(0.5);
        this.body.setSize(13, 14, 9, 17);
        this.scale.setTo(2);
    }
}
