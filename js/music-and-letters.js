// Sistema de Música y Cartas de Amor
// Funcionalidades románticas para el jardín

// ===== SISTEMA DE MÚSICA =====
class MusicPlayer {
    constructor() {
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.volume = 0.7;
        this.audio = new Audio();
        this.audio.volume = this.volume;
        
        // Playlist romántica con canciones reales
        this.playlist = [
            { title: 'Perfect', artist: 'Ed Sheeran', file: 'music/Ed Sheeran - Perfect.mp3' },
            { title: 'All of Me', artist: 'John Legend', file: 'music/John Legend - All of Me.mp3' },
            { title: 'A Thousand Years', artist: 'Christina Perri', file: 'music/Christina Perri - A Thousand Years.mp3' },
            { title: 'Make You Feel My Love', artist: 'Adele', file: 'music/Adele - Make You Feel My Love.mp3' },
            { title: 'Halo', artist: 'Beyoncé', file: 'music/Beyoncé - Halo.mp3' },
            { title: 'The Night We Met', artist: 'Lord Huron', file: 'music/Lord Huron - The Night We Met.mp3' }
        ];
        
        this.init();
    }
    
    init() {
        // Configurar eventos del audio
        this.audio.addEventListener('ended', () => this.nextSong());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => {
            const totalTimeEl = document.getElementById('totalTime');
            if (totalTimeEl) {
                totalTimeEl.textContent = this.formatTime(this.audio.duration);
            }
        });
        this.audio.addEventListener('error', (e) => {
            console.warn(`No se pudo cargar: ${this.playlist[this.currentSongIndex].title}`);
            this.nextSong();
        });
        
        this.setupUI();
        this.renderPlaylist();
    }
    
    setupUI() {
        // Botones de control
        document.getElementById('playPause').addEventListener('click', () => this.togglePlay());
        document.getElementById('prevSong').addEventListener('click', () => this.previousSong());
        document.getElementById('nextSong').addEventListener('click', () => this.nextSong());
        
        // Control de volumen
        const volumeSlider = document.getElementById('volumeSlider');
        volumeSlider.value = this.volume * 100;
        volumeSlider.addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
            this.audio.volume = this.volume;
        });
        
        // Barra de progreso - hacer clic para saltar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.audio.currentTime = percent * this.audio.duration;
            });
        }
        
        // Botón de apertura del modal
        document.getElementById('musicToggle').addEventListener('click', () => {
            document.getElementById('musicPlayerModal').classList.remove('hidden');
            this.updateDisplay();
        });
        
        // Cerrar modal
        document.getElementById('closeMusicPlayer').addEventListener('click', () => {
            document.getElementById('musicPlayerModal').classList.add('hidden');
        });
    }
    
    renderPlaylist() {
        const playlistContainer = document.getElementById('playlistItems');
        playlistContainer.innerHTML = '';
        
        this.playlist.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            if (index === this.currentSongIndex) {
                item.classList.add('active');
            }
            
            item.innerHTML = `
                <span class="playlist-item-icon">🎵</span>
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${song.title}</div>
                    <div class="playlist-item-artist">${song.artist}</div>
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.currentSongIndex = index;
                this.playSong();
                this.renderPlaylist();
            });
            
            playlistContainer.appendChild(item);
        });
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.playSong();
        }
    }
    
    playSong() {
        const song = this.playlist[this.currentSongIndex];
        
        // Cargar y reproducir la canción
        this.audio.src = song.file;
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.updateDisplay();
            })
            .catch(error => {
                console.warn(`Error reproduciendo ${song.title}:`, error);
                this.nextSong();
            });
        
        this.renderPlaylist();
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateDisplay();
    }
    
    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
        if (this.isPlaying) {
            this.playSong();
        } else {
            this.updateDisplay();
        }
        this.renderPlaylist();
    }
    
    previousSong() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
        if (this.isPlaying) {
            this.playSong();
        } else {
            this.updateDisplay();
        }
        this.renderPlaylist();
    }
    
    updateDisplay() {
        const song = this.playlist[this.currentSongIndex];
        document.getElementById('currentSongTitle').textContent = song.title;
        document.getElementById('currentArtist').textContent = song.artist;
        
        const playPauseBtn = document.getElementById('playPause');
        playPauseBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
        
        const vinyl = document.getElementById('vinylDisc');
        if (this.isPlaying) {
            vinyl.classList.add('playing');
        } else {
            vinyl.classList.remove('playing');
        }
    }
    
    updateProgress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            const progressFill = document.getElementById('progressFill');
            const currentTimeEl = document.getElementById('currentTime');
            
            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
            
            if (currentTimeEl) {
                currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
            }
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// ===== SISTEMA DE CARTAS DE AMOR =====
class LoveLettersSystem {
    constructor() {
        this.letters = [
            {
                id: 1,
                title: 'Primera Carta',
                icon: '💌',
                unlockAt: 1,
                date: 'Octubre 2025',
                content: `Mi amor,

Esta es la primera de muchas cartas que te escribiré. Cada flor que cultives en este jardín representa un pensamiento, un sentimiento, algo que quiero que sepas.

Desde el momento en que te conocí, mi vida cambió. Eres la razón de mi sonrisa, la luz en mis días más oscuros, y el sueño que nunca quiero terminar.

Este jardín es mi forma de mostrarte lo que siento, porque a veces las palabras no son suficientes para expresar lo mucho que significas para mí.

Sigue cultivando flores, y descubrirás más secretos de mi corazón. 🌸`
            },
            {
                id: 2,
                title: 'Tu Sonrisa',
                icon: '😊',
                unlockAt: 10,
                date: 'Tu risa ilumina todo',
                content: `Amor mío,

¿Sabes qué es lo más hermoso del mundo? Tu sonrisa. 

Cada vez que ríes, el universo entero se detiene para admirarte. Tus ojos brillan de una manera que hace que todo valga la pena.

Me encanta cómo te emocionas por las pequeñas cosas, cómo encuentras belleza en lugares inesperados, cómo haces que cada momento sea especial solo con tu presencia.

No cambies nunca esa luz que llevas dentro. Eres perfecta tal como eres. 💖`
            },
            {
                id: 3,
                title: 'Nuestros Momentos',
                icon: '⏰',
                unlockAt: 25,
                date: 'Recuerdos inolvidables',
                content: `Mi princesa,

Cada segundo contigo es un tesoro que guardo en mi corazón.

Los momentos que hemos compartido, desde las conversaciones largas hasta los silencios cómodos, todos y cada uno son preciosos para mí.

Me encanta cómo me haces sentir cuando estamos juntos. Contigo soy yo mismo, sin máscaras, sin pretensiones. Solo yo, amándote con cada fibra de mi ser.

Gracias por existir, por ser parte de mi vida, por dejarme ser parte de la tuya. 🌟`
            },
            {
                id: 4,
                title: 'Eres Especial',
                icon: '⭐',
                unlockAt: 50,
                date: 'Tu unicidad',
                content: `Mi amor,

Eres única. No hay nadie en el mundo como tú.

Tu forma de pensar, de sentir, de amar... todo en ti es especial. Eres un regalo que no merezco pero que agradezco cada día.

Admiro tu fortaleza, tu sensibilidad, tu inteligencia. Admiro cómo enfrentas la vida, cómo amas a los que te rodean, cómo me amas a mí.

No importa cuántas flores cultives, nunca serán suficientes para expresar todo lo que siento por ti.

Eres mi persona favorita en todo el universo. ✨`
            },
            {
                id: 5,
                title: 'Para Siempre',
                icon: '💕',
                unlockAt: 100,
                date: 'Nuestro futuro',
                content: `Mi vida,

Si has llegado hasta aquí, cultivando 100 flores, es porque realmente te importa este pequeño jardín. Eso significa el mundo para mí.

Quiero que sepas que no importa qué pase, estaré aquí. En los días buenos y en los difíciles. Cuando rías y cuando llores. Siempre.

Porque tú no eres solo alguien especial, eres MI alguien especial. La persona con quien quiero compartir todos mis tomorrows.

Este jardín es solo el comienzo. Hay tantas cosas que quiero hacer contigo, tantos lugares que quiero visitar, tantos momentos que quiero crear.

Gracias por existir. Gracias por ser tú. Gracias por dejarme amarte.

Te amo hoy, mañana y siempre. 

Para siempre tuyo,
Dario 💖🌸`
            }
        ];
        
        this.unlockedLetters = this.loadUnlockedLetters();
        this.init();
    }
    
    init() {
        // Botón para abrir modal de cartas
        document.getElementById('lettersToggle').addEventListener('click', () => {
            this.showLettersModal();
        });
        
        // Cerrar modales
        document.getElementById('closeLetters').addEventListener('click', () => {
            document.getElementById('loveLettersModal').classList.add('hidden');
        });
        
        document.getElementById('closeReadLetter').addEventListener('click', () => {
            document.getElementById('readLetterModal').classList.add('hidden');
        });
    }
    
    loadUnlockedLetters() {
        const saved = localStorage.getItem('unlockedLetters');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveUnlockedLetters() {
        localStorage.setItem('unlockedLetters', JSON.stringify(this.unlockedLetters));
    }
    
    checkUnlocks(flowerCount) {
        this.letters.forEach(letter => {
            if (flowerCount >= letter.unlockAt && !this.unlockedLetters.includes(letter.id)) {
                this.unlockLetter(letter.id);
            }
        });
    }
    
    unlockLetter(letterId) {
        if (!this.unlockedLetters.includes(letterId)) {
            this.unlockedLetters.push(letterId);
            this.saveUnlockedLetters();
            
            const letter = this.letters.find(l => l.id === letterId);
            if (letter) {
                garden.showNotification(`¡Nueva carta desbloqueada! 💌 "${letter.title}"`, 'success');
                
                // Efecto especial
                this.createUnlockEffect();
            }
        }
    }
    
    createUnlockEffect() {
        // Crear efecto de corazones flotantes
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = '💌';
                heart.style.position = 'fixed';
                heart.style.left = Math.random() * window.innerWidth + 'px';
                heart.style.top = window.innerHeight + 'px';
                heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
                heart.style.zIndex = '9999';
                heart.style.pointerEvents = 'none';
                heart.style.animation = 'floatUpLetter 3s ease-out forwards';
                document.body.appendChild(heart);
                
                setTimeout(() => heart.remove(), 3000);
            }, i * 100);
        }
    }
    
    showLettersModal() {
        const modal = document.getElementById('loveLettersModal');
        modal.classList.remove('hidden');
        this.renderLetters();
    }
    
    renderLetters() {
        const grid = document.getElementById('lettersGrid');
        grid.innerHTML = '';
        
        this.letters.forEach(letter => {
            const isUnlocked = this.unlockedLetters.includes(letter.id);
            const card = document.createElement('div');
            card.className = `letter-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            
            card.innerHTML = `
                <span class="letter-icon">${letter.icon}</span>
                <div class="letter-title">${letter.title}</div>
                <div class="letter-unlock-requirement">
                    ${isUnlocked ? '✓ Desbloqueada' : `🔒 ${letter.unlockAt} flores`}
                </div>
            `;
            
            if (isUnlocked) {
                card.addEventListener('click', () => this.readLetter(letter));
            }
            
            grid.appendChild(card);
        });
    }
    
    readLetter(letter) {
        document.getElementById('loveLettersModal').classList.add('hidden');
        
        const modal = document.getElementById('readLetterModal');
        document.getElementById('letterDate').textContent = letter.date;
        document.getElementById('letterContent').textContent = letter.content;
        
        modal.classList.remove('hidden');
        
        // Animación de apertura
        const envelope = modal.querySelector('.letter-envelope');
        envelope.style.animation = 'openEnvelope 0.8s ease-out';
    }
}

// Agregar animación CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
@keyframes floatUpLetter {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
    }
}

@keyframes openEnvelope {
    0% {
        transform: scale(0.5) rotateY(180deg);
        opacity: 0;
    }
    100% {
        transform: scale(1) rotateY(0deg);
        opacity: 1;
    }
}
`;
document.head.appendChild(style);

// Variables globales
let musicPlayer;
let loveLettersSystem;
