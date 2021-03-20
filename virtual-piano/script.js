const pianoContainer = document.querySelector('.piano');
const pianoKeys = Array.from(document.querySelectorAll('.piano-key'));
const btnContainer = document.querySelector('.btn-container');
const btnNotes = document.querySelector('.btn-notes');
const btnLetters = document.querySelector('.btn-letters');
const fullscreen = document.querySelector('.fullscreen');

const ACTIVE_NOTE_CLASS = 'piano-key-active';

const activeNotes = new Set();

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

function findKey(keys, key) {
    const result = keys.find((item) => (
        item.code === key
    ));
    return result || false;
}

pianoContainer.addEventListener('click', (e) => {
    const element = e.target;
    const note = element.dataset.note;
    if (note) play(note);
});

window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const code = event.code;
    const key = findKey(keys, code);
    if (key) {
        const { note } = key;
        if (!activeNotes.has(note)) {
            play(note);
            const noteElement = document.getElementById(note);
            noteElement.classList.add(ACTIVE_NOTE_CLASS);
            activeNotes.add(note);
        }
    }
});

window.addEventListener('keyup', (event) => {
    const code = event.code;
    const key = findKey(keys, code);
    if (key) {
        const { note } = key;
        if (activeNotes.has(note)) {
            const noteElement = document.getElementById(note);
            noteElement.classList.remove(ACTIVE_NOTE_CLASS);
            activeNotes.delete(note);
        }
    }
})

btnContainer.addEventListener('click', (e) => {
    btnLetters.classList.remove('btn-active');
    btnNotes.classList.remove('btn-active');
    const button = e.target;
    button.classList.add('btn-active');
})

fullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
})
