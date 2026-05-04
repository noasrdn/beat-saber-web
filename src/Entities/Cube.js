import * as THREE from 'three';

export class Cube {
    constructor(lane, layer, color = 0xff0000) {
        this.geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        this.material = new THREE.MeshStandardMaterial({ 
            color: color,
            emissive: color,
            emissiveIntensity: 1 
        });
        
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // Positionnement sur la grille :
        // lane (colonne) : de 0 à 3
        // layer (étage) : de 0 à 2
        const x = (lane - 1.5) * 0.6; // Centre la grille
        const y = (layer * 0.6) + 0.5; // Décolle du sol
        
        this.mesh.position.set(x, y, -15); // Spawn loin devant
    }
}