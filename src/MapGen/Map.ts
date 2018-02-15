import Room from './Room';

export default class Map {

    protected game: Phaser.Game;

    protected floors: Phaser.Group;
    protected walls: Phaser.Group;
    protected floorImage: string;
    protected wallImage: string;

    protected minRoomSize: number;
    protected maxRoomSize: number;
    protected maxRoomNumber: number;

    protected numRooms: number = 0;
    protected numTiles: number = 0;
    roomArray: Array<Room>;

    constructor(game: Phaser.Game, floorImage: string, wallImage: string,
        minRoomSize: number, maxRoomSize: number, MaxRoomNumber: number){

        this.game = game;
        this.floorImage = floorImage;
        this.wallImage = wallImage;
        this.minRoomSize = minRoomSize;
        this.maxRoomSize = maxRoomSize;
        this.maxRoomNumber = MaxRoomNumber;
        this.roomArray = [];

    }

    //makes the map
    generateMap(){

        this.floors = this.game.add.group();
        this.walls = this.game.add.group();
        this.walls.enableBody = true;

        let lastRoomCoords = { x: 0, y: 0 };

        //Create walls across the whole world
        for (var y=0; y<this.game.world.height; y+= 16) {
            for (var x=0; x<this.game.world.width; x+=16) {
                var wall = this.walls.create(x, y, this.wallImage);
                wall.body.immovable = true;
            }
        }
        
        //Creating the rooms
        for (var r=0; r<this.maxRoomNumber; r++) {
            let w = this.getRandom(this.minRoomSize, this.maxRoomSize) * 16;
            let h = this.getRandom(this.minRoomSize, this.maxRoomSize) * 16;
    
            let x = this.getRandom(1, ((this.game.world.width) / 16) - (w/16 + 1)) * 16;
            let y = this.getRandom(1, ((this.game.world.height) / 16) - (w/16 + 1)) * 16;
    
            this.createRoom(x, x+w, y, y+h);
            let room = new Room(x, y, w, h);
            this.roomArray.push(room);
            console.log(room);

            if (this.numRooms == 0) {            
                //playState.player.x = x + (w/2);
                //playState.player.y = y + (h/2);
            } 
            else {
                let new_x = Phaser.Math.snapToFloor(x + (w/2), 16);
                let new_y = Phaser.Math.snapToFloor(y + (h/2), 16);
    
                let prev_x = Phaser.Math.snapToFloor(lastRoomCoords.x, 16);
                let prev_y = Phaser.Math.snapToFloor(lastRoomCoords.y, 16);
                
                this.createHTunnel(prev_x, new_x, prev_y);
                this.createVTunnel(prev_y, new_y, new_x);
                //console.log(new_x, new_y, prev_x, prev_y);
            }
    
            lastRoomCoords = { x: x + (w/2), y: y + (h/2) };
            this.numRooms++;
        }

    }

    //Get a random number
    protected getRandom(min: number, max: number){
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //Create single floor 'tile' and add it to floor group
    protected createFloor(x: number, y: number){
        let fl = this.floors.create(x, y, this.floorImage);
        this.game.physics.arcade.enable(fl);
        this.game.physics.arcade.overlap(fl, this.walls, function(floor, wall) {
            wall.destroy();
        });
    }
    //Using the floor function to carve a whole room of floor 'tiles'
    protected createRoom(x1: number, x2: number, y1: number, y2: number) {
        for (let x = x1; x<x2; x+=16) {
            for (let y = y1; y<y2; y+=16) {
                this.createFloor(x, y);
            }
        } 
    }
    //Create a Horizontal tunnel to connect two rooms
    protected createHTunnel(x1: number, x2: number, y: number) {
        let min = Math.min(x1, x2);
        let max = Math.max(x1, x2);
        for (let x = min; x<max+8; x+=8) {
            this.createFloor(x, y);
        } 
    }
    //Create a Vertical tunnel to connect two rooms
    protected createVTunnel(y1: number, y2: number, x:number) {
        let min = Math.min(y1, y2);
        let max = Math.max(y1, y2);
        for (let y = min; y<max+8; y+=8) {
            this.createFloor(x, y);
        } 
    }
}