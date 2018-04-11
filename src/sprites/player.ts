export default class Player extends Phaser.Sprite{

    //Variables
    movementSpeed: number;
    attack: number;
    defence: number;
    cursors: Phaser.CursorKeys;
    spaceKey: Phaser.Key;
    playerState: number;

    //Constants
    PLAYER_STATE = {
        MOVING_LEFT: 0,
        MOVNG_RIGHT: 1,
        MOVING_UP: 2,
        MOVING_DOWN: 3
    };

    constructor(game: Phaser.Game, x: number, y: number, key: any){
        super(game, x, y, key);

        //Player Stats
        this.health = 100;
        this.attack = 5;
        this.defence = 0;
        this.movementSpeed = 150;
        this.playerState = 3;

        //Player Controls
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        


        //Player Physics properties
        this.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this);
        this.game.camera.follow(this);
        this.body.setSize(25,48,19.5,14);

        //Player animation
        this.frame = 78;

        this.animations.add('moveUp', [53,54,55,56,57,58,59,60]);
        this.animations.add('moveDown', [79,80,81,82,83,84,85,86]);
        this.animations.add('moveLeft', [65,66,67,68,69,70,71,72,73]);
        this.animations.add('moveRight', [91,92,93,94,95,96,97,98,99]);

    }

    update(){

        this.movePlayer();

        //shooting via the space bar
        this.spaceKey.onDown.add(this.shoot, this, 0);

        

    }

    shoot(){
        if(this.playerState === this.PLAYER_STATE.MOVING_LEFT){
            console.log('shooting left');
        }
        if(this.playerState === this.PLAYER_STATE.MOVNG_RIGHT){
            console.log('shooting right');
        }
        if(this.playerState === this.PLAYER_STATE.MOVING_UP){
            console.log('shooting up');
        }
        if(this.playerState === this.PLAYER_STATE.MOVING_DOWN){
            console.log('shooting down');
        }
    }

    movePlayer(){
        //Left and right animation and movement
        if (this.cursors.left.isDown) {
            //for diagonal animations, need to make sure animation doesn't play when up or dowm are held.
            if(!this.cursors.up.isDown && !this.cursors.down.isDown){
                this.animations.play('moveLeft', 15, true);
            }
            this.body.velocity.x = -this.movementSpeed;
            this.playerState = this.PLAYER_STATE.MOVING_LEFT;
        } else {
            this.animations.stop('moveLeft', true);
        } 
        if (this.cursors.right.isDown) {
            if(!this.cursors.up.isDown && !this.cursors.down.isDown){
                this.animations.play('moveRight', 15, true);
            }
            this.body.velocity.x = this.movementSpeed;
            this.playerState = this.PLAYER_STATE.MOVNG_RIGHT;
        } else {
            this.animations.stop('moveRight', true);
        }
        if(!this.cursors.left.isDown && !this.cursors.right.isDown || 
            this.cursors.left.isDown && this.cursors.right.isDown){
            this.body.velocity.x = 0;
        }
        
        //Up and down animation and movement
        if (this.cursors.up.isDown) {
            this.animations.play('moveUp', 15, true);
            this.body.velocity.y = -this.movementSpeed;
            this.playerState = this.PLAYER_STATE.MOVING_UP;
        } else {
            this.animations.stop('moveUp', true);
        }
        if (this.cursors.down.isDown) {
            this.body.velocity.y = this.movementSpeed;
            this.animations.play('moveDown', 15, true);
            this.playerState = this.PLAYER_STATE.MOVING_DOWN;
        } else {
            this.animations.stop('moveDown', true);
        }
        if(!this.cursors.down.isDown && !this.cursors.up.isDown ||
            this.cursors.down.isDown && this.cursors.up.isDown){
            this.body.velocity.y = 0;
        }
    }
}
