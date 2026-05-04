import * as THREE from 'three';

export class Saber {
    constructor(color) {
        const geometry = new THREE.CylinderGeometry(0.02, 0.02, 1);
        const material = new THREE.MeshBasicMaterial({ color: color });
        this.mesh = new THREE.Mesh(geometry, material);
        
        // On décale le mesh pour que la base soit au niveau de la main
        this.mesh.position.set(0, 0, -0.5);
        this.mesh.rotation.x = Math.PI / 2;
        
        this.group = new THREE.Group();
        this.group.add(this.mesh);this.raycaster = new THREE.Raycaster();
        this.bladeLength = 1.0;
    }

    getBounds() {
        // Calculer la position de la base et de la pointe dans l'espace global
        const start = new THREE.Vector3(0, 0, 0);
        const end = new THREE.Vector3(0, 0, -this.bladeLength);
        
        // Appliquer la transformation de la manette au sabre
        start.applyMatrix4(this.group.matrixWorld);
        end.applyMatrix4(this.group.matrixWorld);
        
        return { start, end };
    }
}