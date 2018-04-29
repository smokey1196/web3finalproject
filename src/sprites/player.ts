import Arrow from './arrow';
import Item from './item';

export default class Player extends Phaser.Sprite{

    //Variables
    movementSpeed: number;
    attack: number;
    defence: number;
    cursors: Phaser.CursorKeys;
    spaceKey: Phaser.Key;
    playerState: number;
    shootingSpeed: number = 15; //frames per second 10 = 1 second
    arrowSpeed: number;
    gold: number;
    maxHealth: number = 80;
    attackFlag: number = 0; // 0 is not firing, 1 is aiming, and 2 is read to fire, tried with boolean didn't work needed three states.
    immuneFlag: boolean = false;

    playerArrows: Phaser.Group;

    //Constants
    PLAYER_STATE = {
        MOVING_LEFT: 0,
        MOVING_RIGHT: 1,
        MOVING_UP: 2,
        MOVING_DOWN: 3
    };
    
    constructor(game: Phaser.Game, x: number, y: number, key: any){
        super(game, x, y, key, 91);

        //Player Stats
        this.health = 80;
        this.attack = 5;
        this.defence = 0;
        this.movementSpeed = 500;
        this.arrowSpeed = 400;
        this.gold = 0;
        this.playerState = this.PLAYER_STATE.MOVING_RIGHT;

        //Player Controls
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //Player Physics properties
        this.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this);
        this.game.camera.follow(this);
        this.body.setSize(25,42,19.5,19);

        //create group for arrows and enable physics
        this.playerArrows = this.game.add.group();
        this.playerArrows.enableBody = true;

        //Aim animations
        this.animations.add('aimUp', [53,0,1,2,3,4,5,6,7,8]);
        this.animations.add('aimDown', [79,26,27,28,29,30,31,32,33,34]);
        this.animations.add('aimLeft', [65,13,14,15,16,17,18,19,20, 21]);
        this.animations.add('aimRight', [91,39,40,41,42,43,44,45,46,47]);

        //Shoot animations
        this.animations.add('shootUp', [53, 7, 6, 5, 4, 9]);
        this.animations.add('shootDown', [79, 33, 32, 31, 30, 35]);
        this.animations.add('shootLeft', [65, 20, 19, 18, 17, 22]);
        this.animations.add('shootRight', [91, 46, 45, 44, 43, 48]);

        //Move animations
        this.animations.add('moveUp', [53,54,55,56,57,58,59,60]);
        this.animations.add('moveDown', [79,80,81,82,83,84,85,86]);
        this.animations.add('moveLeft', [65,66,67,68,69,70,71,72,73]);
        this.animations.add('moveRight', [91,92,93,94,95,96,97,98,99]);

        //listen for the spacebar for shooting don't put in updateS
        this.spaceKey.onDown.add(this.drawBow, this, 0);
        this.spaceKey.onUp.add(this.shoot, this, 0);

    }

    update(){

        if(this.attackFlag === 0) {
            this.movePlayer();
            this.moveAnimations();
        } else {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }
        

    }

    drawBow(){
        this.attackFlag = 1;
        let aim: Phaser.Animation;

        if(this.playerState === this.PLAYER_STATE.MOVING_LEFT){
            console.log('shooting left');
            aim = this.animations.play('aimLeft', this.shootingSpeed, false);
        }
        if(this.playerState === this.PLAYER_STATE.MOVING_RIGHT){
            console.log('shooting right');
            aim = this.animations.play('aimRight', this.shootingSpeed, false);
        }
        if(this.playerState === this.PLAYER_STATE.MOVING_UP){
            console.log('shooting up');
            aim = this.animations.play('aimUp', this.shootingSpeed, false);
        }
        if(this.playerState === this.PLAYER_STATE.MOVING_DOWN){
            console.log('shooting down');
            aim = this.animations.play('aimDown', this.shootingSpeed, false);
        }

        //if the the animation finishes then we can shoot using an arrow function
        aim.onComplete.addOnce(()=>{
            this.attackFlag = 2;
        }, this);
    }

    shoot(){
        //if we can shoot then shoot
        
        if(this.attackFlag === 2){
            let fire: Phaser.Animation;
            let dir: string;

            if(this.playerState === this.PLAYER_STATE.MOVING_LEFT){
                fire = this.animations.play('shootLeft', 45, false);
                dir = 'l';
            }
             if(this.playerState === this.PLAYER_STATE.MOVING_RIGHT){
                 fire = this.animations.play('shootRight', 45, false);
                 dir = 'r';
             }
            if(this.playerState === this.PLAYER_STATE.MOVING_UP){                
                fire = this.animations.play('shootUp', 45, false);
                dir = 'u';
            }
            if(this.playerState === this.PLAYER_STATE.MOVING_DOWN){
                fire = this.animations.play('shootDown', 45, false);
                dir = 'd';
            }

            fire.setFrame(1, true);
            fire.onComplete.addOnce(()=>{
                this.attackFlag = 0;
                //fire an arrow based on direction
                this.createArrow(dir);
            }), this;
        } else{
            //reset attackflag
            this.attackFlag = 0;
        } 
    }

    createArrow(dir: string){
        //if an arrow already exists but is dead get that one
        let arrow: Arrow = this.playerArrows.getFirstExists(false);
        console.log('creating arrow!');
        if(!arrow){
            //else create a new one
            switch (dir){
                case 'l':
                    arrow = new Arrow(this.game, this.left, this.y, dir, this.arrowSpeed);
                    console.log('creating new arrow! l');
                    break;
                case 'r':
                    arrow = new Arrow(this.game, this.right, this.y, dir, this.arrowSpeed);
                    console.log('creating new arrow! r');
                    break;
                case 'u':
                    arrow = new Arrow(this.game, this.x, this.top, dir, this.arrowSpeed);
                    console.log('creating new arrow! u');
                    break;
                case 'd':
                    arrow = new Arrow(this.game, this.x, this.bottom, dir, this.arrowSpeed);
                    console.log('creating new arrow! d');
                    break;
                default:
                console.log('No arrow');
            }
        } else{
            //reset position and direction
            console.log('reviving arrow');
            switch (dir){
                case 'l':
                    arrow.reset(this.left, this.y);
                    break;
                case 'r':
                    arrow.reset(this.right, this.y);
                    break;
                case 'u':
                    arrow.reset(this.x, this.top);
                    break;
                case 'd':
                    arrow.reset(this.x, this.bottom);
                    break;
                default:
            }

            arrow.changeDir(dir);
        }
        this.playerArrows.add(arrow);
    }

    collectItem(item: Item){
        //if item has health value add it to player health
        this.health += item.data.health ? item.data.health : 0;
        if(this.health > this.maxHealth){
            this.health = this.maxHealth;
        }
        //if item has gold value add it to player
        this.gold += item.data.gold ? item.data.gold : 0;

        item.kill();

    }

    //Move the player and set the playerstate for other methods
    movePlayer(){
        if(this.cursors.up.isDown){
            this.playerState = this.PLAYER_STATE.MOVING_UP;
            this.body.velocity.x = 0;
            this.body.velocity.y = -this.movementSpeed;

        } else if(this.cursors.down.isDown){
            this.playerState = this.PLAYER_STATE.MOVING_DOWN;
            this.body.velocity.x = 0;
            this.body.velocity.y = this.movementSpeed;

        } else if(this.cursors.left.isDown){
            this.playerState = this.PLAYER_STATE.MOVING_LEFT;
            this.body.velocity.x = -this.movementSpeed;
            this.body.velocity.y = 0;
        } else if(this.cursors.right.isDown){
            this.playerState = this.PLAYER_STATE.MOVING_RIGHT;
            this.body.velocity.x = this.movementSpeed;
            this.body.velocity.y = 0;
        } else{
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }
    }

    moveAnimations(){
        //play the animations for each state as long as there is velocity on the body
        if(this.playerState === this.PLAYER_STATE.MOVING_UP && this.body.velocity.y !== 0){
            this.animations.play('moveUp', 15, true);

        }else if(this.playerState === this.PLAYER_STATE.MOVING_DOWN && this.body.velocity.y !== 0){
            this.animations.play('moveDown', 15, true);

        }else if(this.playerState === this.PLAYER_STATE.MOVING_LEFT && this.body.velocity.x !== 0){
            this.animations.play('moveLeft', 15, true);

        }else if(this.playerState === this.PLAYER_STATE.MOVING_RIGHT && this.body.velocity.x !== 0){
            this.animations.play('moveRight', 15, true);

        } else{
            //stops the current animation and resets the frame back to the starting frame.
            this.animations.stop(null, true);
        }
    } 
}
