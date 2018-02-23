import Room from './Room';

export default class Map {

    protected game: Phaser.Game;

    floors: Phaser.Group;
    walls: Phaser.Group;
    protected floorImage: string;
    protected wallImage: string;

    protected minRoomSize: number;
    protected maxRoomSize: number;
    protected maxRoomNumber: number;
    protected tileSize: number;

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
        this.tileSize = 64;
        this.roomArray = [];

    }

    //makes the map
    generateMap(genStartRoom?: boolean, genLastRoom?: boolean){

        this.floors = this.game.add.group();
        this.walls = this.game.add.group();
        this.walls.enableBody = true;

        let lastRoomCoords = { x: 0, y: 0 };

        //Create walls across the whole world
        for (let y=0; y<this.game.world.height; y+=this.tileSize) {
            for (let x=0; x<this.game.world.width; x+=this.tileSize) {
                let wall = this.walls.create(x, y, this.wallImage);
                wall.body.immovable = true;
            }
        }

        //Creating the rooms
        for (let r=0; r<this.maxRoomNumber; r++) {

            let w: number = 0;
            let h: number = 0;
            let x: number = 0;
            let y: number = 0;


            //Generate the first room so that nothing overlaps it
            if (genStartRoom && r === 0){
                console.log('generating a starting room!');
                w = this.maxRoomSize * this.tileSize;
                h = this.maxRoomSize * this.tileSize;
                
                //needs to be a multiple of whatever the floor px size is (tilesize)
                x = 4 * this.tileSize;
                y = 4 * this.tileSize;
            
            //Generate random coords for the other rooms
            } else {
                console.log('is false');
                w = this.getRandom(this.minRoomSize, this.maxRoomSize) * this.tileSize;
                h = this.getRandom(this.minRoomSize, this.maxRoomSize) * this.tileSize;
    
                x = this.getRandom(1, ((this.game.world.width) / this.tileSize) - (w/this.tileSize + 1)) * this.tileSize;
                y = this.getRandom(1, ((this.game.world.height) / this.tileSize) - (w/this.tileSize + 1)) * this.tileSize;

                //console.log(this.getRandom(1, ((this.game.world.width) / 16) - (w/16 + 1)));
            }
            
            //Create the room then add it to rooms array so it can be referenced later
            this.createRoom(x, x+w, y, y+h);
            let room = new Room(x, y, w, h);
            this.roomArray.push(room);
            console.log(room);

            if (this.numRooms !== 0) {            
                let new_x = Phaser.Math.snapToFloor(x + (w/2), this.tileSize);
                let new_y = Phaser.Math.snapToFloor(y + (h/2), this.tileSize);
    
                let prev_x = Phaser.Math.snapToFloor(lastRoomCoords.x, this.tileSize);
                let prev_y = Phaser.Math.snapToFloor(lastRoomCoords.y, this.tileSize);
                
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

    //Create single floor tile and add it to floor group
    protected createFloor(x: number, y: number){
        let fl = this.floors.create(x, y, this.floorImage);
        this.game.physics.arcade.enable(fl);
        this.game.physics.arcade.overlap(fl, this.walls, function(floor, wall) {
            wall.destroy();
        });
    }
    //Using the floor function to carve a whole room of floor tiles
    protected createRoom(x1: number, x2: number, y1: number, y2: number) {
        for (let x = x1; x<x2; x+=this.tileSize) {
            for (let y = y1; y<y2; y+=this.tileSize) {
                this.createFloor(x, y);
            }
        } 
    }
    //Create a Horizontal tunnel to connect two rooms
    protected createHTunnel(x1: number, x2: number, y: number) {
        let min = Math.min(x1, x2);
        let max = Math.max(x1, x2);
        for (let x = min; x<max+(this.tileSize/2); x+=(this.tileSize/2)) {
            this.createFloor(x, y);
        } 
    }
    //Create a Vertical tunnel to connect two rooms
    protected createVTunnel(y1: number, y2: number, x:number) {
        let min = Math.min(y1, y2);
        let max = Math.max(y1, y2);
        for (let y = min; y<max+(this.tileSize / 2); y+=(this.tileSize/2)) {
            this.createFloor(x, y);
        } 
    }
}
