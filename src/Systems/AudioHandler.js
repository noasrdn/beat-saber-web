export class AudioHandler {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.audioElement = new Audio();
        this.bpm = 120; 
    }

    loadTrack(url) {
        this.audioElement.src = url;
        this.audioElement.load();
    }

    start(callback) {
        this.audioElement.play();
        const interval = (60 / this.bpm) * 1000;
        
        
        setInterval(() => {
            if (!this.audioElement.paused) callback();
        }, interval);
    }
}