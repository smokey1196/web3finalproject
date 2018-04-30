import Enemy from '../enemy';

export default class Slime extends Enemy{
    
    constructor(game: Phaser.Game, x: number, y: number, key: any, type: string){
        super(game, x, y, key);

        if(type === 'blue'){
            this.health = 15;
            this.knockbackSpeed = 200;
            this.movementSpeed = 100;
            this.vision = 350;

            //Create animations
            this.animations.add('move', [70,71,72,73,74,75,76,77,78,79]);
            this.animations.add('death', [90,91,92,93,94,95,96,97,98,99]);
            this.animations.play('move', 10, true);

            //Set Physics
            game.physics.arcade.enable(this);
            this.anchor.setTo(0.5);
            this.body.setSize(13, 14, 9, 17);
            this.scale.setTo(2);

        } else if(type === 'boss') {
            this.health = 30;
            this.attack = 20;
            this.knockbackSpeed = 100;
            this.movementSpeed = 80;
            this.vision = 500;

            //Create animations
            this.animations.add('move', [120,121,122,123,124,125,126,127,128,129]);
            this.animations.add('death', [140,141,142,143,144,145,146,147,148,149]);
            this.animations.play('move', 10, true);

            //Set Physics
            game.physics.arcade.enable(this);
            this.anchor.setTo(0.5);
            this.body.setSize(13, 14, 9, 7);
            this.scale.setTo(4);

        } else {
            this.health = 10;
            this.knockbackSpeed = 200;
            this.movementSpeed = 100;
            this.vision = 300;

            //Create animations
            this.animations.add('move', [20,21,22,23,24,25,26,27,28,29]);
            this.animations.add('death', [40,41,42,43,44,45,46,47,48,49]);
            this.animations.play('move', 10, true);

            //Set Physics
            game.physics.arcade.enable(this);
            this.anchor.setTo(0.5);
            this.body.setSize(13, 14, 9, 17);
            this.scale.setTo(2);
        }
        
    }
}
