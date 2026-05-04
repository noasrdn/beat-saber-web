import * as THREE from 'three';
import { Cube } from '../Entities/Cube.js';
import { SlicedCube } from '../Entities/SlicedCube.js';

export class GameLogic {
    constructor(scene) {
        this.scene = scene;
        
        // Listes d'objets
        this.cubes = [];
        this.debris = [];
        
        // Système de jeu
        this.score = 0;
        this.combo = 0;
        this.multiplier = 1;
        
        // Configuration
        this.speed = 0.15; // Vitesse de défilement
    }

    /**
     * Crée un nouveau cube sur la grille
     */
    spawnCube(lane, layer, colorValue) {
        const cube = new Cube(lane, layer, colorValue);
        this.scene.add(cube.mesh);
        this.cubes.push(cube);
    }

    /**
     * Vérifie si un sabre traverse un cube
     */
    checkCollisions(saber) {
        if (this.cubes.length === 0) return false;

        // On récupère les positions mondiales du sabre (base et pointe)
        const { start, end } = saber.getBounds();
        const direction = new THREE.Vector3().subVectors(end, start).normalize();
        const distance = start.distanceTo(end);

        // Configuration du raycaster sur toute la longueur de la lame
        saber.raycaster.set(start, direction);
        saber.raycaster.far = distance;

        // On ne teste l'intersection que sur les meshes des cubes
        const cubeMeshes = this.cubes.map(c => c.mesh);
        const intersects = saber.raycaster.intersectObjects(cubeMeshes);

        if (intersects.length > 0) {
            const hitMesh = intersects[0].object;
            const cubeInstance = this.cubes.find(c => c.mesh === hitMesh);
            
            if (cubeInstance) {
                this.handleHit(cubeInstance);
                return true; // Collision détectée
            }
        }
        return false;
    }

    /**
     * Logique de destruction du cube
     */
    handleHit(cubeObj) {
        const index = this.cubes.indexOf(cubeObj);
        if (index === -1) return;

        // 1. Mise à jour du combo et score
        this.combo++;
        this.updateMultiplier();
        this.score += 100 * this.multiplier;

        // 2. Effet visuel de découpe
        const slice = new SlicedCube(cubeObj.mesh.position, cubeObj.material.color);
        this.scene.add(slice.group);
        this.debris.push(slice);

        // 3. Suppression
        this.scene.remove(cubeObj.mesh);
        this.cubes.splice(index, 1);

        console.log(`✨ Hit! Score: ${this.score} | Combo: x${this.combo}`);
    }

    /**
     * Appelé quand un cube dépasse le joueur sans être touché
     */
    handleMiss(index) {
        const cube = this.cubes[index];
        this.scene.remove(cube.mesh);
        this.cubes.splice(index, 1);

        // Reset du combo
        this.combo = 0;
        this.multiplier = 1;
        console.log("❌ Missed!");
    }

    updateMultiplier() {
        if (this.combo >= 32) this.multiplier = 8;
        else if (this.combo >= 16) this.multiplier = 4;
        else if (this.combo >= 8) this.multiplier = 2;
        else this.multiplier = 1;
    }

    /**
     * Mise à jour de la frame (mouvement et nettoyage)
     */
    update() {
        // Déplacement des cubes vers le joueur (axe Z positif)
        for (let i = this.cubes.length - 1; i >= 0; i--) {
            this.cubes[i].mesh.position.z += this.speed;

            // Si le cube dépasse le joueur (Z > 2)
            if (this.cubes[i].mesh.position.z > 2) {
                this.handleMiss(i);
            }
        }

        // Mise à jour et nettoyage des débris (SlicedCubes)
        for (let j = this.debris.length - 1; j >= 0; j--) {
            this.debris[j].update();

            // Si les débris tombent trop bas, on les supprime
            if (this.debris[j].top.position.y < -2) {
                this.scene.remove(this.debris[j].group);
                this.debris.splice(j, 1);
            }
        }
    }
}