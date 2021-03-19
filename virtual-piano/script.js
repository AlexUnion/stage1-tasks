const pianoContainer = document.querySelector('.piano');
const pianoKeys = Array.from(document.querySelectorAll('.piano-key'));

const keys = pianoKeys.map(({dataset}) => {
    const {letter, note} = dataset;
    if (!letter) return false;
    const code = `Key${letter}`;
    return {
        note,
        code
    };
}).filter((item) => (
    typeof item !== 'boolean'
));

const audios = new Map();
const notes = [
    'a', 'a♯', 'b', 'c', 'c♯', 'd', 'd♯', 'e', 'f', 'f♯', 'g', 'g♯'
];

notes.forEach((note) => {
    const url = createUrl(note);
    audios.set(note, createAudio(url));
});

function createUrl(fileName) {
    return `./assets/audio/${fileName}.mp3`;
}

function createAudio(url) {
    const audio = new Audio(url);
    audio.currentTime = 0;
    return audio;
}

function play(note) {
    const audio = audios.get(note);
    audio.currentTime = 0;
    audio.play();
}

pianoContainer.addEventListener('click', (e) => {
    const element = e.target;
    const note = element.dataset.note;
    if (note) play(note);
});

window.addEventListener('keydown', (event) => {
    const code = event.code;
    const { note } = keys.find((item) => item.code === code);
    if (note) play(note);
});
