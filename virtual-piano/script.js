const pianoContainer = document.querySelector('.piano');

function createUrl(fileName) {
    return `./assets/audio/${fileName}.mp3`;
}

function createAudio(url) {
    const audio = new Audio(url);
    audio.currentTime = 0;
    return audio;
}

function audioWrapper() {
    const audios = new Map();

    return function (url) {
        if (audios.has(url)) {
            const audio = audios.get(url);
            audio.currentTime = 0;
            audio.play();
        } else {
            const audio = createAudio(url);
            audios.set(url, audio);
            audio.play();
        }
    }
}

const play = audioWrapper();

pianoContainer.addEventListener('click', (e) => {
    const element = e.target;
    const fileName = element.dataset.note;
    if (fileName) {
        const url = createUrl(fileName);
        play(url);
    }
});
