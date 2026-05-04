import { Cube } from '../Entities/Cube.js';
import { SlicedCube } from '../Entities/SlicedCube.js';

export class GameLogic {
    constructor(scene) {
        this.scene = scene;
        this.cubes = [];
        this.debris = []; // Pour les morceaux coupés
    }

    spawnCube() {
        const lane = Math.floor(Math.random() * 4);
        const color = (lane < 2) ? 0xff0000 : 0x0000ff; // Gauche rouge, droite bleu
        const cube = new Cube(lane, 1, color);
        
        this.scene.add(cube.mesh);
        this.cubes.push(cube);
    }

    handleHit(cubeObj) {
        const index = this.cubes.indexOf(cubeObj);
        if (index > -1) {
            // Créer les débris
            const slice = new SlicedCube(cubeObj.mesh.position, cubeObj.material.color);
            this.scene.add(slice.group);
            this.debris.push(slice);

            // Supprimer le cube original
            this.scene.remove(cubeObj.mesh);
            this.cubes.splice(index, 1);
        }
    }

    update() {
        // Update des cubes actifs
        this.cubes.forEach(c => c.mesh.position.z += 0.15);
        
        // Update des débris
        this.debris.forEach((d, i) => {
            d.update();
            if (d.group.position.y < -1) { // Nettoyage
                this.scene.remove(d.group);
                this.debris.splice(i, 1);
            }
        });
    }
    
}