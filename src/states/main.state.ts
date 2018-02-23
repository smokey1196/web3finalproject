'use strict';
/** Imports */
import State from './state';
import Map from '../MapGen/Map';

// The main state of the game
export default class MainState extends State {

  player: Phaser.Sprite;
  map: Map;
  cursors: Phaser.CursorKeys;

  enemy1: Phaser.Sprite;
  enemy2: Phaser.Sprite;

  create(): void {
    // Phaser supports some physical engines (p2, box2d, ninja and arcate).
    // For our game, we don't need a strong physical simulation, so we'll choose
    // `arcade` model.
    this.game.world.setBounds(0, 0, 3200, 2400);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.map = new Map(this.game, 'floor', 'wall', 3, 5, 20);
    this.map.generateMap(true);

    this.player = this.game.add.sprite(this.map.roomArray[0].centerX, this.map.roomArray[0].centerY, 'player');  
    this.player.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this.player);
    this.game.camera.follow(this.player);

    this.enemy1 = this.game.add.sprite(this.map.roomArray[3].centerX, this.map.roomArray[3].centerY, 'enemy');
    this.enemy1.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this.enemy1);

    this.enemy2 = this.game.add.sprite(this.map.roomArray[2].centerX, this.map.roomArray[2].centerY, 'enemy');
    this.enemy2.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this.enemy2);

   
  }
  update(): void {
    //Collision between player and walls
    this.game.physics.arcade.collide(this.player, this.map.walls);

    if (this.cursors.left.isDown) {
        this.player.body.velocity.x = -200;
    } else if (this.cursors.right.isDown) {
        this.player.body.velocity.x = 200;
    } else {
        this.player.body.velocity.x = 0;
    }
    
    if (this.cursors.up.isDown) {
        this.player.body.velocity.y = -200;
    } else if (this.cursors.down.isDown) {
        this.player.body.velocity.y = 200;
    } else {
        this.player.body.velocity.y = 0;
    }

  }
  render(){
    //For debuging
    /*
    this.game.debug.body(this.player);
    this.map.walls.forEach(this.game.debug.body, this.game.debug, true);
    */

  }
}

