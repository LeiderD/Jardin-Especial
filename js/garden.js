// Jardín Interactivo - Clase Principal del Jardín
// Maneja la lógica principal del jardín interactivo

class GardenManager {
    constructor() {
        this.flowerCount = 0;
        this.usedMessages = [];
        this.currentSeason = this.getCurrentSeason();
        this.achievements = new Set();
        this.garden = document.getElementById('garden');
        this.flowerCountEl = document.getElementById('flowerCount');
        this.achievementsEl = document.getElementById('achievements');
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
        this.createAchievementPanel();
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
        this.checkAchievements();
        this.saveProgress();
        
        this.soundManager.play('grow');
        this.effectsManager.createGrowthParticles(x, y, flower.colors[0]);

        // Llamar función global para primera flor si existe
        if (this.flowerCount === 1 && typeof onFirstFlowerCreated === 'function') {
            onFirstFlowerCreated();
        }
    }

    getRandomMessage() {
        const allMessages = [
            ...GardenConfig.messages.romantic,
            ...GardenConfig.messages.inspiring,
            ...GardenConfig.messages.caring
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

    checkAchievements() {
        const achievements = GardenConfig.achievements;
        
        if (this.flowerCount === 1 && !this.achievements.has('firstFlower')) {
            this.unlockAchievement('firstFlower');
        }
        if (this.flowerCount === 10 && !this.achievements.has('florist')) {
            this.unlockAchievement('florist');
        }
        if (this.flowerCount === 25 && !this.achievements.has('gardener')) {
            this.unlockAchievement('gardener');
        }
        if (this.flowerCount === 50 && !this.achievements.has('botanist')) {
            this.unlockAchievement('botanist');
        }
    }

    unlockAchievement(achievementKey) {
        this.achievements.add(achievementKey);
        const achievement = GardenConfig.achievements[achievementKey];
        this.showAchievementNotification(achievement);
        this.updateAchievementPanel();
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <h3>¡Logro Desbloqueado!</h3>
                <p><strong>${achievement.name}</strong></p>
                <p>${achievement.description}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        this.soundManager.play('achievement');
        
        setTimeout(() => notification.remove(), 5000);
    }

    setupEventListeners() {
        this.garden.addEventListener('click', (e) => {
            if (e.target === this.garden || e.target.classList.contains('instruction')) {
                const rect = this.garden.getBoundingClientRect();
                const x = e.clientX - rect.left - 20;
                const y = e.clientY - rect.top - 40;
                
                if (x > 20 && x < rect.width - 40 && y > 20 && y < rect.height - 60) {
                    this.createFlower(x, y);
                    
                    const instruction = this.garden.querySelector('.instruction');
                    // En móviles, ocultar siempre las instrucciones al crear flor
                    // En desktop, solo ocultar en la primera flor
                    const isMobile = window.innerWidth <= 768;
                    if (instruction && (isMobile || this.flowerCount === 1)) {
                        instruction.style.display = 'none';
                        
                        // Llamar a la función de primera flor si aplica
                        if (this.flowerCount === 1 && typeof onFirstFlowerCreated === 'function') {
                            onFirstFlowerCreated();
                        }
                    }
                }
            }
        });

        // Atajos de teclado
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
            achievements: Array.from(this.achievements),
            usedMessages: this.usedMessages,
            currentSeason: this.currentSeason
        });
    }

    loadProgress() {
        const data = this.storageManager.load();
        if (data) {
            this.flowerCount = data.flowerCount || 0;
            this.achievements = new Set(data.achievements || []);
            this.usedMessages = data.usedMessages || [];
            this.currentSeason = data.currentSeason || this.getCurrentSeason();
            this.updateFlowerCount();
            this.updateAchievementPanel();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
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
        const currentIndex = seasons.indexOf(this.currentSeason);
        this.currentSeason = seasons[(currentIndex + 1) % seasons.length];
        document.querySelector('.season-indicator span').textContent = `Estación: ${this.currentSeason}`;
        this.saveProgress();
    }

    createThemeSelector() {
        // Implementar selector de temas
    }

    createAchievementPanel() {
        const panel = document.createElement('div');
        panel.id = 'achievements';
        panel.className = 'achievements-panel';
        
        // Crear botón toggle para móviles
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'achievements-toggle';
        toggleBtn.innerHTML = '🏆';
        toggleBtn.title = 'Ver/Ocultar Logros';
        
        // Crear contenido colapsable
        const content = document.createElement('div');
        content.className = 'achievements-content';
        content.innerHTML = '<h3>Logros</h3><div class="achievements-list"></div>';
        
        // Event listener para toggle
        toggleBtn.addEventListener('click', () => {
            panel.classList.toggle('collapsed');
            const isCollapsed = panel.classList.contains('collapsed');
            toggleBtn.setAttribute('aria-expanded', !isCollapsed);
        });
        
        panel.appendChild(toggleBtn);
        panel.appendChild(content);
        
        // Empezar siempre colapsado (botón)
        panel.classList.add('collapsed');
        toggleBtn.setAttribute('aria-expanded', 'false');
        
        document.body.appendChild(panel);
        this.updateAchievementPanel();
    }

    updateAchievementPanel() {
        const list = document.querySelector('.achievements-list');
        list.innerHTML = '';
        
        Object.entries(GardenConfig.achievements).forEach(([key, achievement]) => {
            const item = document.createElement('div');
            item.className = `achievement-item ${this.achievements.has(key) ? 'unlocked' : 'locked'}`;
            item.innerHTML = `
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-info">
                    <strong>${achievement.name}</strong>
                    <p>${achievement.description}</p>
                </div>
            `;
            list.appendChild(item);
        });
    }

    resetGarden() {
        if (confirm('¿Estás seguro de que quieres reiniciar el jardín?')) {
            this.garden.querySelectorAll('.flower').forEach(flower => flower.remove());
            this.flowerCount = 0;
            this.usedMessages = [];
            this.achievements.clear();
            this.updateFlowerCount();
            this.updateAchievementPanel();
            this.saveProgress();
            document.querySelector('.instruction').style.display = 'block';
        }
    }
}