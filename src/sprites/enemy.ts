export default class Enemy extends Phaser.Sprite{

    movementSpeed: number;
    attack: number;
    defence: number;
    knockbackSpeed: number;
    hit: boolean = false;
    vision: number;

    constructor(game: Phaser.Game, x: number, y: number, key: any){
        super(game, x, y, key);

        this.health = 100;
        this.attack = 5;
        this.defence = 0;
        this.movementSpeed = 200;
        this.knockbackSpeed = 300;
        this.vision = 200;

        game.physics.arcade.enable(this);

    }
    track(player: Phaser.Sprite){
        if (Phaser.Math.distance(player.x, player.y, this.x, this.y) < this.vision && !this.hit){
            this.game.physics.arcade.moveToObject(this, player, this.movementSpeed);
        } else { 
            //make sure the enemy velocity is not being set to zero during knockback
            if(this.body.velocity.y !== this.knockbackSpeed && this.body.velocity.y !== -this.knockbackSpeed &&
                this.body.velocity.x !== this.knockbackSpeed && this.body.velocity.x !== -this.knockbackSpeed){
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }
        }
    }
    knockback(){
        if(this.body.velocity.y !== this.knockbackSpeed && this.body.velocity.y !== -this.knockbackSpeed &&
            this.body.velocity.x !== this.knockbackSpeed && this.body.velocity.x !== -this.knockbackSpeed){
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }

        //knockback for if Enemy is beneath player
        if(this.body.touching.up){
            this.body.velocity.y = this.knockbackSpeed;

        }
        //knockback for if Enemy is above player
        if(this.body.touching.down){
            this.body.velocity.y = -this.knockbackSpeed;

        }
        //knockback for if Enemy is right player
        if(this.body.touching.left){
            this.body.velocity.x = this.knockbackSpeed;

        }
        //knockback for if Enemy is left player
        if(this.body.touching.right){
            this.body.velocity.x = -this.knockbackSpeed;

        }
        this.game.time.events.add(500, function(){
            this.hit = false;
        }, this);
    }
}
