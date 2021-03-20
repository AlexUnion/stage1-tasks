const pianoContainer = document.querySelector('.piano');
const pianoKeys = Array.from(document.querySelectorAll('.piano-key'));
const btnContainer = document.querySelector('.btn-container');
const btnNotes = document.querySelector('.btn-notes');
const btnLetters = document.querySelector('.btn-letters');
const fullscreen = document.querySelector('.fullscreen');

const PIANO_KEY_ACTIVE = 'piano-key-active';
const PIANO_KEY_ACTIVE_PSEUDO = 'piano-key-active-pseudo';

const activeNotes = new Set();
const state = {
    mousePressed: false,
    isCurrentTabLetter: false
}

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

const play = playWrapper();

function playWrapper() {
    const audios = new Map();
    const notes = [
        'a', 'a♯', 'b', 'c', 'c♯', 'd', 'd♯', 'e', 'f', 'f♯', 'g', 'g♯'
    ];

    notes.forEach((note) => {
        const url = `./assets/audio/${note}.mp3`;
        audios.set(note, createAudio(url));
    });

    return function (note) {
        const audio = audios.get(note);
        audio.currentTime = 0;
        audio.play();
    }
}

function createAudio(url) {
    const audio = new Audio(url);
    audio.currentTime = 0;
    return audio;
}

function findKeyCode(keys, code) {
    const result = keys.find((item) => (
        item.code === code
    ));
    return result || false;
}

window.addEventListener('mousedown', (e) => {
    state.mousePressed = true;
    const { note } = e.target.dataset;
    if (note) {
        const currentNote = document.getElementById(note);
        if (!currentNote.classList.contains(PIANO_KEY_ACTIVE)) {
            currentNote.classList.add(PIANO_KEY_ACTIVE, PIANO_KEY_ACTIVE_PSEUDO);
        }
        play(note);
    }
});
window.addEventListener('mouseup', (e) => {
    state.mousePressed = false;
    const { note } = e.target.dataset;
    if (note) {
        const currentNote = document.getElementById(note);
        if (currentNote.classList.contains(PIANO_KEY_ACTIVE)) {
            currentNote.classList.remove(PIANO_KEY_ACTIVE, PIANO_KEY_ACTIVE_PSEUDO);
        }
    }
});
pianoContainer.addEventListener('mouseover', (e) => {
    if (state.mousePressed) {
        const { note } = e.target.dataset;
        if (note) {
            const currentNote = document.getElementById(note);
            if (!currentNote.classList.contains(PIANO_KEY_ACTIVE)) {
                currentNote.classList.add(PIANO_KEY_ACTIVE, PIANO_KEY_ACTIVE_PSEUDO);
            }
            play(note);
        }
    }
});
pianoContainer.addEventListener('mouseout', (e) => {
    if (state.mousePressed) {
        const { note } = e.target.dataset;
        if (note) {
            const currentNote = document.getElementById(note);
            if (currentNote.classList.contains(PIANO_KEY_ACTIVE)) {
                currentNote.classList.remove(PIANO_KEY_ACTIVE, PIANO_KEY_ACTIVE_PSEUDO);
            }
        }
    }
});

window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const code = event.code;
    const key = findKeyCode(keys, code);
    if (key) {
        const { note } = key;
        if (!activeNotes.has(note)) {
            play(note);
            const noteElement = document.getElementById(note);
            noteElement.classList.add(PIANO_KEY_ACTIVE);
            activeNotes.add(note);
        }
    }
});

window.addEventListener('keyup', (event) => {
    const code = event.code;
    const key = findKeyCode(keys, code);
    if (key) {
        const { note } = key;
        if (activeNotes.has(note)) {
            const noteElement = document.getElementById(note);
            noteElement.classList.remove(PIANO_KEY_ACTIVE);
            activeNotes.delete(note);
        }
    }
})

btnContainer.addEventListener('click', (e) => {
    btnLetters.classList.remove('btn-active');
    btnNotes.classList.remove('btn-active');
    const button = e.target;
    state.isCurrentTabLetter = button.classList.contains('btn-letters');
    button.classList.add('btn-active');
    if (state.isCurrentTabLetter) {
        if (!pianoKeys[0].classList.contains('piano-key-letter')) {
            pianoKeys.forEach((item) => {
                item.classList.add('piano-key-letter')
            })
        }
    } else {
        if (pianoKeys[0].classList.contains('piano-key-letter')) {
            pianoKeys.forEach((item) => {
                item.classList.remove('piano-key-letter')
            })
        }
    }
})

fullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
})
