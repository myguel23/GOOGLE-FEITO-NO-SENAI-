// === DOM Elements ===
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const luckyBtn = document.getElementById('luckyBtn');
const micIcon = document.getElementById('micIcon');

// === Search Function ===
function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        const encoded = encodeURIComponent(query);
        window.open(`https://www.google.com/search?q=${encoded}`, '_blank');
    }
}

// === "I'm Feeling Lucky" ===
function feelingLucky() {
    const query = searchInput.value.trim();
    if (query) {
        const encoded = encodeURIComponent(query);
        window.open(`https://www.google.com/search?q=${encoded}&btnI=1`, '_blank');
    } else {
        // If empty, redirect to Google Doodles or just Google home
        window.open('https://www.google.com/doodles', '_blank');
    }
}

// === Speech Recognition ===
let recognition = null;
let isListening = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        // Auto-search after speech
        setTimeout(() => performSearch(), 300);
    };

    recognition.onerror = () => {
        isListening = false;
        micIcon.textContent = '🎤';
    };

    recognition.onend = () => {
        isListening = false;
        micIcon.textContent = '🎤';
    };
}

function toggleVoiceSearch() {
    if (!recognition) {
        alert('Reconhecimento de voz não suportado neste navegador.');
        return;
    }

    if (isListening) {
        recognition.stop();
        isListening = false;
        micIcon.textContent = '🎤';
    } else {
        try {
            recognition.start();
            isListening = true;
            micIcon.textContent = '🔴'; // red dot while listening
        } catch {
            // Already started
        }
    }
}

// === Event Listeners ===
searchBtn.addEventListener('click', performSearch);

luckyBtn.addEventListener('click', feelingLucky);

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

micIcon.addEventListener('click', toggleVoiceSearch);

// === Focus input on load ===
window.addEventListener('load', () => {
    searchInput.focus();
});

// === Keyboard shortcut: '/' to focus search ===
document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
    }
});

