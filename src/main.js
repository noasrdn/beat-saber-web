import { Engine } from './Core/Engine.js';
import { Saber } from './Entities/Saber.js';
import { GameLogic } from './Systems/GameLogic.js';
import { AudioHandler } from './Systems/AudioHandler.js';


const engine = new Engine();
const game = new GameLogic(engine.scene);
const audio = new AudioHandler();
audio.loadTrack('./assets/music/track1.mp3');


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
const saberRight = new Saber(0x0000ff); // Bleu
controller2.add(saberRight.group);
engine.scene.add(controller2);

// Boucle de jeu
engine.render(() => {
    game.update();
    // Ici, ajouter la détection de collision entre sabres et cubes
    engine.renderer.render(engine.scene, engine.camera);
});

// Spawn test toutes les 2 secondes
setInterval(() => game.spawnCube(), 2000);