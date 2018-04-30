'use strict';
/** Imports */
import State from './state';

// Webpack will replace these imports with a URLs to images
const playerImage   = require('assets/images/player_spritesheet.png');
const slimeImage    = require('assets/images/slime-calciumtrice.png');
const batImage      = require('assets/images/ratBat-calciumtrice.png');
const wallImage     = require('assets/images/wall.png');
const floorImage    = require('assets/images/floor.png');
const stairImage    = require('assets/images/stone_stairs_down.png');
const arrowImage    = require('assets/images/arrow.png');
const potionImage   = require('assets/images/potion.png');
const chestImage    = require('assets/images/chest.png');
const heartImage    = require('assets/images/heart.png');
const goldImage     = require('assets/images/gold.png');


// The state for loading core resources for the game
export default class PreloaderState extends State {
  preload(): void {
    console.debug('Assets loading started');

    this.game.load.spritesheet('player', playerImage, 64, 64);
    this.game.load.spritesheet('slime', slimeImage, 32, 33);
    this.game.load.spritesheet('bat', batImage, 32, 33);
    this.game.load.image('wall', wallImage);
    this.game.load.image('floor', floorImage);
    this.game.load.image('stairDown', stairImage);
    this.game.load.image('arrow', arrowImage);
    this.game.load.image('potion', potionImage);
    this.game.load.image('chest', chestImage);
    this.game.load.image('heart', heartImage);
    this.game.load.image('gold', goldImage);
  }

  create(): void {
    console.debug('Assets loading completed');

    this.game.state.start('main'); // Switch to main game state
  }
}
