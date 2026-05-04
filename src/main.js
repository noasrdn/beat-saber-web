import { Engine } from './Core/Engine.js';
import { Saber } from './Entities/Saber.js';
import { GameLogic } from './Systems/GameLogic.js';
import { AudioHandler } from './Systems/AudioHandler.js';
import { MapLoader } from './Systems/MapLoader.js';
import { Cube } from './Entities/Cube.js';


const engine = new Engine();
const game = new GameLogic(engine.scene);
const audio = new AudioHandler();
const mapLoader = new MapLoader(game);
audio.loadTrack('./assets/music/track1.mp3');
setInterval(() => {
    game.spawnCube(Math.floor(Math.random() * 4), 1, 0xff0000);
}, 2000);


window.addEventListener('click', () => {
    audio.start(() => game.spawnCube());
}, { once: true });

engine.render(() => {
    game.update();
    

    game.checkCollisions(saberLeft);
    game.checkCollisions(saberRight);
    
    engine.renderer.render(engine.scene, engine.camera);
});


const controller1 = engine.renderer.xr.getController(0);
const saberLeft = new Saber(0xff0000); 
controller1.add(saberLeft.group);
engine.scene.add(controller1);

const controller2 = engine.renderer.xr.getController(1);
const saberRight = new Saber(0x0000ff); 
controller2.add(saberRight.group);
engine.scene.add(controller2);


engine.render(() => {
    const currentTime = audio.audioElement.currentTime; // Utilise le vrai temps de l'audio
mapLoader.update(currentTime);
    
    mapLoader.update(currentTime);
    game.update();
    
    game.checkCollisions(saberLeft);
    game.checkCollisions(saberRight);

    // Sécurité : si le composer existe, on l'utilise, sinon rendu normal
    if (engine.composer) {
        engine.composer.render();
    } else {
        engine.renderer.render(engine.scene, engine.camera);
    }
});


setInterval(() => game.spawnCube(), 2000);