'use strict';
/** Imports */
import State from './state';
import Map from '../MapGen/Map';
import Slime from '../sprites/enemies/slime';
import EnemyGroup from '../sprites/enemyGroup';
import Enemy from '../sprites/enemy';
import Player from '../sprites/player';
import Arrow from '../sprites/arrow';
import Item from '../sprites/item';

// The main state of the game
export default class MainState extends State {

  player: Player;
  map: Map;

  enemy1: Slime;
  enemy2: Phaser.Sprite;
  hit: boolean = false;
  enemyGroup: EnemyGroup;
  playerStats = {
    health: 0 as number,
    attack: 0 as number,
    defence: 0 as number,
    arrowSpeed: 0 as number,
    movementSpeed: 0 as number,
    gold: 0 as number
  };
  level: number = 1;
  heartLabel: Phaser.Text;
  goldLabel: Phaser.Text;


  create(): void {
    // Phaser supports some physical engines (p2, box2d, ninja and arcate).
    // For our game, we don't need a strong physical simulation, so we'll choose
    // `arcade` model.
    this.game.world.setBounds(0, 0, 3200, 2400);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map = new Map(this.game, 'floor', 'wall', 4, 6, 15);
    this.map.generateMap(true);
    this.map.createStaircase();
    this.map.createItems();

    this.player = new Player(this.game, this.map.roomArray[0].centerX, this.map.roomArray[0].centerY, 'player');
    this.game.add.existing(this.player);

    //if we are past level one set the player stats to what they were on the last level
    if(this.level > 1){
      this.player.health = this.playerStats.health;
      this.player.attack = this.playerStats.attack;
      this.player.defence = this.playerStats.defence;
      this.player.arrowSpeed = this.playerStats.arrowSpeed;
      this.player.movementSpeed = this.playerStats.movementSpeed;
      this.player.gold = this.playerStats.gold;
    }

    //this was above the map causing the sprites to not show, only 20 hours to figure that out :(
    this.enemyGroup = this.game.add.group();

    this.enemy1 = new Slime(this.game, this.map.roomArray[0].centerX + 150, this.map.roomArray[0].centerY, 'slime', false); 
    this.enemy2 = new Slime(this.game, this.map.roomArray[1].centerX, this.map.roomArray[1].centerY - 100, 'slime', false); 

    this.enemyGroup.add(this.enemy1);
    this.enemyGroup.add(this.enemy2);

    this.initGUI();

    //level one
    console.log(this.map.stairCase.centerX);
    //level two
   
  }
  update(): void {

    
    //Collision
    this.game.physics.arcade.collide(this.player, this.map.walls);
    this.game.physics.arcade.collide(this.enemyGroup, this.map.walls);
    this.game.physics.arcade.collide(this.enemyGroup, this.enemyGroup);
    this.game.physics.arcade.collide(this.map.stairCase, this.enemyGroup);
    this.game.physics.arcade.collide(this.player.playerArrows, this.map.walls, this.arrowWallCollision);
    this.game.physics.arcade.collide(this.player.playerArrows, this.enemyGroup, this.arrowEnemyCollision, null, this);
    this.game.physics.arcade.collide(this.player, this.map.stairCase, this.playerStaircaseCollision, null, this);

    //item collision
    this.game.physics.arcade.collide(this.map.stairCase, this.map.items, this.itemStairCollision, null, this);
    this.game.physics.arcade.collide(this.player, this.map.items, this.playerItemCollision, null, this);

    //enemy collision and tracking
    this.game.physics.arcade.collide(this.player, this.enemyGroup, this.playerEnemyCollision, null, this);
    this.enemyGroup.forEach(this.trackPlayer, this, true, this.player);

  }
  //for debugging
  render(){
    //this.game.debug.body(this.player);
    //this.game.debug.body(this.enemy1);
    //this.enemyGroup.forEach(this.game.debug.body, this.game.debug, true);
    //this.map.walls.forEach(this.game.debug.body, this.game.debug, true);
    this.player.playerArrows.forEach(this.game.debug.body, this.game.debug, true);
  }
  shutdown(){
    //can't pass sprites between states so need to pass old values and set them on new sprite
    this.playerStats.health = this.player.health;
    this.playerStats.attack = this.player.attack;
    this.playerStats.defence = this.player.defence;
    this.playerStats.arrowSpeed = this.player.arrowSpeed;
    this.playerStats.movementSpeed = this.player.movementSpeed;
    this.playerStats.gold = this.player.gold;

    //increase the level
    this.level++;
  }

  initGUI(){
    let style = {font: '26px Arial', fill: '#fff'};
    let heartIcon = this.game.add.sprite(10, 10, 'heart');
    heartIcon.fixedToCamera = true;
    this.heartLabel = this.game.add.text(50, 10, '0', style);
    this.heartLabel.fixedToCamera = true;

    let goldIcon = this.game.add.sprite(120, 10, 'gold');
    goldIcon.fixedToCamera = true;
    this.goldLabel = this.game.add.text(160, 10, '0', style);
    this.goldLabel.fixedToCamera = true;

    this.updateGUI();
  }
  
  updateGUI(){
    this.heartLabel.text = this.player.health.toString();
    this.goldLabel.text = this.player.gold.toString();
  }

  trackPlayer(enemy: Enemy, player: Player){
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
    enemy.knockback();
    if(enemy.health <= 0){
      enemy.animations.play('death', 25, false, true);
    }
    arrow.kill();
  }

  playerEnemyCollision(player: Player, enemy: Enemy){
    console.log(player.health);
    if(!player.immuneFlag){
      player.damage(enemy.attack);

      player.immuneFlag = true;
      //immune time
      this.game.time.events.add(200, ()=>{
      player.immuneFlag = false;
      });
    }
    enemy.knockback();
    this.updateGUI();
    
  }

  playerStaircaseCollision(){
    console.log('test');
    this.camera.fade(0x000000, 2000);
    this.camera.onFadeComplete.add(this.fadeComplete, this);
  }

  fadeComplete(){
    this.game.state.start('main');
  }

  itemStairCollision(stair: Phaser.Sprite, item: Item){
    item.kill();
  }

  playerItemCollision(player: Player, item: Item){
    player.collectItem(item);
    this.updateGUI();
  }
}

