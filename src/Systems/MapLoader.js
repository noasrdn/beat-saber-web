export class MapLoader {
    constructor(gameLogic) {
        this.gameLogic = gameLogic;
        this.levelData = null;
        this.isLoaded = false;
    }

    async load(url) {
        const response = await fetch(url);
        this.levelData = await response.json();
        this.isLoaded = true;
    }

    update(currentTime) {
        if (!this.isLoaded) return;

        // On regarde si une note doit être jouée
        this.levelData.notes.forEach((note, index) => {
            if (currentTime >= note.time && !note.spawned) {
                const color = note.type === 0 ? 0xff0000 : 0x0000ff;
                this.gameLogic.spawnCube(note.lane, note.layer, color);
                note.spawned = true; // Pour ne pas le spawn 2 fois
            }
        });
    }
}