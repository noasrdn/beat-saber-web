import * as THREE from 'three';

export class SlicedCube {
    constructor(position, color) {
        this.group = new THREE.Group();
        
        // On crée deux moitiés
        const halfGeo = new THREE.BoxGeometry(0.4, 0.2, 0.4);
        const material = new THREE.MeshStandardMaterial({ color: color });

        this.top = new THREE.Mesh(halfGeo, material);
        this.bottom = new THREE.Mesh(halfGeo, material);

        this.top.position.set(position.x, position.y + 0.1, position.z);
        this.bottom.position.set(position.x, position.y - 0.1, position.z);

        this.group.add(this.top, this.bottom);
        
        // Vecteurs de chute
        this.velocityTop = new THREE.Vector3(Math.random() * 0.05, 0.05, 0.05);
        this.velocityBottom = new THREE.Vector3(-Math.random() * 0.05, -0.05, 0.05);
    }

    update() {
        // Simule une gravité basique
        this.velocityTop.y -= 0.005;
        this.velocityBottom.y -= 0.005;
        
        this.top.position.add(this.velocityTop);
        this.bottom.position.add(this.velocityBottom);
        
        // Rotation pour le style
        this.top.rotation.x += 0.1;
        this.bottom.rotation.z += 0.1;
    }
}