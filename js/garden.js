// Jardín Interactivo - Clase Principal del Jardín
// Maneja la lógica principal del jardín interactivo

class GardenManager {
    constructor() {
        this.flowerCount = 0;
        this.usedMessages = [];
        this.currentSeason = this.getCurrentSeason();
        this.garden = document.getElementById('garden');
        this.flowerCountEl = document.getElementById('flowerCount');
        this.soundManager = new SoundManager();
        this.effectsManager = new EffectsManager();
        this.storageManager = new StorageManager();
        
        this.init();
        this.loadProgress();
    }

    init() {
        this.createStars();
        this.setupEventListeners();
        this.createSeasonIndicator();
        this.createThemeSelector();
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    createStars() {
        const starsContainer = document.getElementById('stars');
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = Math.random() * 3 + 1 + 'px';
            star.style.height = star.style.width;
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            starsContainer.appendChild(star);
        }
    }

    createFlower(x, y) {
        if (this.flowerCount >= GardenConfig.flowers.maxFlowers) {
            this.showNotification('¡Tu jardín está lleno! 🌺', 'warning');
            return;
        }

        const flower = new Flower(x, y, this.getRandomMessage(), this.currentSeason);
        this.garden.appendChild(flower.element);
        
        this.flowerCount++;
        this.updateFlowerCount();
        this.saveProgress();
        
        this.soundManager.play('grow');
        this.effectsManager.createGrowthParticles(x, y, flower.colors[0]);

        // Llamar función global para primera flor si existe
        if (this.flowerCount === 1 && typeof onFirstFlowerCreated === 'function') {
            onFirstFlowerCreated();
        }
        
        // Verificar cartas desbloqueables
        if (typeof loveLettersSystem !== 'undefined') {
            loveLettersSystem.checkUnlocks(this.flowerCount);
        }
    }

    getRandomMessage() {
        const allMessages = [
            ...GardenConfig.messages.romantic,
            ...GardenConfig.messages.inspiring,
            ...GardenConfig.messages.caring,
            ...GardenConfig.messages.missing
        ];

        if (this.usedMessages.length === allMessages.length) {
            this.usedMessages = [];
        }

        const availableMessages = allMessages.filter(m => !this.usedMessages.includes(m));
        const message = availableMessages[Math.floor(Math.random() * availableMessages.length)];
        this.usedMessages.push(message);
        
        return message;
    }

    updateFlowerCount() {
        this.flowerCountEl.textContent = this.flowerCount;
        this.flowerCountEl.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            this.flowerCountEl.style.animation = '';
        }, 500);
    }

    setupEventListeners() {
        // Soporte para eventos táctiles y de mouse
        const handleInteraction = (e) => {
            // Si el objetivo es un botón o control, no prevenir el comportamiento por defecto
            if (e.target.classList.contains('player-btn') || 
                e.target.classList.contains('control-btn') || 
                e.target.classList.contains('help-float-btn') ||
                e.target.classList.contains('volume-control')) {
                return;
            }
            
            if (e.target === this.garden || e.target.classList.contains('instruction')) {
                e.preventDefault(); // Prevenir comportamiento por defecto en móviles
                
                const rect = this.garden.getBoundingClientRect();
                let x, y;
                
                // Detectar si es touch o click
                if (e.type === 'touchstart' || e.type === 'touchend') {
                    const touch = e.changedTouches[0];
                    x = touch.clientX - rect.left - 20;
                    y = touch.clientY - rect.top - 40;
                } else {
                    x = e.clientX - rect.left - 20;
                    y = e.clientY - rect.top - 40;
                }
                
                // Márgenes de seguridad en móviles
                const isMobile = window.innerWidth <= 768;
                const leftMargin = isMobile ? 10 : 20;
                const topMargin = isMobile ? 10 : 20;
                // En móvil: margen mínimo ya que no hay botones laterales
                const rightMargin = isMobile ? 10 : 40;
                const bottomMargin = isMobile ? 10 : 60; // Mínimo porque el navbar está fijo
                
                if (x > leftMargin && 
                    x < rect.width - rightMargin && 
                    y > topMargin && 
                    y < rect.height - bottomMargin) {
                    this.createFlower(x, y);
                    
                    const instruction = this.garden.querySelector('.instruction');
                    // En móviles, ocultar siempre las instrucciones al crear flor
                    // En desktop, solo ocultar en la primera flor
                    if (instruction && (isMobile || this.flowerCount === 1)) {
                        instruction.style.display = 'none';
                        
                        // Llamar a la función de primera flor si aplica
                        if (this.flowerCount === 1 && typeof onFirstFlowerCreated === 'function') {
                            onFirstFlowerCreated();
                        }
                    }
                }
            }
        };
        
        // Eventos de mouse
        this.garden.addEventListener('click', handleInteraction);
        
        // Eventos táctiles para móviles
        this.garden.addEventListener('touchend', handleInteraction, { passive: false });
        
        // Prevenir zoom de doble toque en el jardín
        let lastTouchEnd = 0;
        this.garden.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });

        // Atajos de teclado (solo en desktop)
        document.addEventListener('keydown', (e) => {
            if (e.key === 's' || e.key === 'S') {
                this.changeSeason();
            }
            if (e.key === 't' || e.key === 'T') {
                this.toggleTheme();
            }
            if (e.key === 'r' || e.key === 'R') {
                this.resetGarden();
            }
        });
    }

    saveProgress() {
        this.storageManager.save({
            flowerCount: this.flowerCount,
            usedMessages: this.usedMessages,
            currentSeason: this.currentSeason
        });
    }

    loadProgress() {
        const data = this.storageManager.load();
        if (data) {
            this.flowerCount = data.flowerCount || 0;
            this.usedMessages = data.usedMessages || [];
            this.currentSeason = data.currentSeason || this.getCurrentSeason();
            this.updateFlowerCount();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Crear contenedor para el mensaje y el botón de cerrar
        const messageSpan = document.createElement('span');
        messageSpan.className = 'notification-message';
        messageSpan.textContent = message;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Cerrar notificación');
        
        // Añadir evento para cerrar manualmente
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notification.classList.add('notification-fade-out');
            setTimeout(() => notification.remove(), 300);
        });
        
        notification.appendChild(messageSpan);
        notification.appendChild(closeBtn);
        document.body.appendChild(notification);
        
        // Auto-cerrar después de 3 segundos
        const autoCloseTimer = setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.add('notification-fade-out');
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
        
        // Limpiar timer si se cierra manualmente
        notification.addEventListener('click', () => clearTimeout(autoCloseTimer));
    }

    createSeasonIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'season-indicator';
        indicator.innerHTML = `
            <span>Estación: ${this.currentSeason}</span>
            <button onclick="garden.changeSeason()">Cambiar (S)</button>
        `;
        document.body.appendChild(indicator);
    }

    changeSeason() {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        const seasonIcons = {
            spring: '🌸',
            summer: '☀️',
            autumn: '🍂',
            winter: '❄️'
        };
        const currentIndex = seasons.indexOf(this.currentSeason);
        this.currentSeason = seasons[(currentIndex + 1) % seasons.length];
        
        // Actualizar indicador de estación
        const seasonIndicator = document.querySelector('.season-indicator span');
        if (seasonIndicator) {
            seasonIndicator.textContent = `Estación: ${this.currentSeason}`;
        }
        
        // Actualizar ícono del botón
        const seasonBtn = document.getElementById('seasonToggle');
        if (seasonBtn) {
            seasonBtn.textContent = seasonIcons[this.currentSeason];
        }
        
        this.saveProgress();
    }

    createThemeSelector() {
        // Implementar selector de temas
    }

    resetGarden() {
        // Mostrar modal de confirmación personalizado
        this.showResetConfirmation();
    }
    
    showResetConfirmation() {
        const modal = document.getElementById('confirmResetModal');
        modal.classList.remove('hidden');
        
        // Configurar botones
        const confirmBtn = document.getElementById('confirmReset');
        const cancelBtn = document.getElementById('cancelReset');
        
        const handleConfirm = () => {
            this.executeReset();
            modal.classList.add('hidden');
            cleanup();
        };
        
        const handleCancel = () => {
            modal.classList.add('hidden');
            cleanup();
        };
        
        // Cerrar al hacer clic fuera del modal
        const handleClickOutside = (e) => {
            if (e.target === modal) {
                handleCancel();
            }
        };
        
        const cleanup = () => {
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
            modal.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
        
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        modal.addEventListener('click', handleClickOutside);
        
        // Cerrar con ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                handleCancel();
            }
        };
        document.addEventListener('keydown', handleEsc);
    }
    
    executeReset() {
        this.garden.querySelectorAll('.flower').forEach(flower => flower.remove());
        this.flowerCount = 0;
        this.usedMessages = [];
        this.updateFlowerCount();
        this.saveProgress();
        document.querySelector('.instruction').style.display = 'block';
        this.showNotification('Jardín reiniciado 🌱', 'info');
    }
}