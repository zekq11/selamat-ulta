// audio-handler.js
// Menangani audio agar tetap jalan antar halaman

const AUDIO_KEY = 'bgMusicState';
const AUDIO_SRC = 'lagu_ultah.mp3';
const AUDIO_VOLUME = 0.4;

// Inisialisasi audio
if (!window.audioInstance) {
    window.audioInstance = new Audio(AUDIO_SRC);
    window.audioInstance.loop = true;
    window.audioInstance.volume = AUDIO_VOLUME;
    
    // Load status dari localStorage
    const savedState = localStorage.getItem(AUDIO_KEY);
    if (savedState) {
        const state = JSON.parse(savedState);
        window.audioInstance.currentTime = state.currentTime || 0;
        if (state.isPlaying) {
            window.audioInstance.play().catch(() => {});
        }
    } else {
        // Auto play pertama kali
        window.audioInstance.play()
            .then(() => {
                localStorage.setItem(AUDIO_KEY, JSON.stringify({
                    isPlaying: true,
                    currentTime: 0
                }));
            })
            .catch(() => {
                // Fallback: play setelah interaksi
                document.addEventListener('click', function playOnce() {
                    window.audioInstance.play();
                    localStorage.setItem(AUDIO_KEY, JSON.stringify({
                        isPlaying: true,
                        currentTime: window.audioInstance.currentTime
                    }));
                    document.removeEventListener('click', playOnce);
                }, { once: true });
            });
    }

    // Simpan status setiap 3 detik
    setInterval(() => {
        if (window.audioInstance) {
            localStorage.setItem(AUDIO_KEY, JSON.stringify({
                isPlaying: !window.audioInstance.paused,
                currentTime: window.audioInstance.currentTime
            }));
        }
    }, 3000);
}

// Fungsi untuk pause audio
function pauseAudio() {
    if (window.audioInstance) {
        window.audioInstance.pause();
        localStorage.setItem(AUDIO_KEY, JSON.stringify({
            isPlaying: false,
            currentTime: window.audioInstance.currentTime
        }));
    }
}

// Fungsi untuk play audio
function playAudio() {
    if (window.audioInstance) {
        window.audioInstance.play();
        localStorage.setItem(AUDIO_KEY, JSON.stringify({
            isPlaying: true,
            currentTime: window.audioInstance.currentTime
        }));
    }
}

// Simpan status saat halaman ditutup
window.addEventListener('beforeunload', () => {
    if (window.audioInstance) {
        localStorage.setItem(AUDIO_KEY, JSON.stringify({
            isPlaying: !window.audioInstance.paused,
            currentTime: window.audioInstance.currentTime
        }));
    }
});
