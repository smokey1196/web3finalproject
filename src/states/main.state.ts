'use strict';
/** Imports */
import State from './state';
import Map from '../MapGen/Map';
import Slime from '../sprites/enemies/slime';
import EnemyGroup from '../sprites/enemyGroup';
import Enemy from '../sprites/enemy';
import Player from '../sprites/player';
import Arrow from '../sprites/arrow';

// The main state of the game
export default class MainState extends State {

  player: Player;
  map: Map;
  //cursors: Phaser.CursorKeys;

  enemy1: Slime;
  enemy2: Phaser.Sprite;
  hit: boolean = false;
  enemyGroup: EnemyGroup;


  create(): void {
    // Phaser supports some physical engines (p2, box2d, ninja and arcate).
    // For our game, we don't need a strong physical simulation, so we'll choose
    // `arcade` model.
    this.game.world.setBounds(0, 0, 3200, 2400);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //this.cursors = this.game.input.keyboard.createCursorKeys();

    this.map = new Map(this.game, 'floor', 'wall', 4, 6, 15);
    this.map.generateMap(true);

    this.player = new Player(this.game, this.map.roomArray[0].centerX, this.map.roomArray[0].centerY, 'player');
    this.game.add.existing(this.player);

    //this was above the map causing the sprites to not show, only 20 hours to figure that out :(
    this.enemyGroup = this.game.add.group();

    this.enemy1 = new Slime(this.game, this.map.roomArray[0].centerX + 150, this.map.roomArray[0].centerY, 'slime', false); 
    this.enemy2 = new Slime(this.game, this.map.roomArray[1].centerX, this.map.roomArray[1].centerY - 100, 'slime', false); 

    this.enemyGroup.add(this.enemy1);
    this.enemyGroup.add(this.enemy2);
   
  }
  update(): void {

    
    //Collision between player and walls
    this.game.physics.arcade.collide(this.player, this.map.walls);
    this.game.physics.arcade.collide(this.enemyGroup, this.map.walls);
    this.game.physics.arcade.collide(this.enemyGroup, this.enemyGroup);
    this.game.physics.arcade.collide(this.player.playerArrows, this.map.walls, this.arrowWallCollision);
    this.game.physics.arcade.collide(this.player.playerArrows, this.enemyGroup, this.arrowEnemyCollision, null, this);

    //enemy track player
    if (!this.game.physics.arcade.collide(this.player, this.enemyGroup) && !this.hit){
        this.enemyGroup.forEach(this.trackPlayer, this, true, this.player);
        
    } else {
        this.hit = true;
        this.enemyGroup.forEach(this.knockbacked, this, true);
        this.game.time.events.add(500, function(){
            this.hit = false;
        }, this);
    }

  }
  //for debugging
  render(){
    //this.game.debug.body(this.player);
    //this.game.debug.body(this.enemy1);
    //this.enemyGroup.forEach(this.game.debug.body, this.game.debug, true);
    //this.map.walls.forEach(this.game.debug.body, this.game.debug, true);
    this.player.playerArrows.forEach(this.game.debug.body, this.game.debug, true);
  }

  trackPlayer(enemy: Enemy, player: Phaser.Sprite){
    enemy.track(player);
  }
  knockbacked(enemy: Enemy){
      enemy.knockback();
  }
  arrowWallCollision(arrow: Arrow){
    arrow.kill();
  }
  arrowEnemyCollision(arrow: Arrow, enemy: Enemy){
    console.log(enemy.health);
    console.log(this.player.attack);
    enemy.health = enemy.health - this.player.attack;
    if(enemy.health <= 0){
      enemy.animations.play('death', 25, false, true);
    }
    arrow.kill();
  }
}

