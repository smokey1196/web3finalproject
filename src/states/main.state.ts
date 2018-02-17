'use strict';
/** Imports */
import State from './state';
import Map from '../MapGen/Map';

// The main state of the game
export default class MainState extends State {

  player: Phaser.Sprite;
  map: Map;

  create(): void {
    // Phaser supports some physical engines (p2, box2d, ninja and arcate).
    // For our game, we don't need a strong physical simulation, so we'll choose
    // `arcade` model.
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map = new Map(this.game, 'floor', 'wall', 5, 7, 8);
    this.map.generateMap(true);

    this.player = this.game.add.sprite(this.map.roomArray[0].centerX, this.map.roomArray[0].centerY, 'player');  
    this.player.anchor.setTo(0.5);     
  }
}
