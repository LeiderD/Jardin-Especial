// Jardín Interactivo - Gestores de Utilidades
// Maneja sonidos, almacenamiento y otras utilidades

class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = GardenConfig.effects.sounds.enabled;
        this.volume = GardenConfig.effects.sounds.volume;
        this.audioContext = null;
        
        this.init();
    }

    init() {
        if (this.enabled) {
            this.loadSounds();
            this.createAudioContext();
        }
    }

    createAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API no soportada');
            this.enabled = false;
        }
    }

    loadSounds() {
        // Crear sonidos sintéticos para evitar dependencias externas
        this.createSyntheticSounds();
    }

    createSyntheticSounds() {
        // Sonido de crecimiento - acorde ascendente suave
        this.sounds.grow = () => this.playTone([440, 554.37, 659.25], 0.3, 'sine');
        
        // Sonido de click - tono corto y dulce
        this.sounds.click = () => this.playTone([880], 0.1, 'sine');
        
        // Sonido de logro - acorde triunfal
        this.sounds.achievement = () => this.playTone([523.25, 659.25, 783.99], 0.5, 'triangle');
    }

    playTone(frequencies, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;

        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume / frequencies.length, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime + index * 0.1);
            oscillator.stop(this.audioContext.currentTime + duration + index * 0.1);
        });
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
}

class StorageManager {
    constructor() {
        this.storageKey = 'romanticGarden';
    }

    save(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (e) {
            console.warn('No se puede guardar en localStorage:', e);
        }
    }

    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('No se puede cargar desde localStorage:', e);
            return null;
        }
    }

    clear() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (e) {
            console.warn('No se puede limpiar localStorage:', e);
        }
    }
}

class ThemeManager {
    constructor() {
        this.currentTheme = 'romantic';
        this.themes = {
            romantic: {
                name: 'Romántico',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                accent: '#ff6b9d',
                text: '#ffffff'
            },
            dreamy: {
                name: 'Soñador',
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                accent: '#d946ef',
                text: '#1f2937'
            },
            nature: {
                name: 'Naturaleza',
                background: 'linear-gradient(135deg, #d299c2 0%, #fef9d3 100%)',
                accent: '#059669',
                text: '#065f46'
            },
            cosmic: {
                name: 'Cósmico',
                background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
                accent: '#fbbf24',
                text: '#ffffff'
            },
            sunset: {
                name: 'Atardecer',
                background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
                accent: '#f59e0b',
                text: '#7c2d12'
            }
        };
    }

    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.currentTheme = themeName;
            this.applyTheme(this.themes[themeName]);
        }
    }

    applyTheme(theme) {
        document.documentElement.style.setProperty('--bg-gradient', theme.background);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
        document.documentElement.style.setProperty('--text-color', theme.text);
    }

    getAvailableThemes() {
        return Object.entries(this.themes).map(([key, theme]) => ({
            key,
            name: theme.name
        }));
    }
}

class PersonalizationManager {
    constructor() {
        this.settings = {
            userName: '',
            partnerName: '',
            customMessages: [],
            favoriteColors: [],
            preferredFlowerTypes: []
        };
        
        this.load();
    }

    setUserName(name) {
        this.settings.userName = name;
        this.save();
        this.updatePersonalizedContent();
    }

    setPartnerName(name) {
        this.settings.partnerName = name;
        this.save();
        this.updatePersonalizedContent();
    }

    addCustomMessage(message) {
        this.settings.customMessages.push(message);
        this.save();
    }

    updatePersonalizedContent() {
        // Actualizar título si hay nombres personalizados
        if (this.settings.partnerName) {
            const title = document.querySelector('h1');
            title.textContent = `🌸 Un Jardín Especial Para ${this.settings.partnerName} 🌸`;
        }

        if (this.settings.userName) {
            const subtitle = document.querySelector('.subtitle');
            subtitle.textContent = `${this.settings.userName} tiene algo especial que decirte en cada flor...`;
        }
    }

    save() {
        localStorage.setItem('gardenPersonalization', JSON.stringify(this.settings));
    }

    load() {
        try {
            const saved = localStorage.getItem('gardenPersonalization');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Error loading personalization:', e);
        }
    }
}

// Utilidades adicionales
class Utils {
    static formatNumber(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    }

    static randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    static easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    static generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}