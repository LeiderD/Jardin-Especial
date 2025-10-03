// Jardín Interactivo - Clase Flower
// Maneja la creación y comportamiento de flores individuales

class Flower {
    constructor(x, y, message, season = 'spring') {
        this.x = x;
        this.y = y;
        this.message = message;
        this.season = season;
        this.type = this.getRandomFlowerType();
        this.colors = this.getSeasonalColors(season);
        this.element = this.createElement();
        this.isBlossoming = false;
        
        this.setupEventListeners();
        this.startGrowthAnimation();
    }

    getRandomFlowerType() {
        const types = GardenConfig.flowers.types;
        return types[Math.floor(Math.random() * types.length)];
    }

    getSeasonalColors(season) {
        const seasonalColors = GardenConfig.flowers.seasonalColors[season];
        return seasonalColors[Math.floor(Math.random() * seasonalColors.length)];
    }

    createElement() {
        const flower = document.createElement('div');
        flower.className = `flower flower-${this.type}`;
        flower.style.left = this.x + 'px';
        flower.style.top = this.y + 'px';
        
        // Crear estructura de la flor
        flower.appendChild(this.createStem());
        flower.appendChild(this.createFlowerHead());
        
        return flower;
    }

    createStem() {
        const stem = document.createElement('div');
        stem.className = 'stem';
        
        // Agregar hojas
        for (let i = 0; i < 2; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.style.bottom = 20 + i * 15 + 'px';
            leaf.style.left = i === 0 ? '-10px' : '10px';
            leaf.style.transform = `rotate(${i === 0 ? -45 : 45}deg)`;
            stem.appendChild(leaf);
        }
        
        return stem;
    }

    createFlowerHead() {
        const head = document.createElement('div');
        head.className = 'flower-head';
        
        // Centro de la flor
        const center = document.createElement('div');
        center.className = 'flower-center';
        center.style.background = this.colors[0];
        center.style.boxShadow = `0 0 15px ${this.colors[0]}80`;
        
        // Crear pétalos según el tipo de flor
        const petals = this.createPetals();
        petals.forEach(petal => center.appendChild(petal));
        
        head.appendChild(center);
        return head;
    }

    createPetals() {
        const petals = [];
        const petalCount = this.getPetalCount();
        
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.background = `linear-gradient(135deg, ${this.colors[0]} 0%, ${this.colors[1]} 100%)`;
            petal.style.transform = `rotate(${i * (360 / petalCount)}deg) translateY(-15px)`;
            petal.style.animationDelay = `${i * 0.1}s`;
            petals.push(petal);
        }
        
        return petals;
    }

    getPetalCount() {
        const petalCounts = {
            rosa: 8,
            tulipan: 6,
            girasol: 12,
            margarita: 10,
            orquidea: 5,
            lirio: 6
        };
        return petalCounts[this.type] || 6;
    }

    setupEventListeners() {
        this.element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleClick(e);
        });

        this.element.addEventListener('mouseenter', () => {
            this.element.style.transform = 'scale(1.1) rotate(5deg)';
            this.createHoverEffect();
        });

        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    handleClick(e) {
        this.showMessage();
        this.createClickEffect(e.clientX, e.clientY);
        this.blossomAnimation();
        garden.soundManager.play('click');
    }

    showMessage() {
        const existing = document.querySelector('.message-box');
        if (existing) existing.remove();

        const messageBox = document.createElement('div');
        messageBox.className = 'message-box';
        messageBox.innerHTML = `
            <div class="message-header">
                <span class="flower-type">${this.type.charAt(0).toUpperCase() + this.type.slice(1)} ${this.getFlowerEmoji()}</span>
                <span class="close-btn" onclick="this.closest('.message-box').remove()">×</span>
            </div>
            <p class="message-text">${this.message}</p>
            <div class="message-footer">
                <button class="share-btn" data-message="${this.message.replace(/'/g, '&apos;')}">Compartir 💕</button>
                <button class="favorite-btn" data-message="${this.message.replace(/'/g, '&apos;')}">❤️</button>
            </div>
        `;
        
        garden.garden.appendChild(messageBox);
        
        // Configurar event listeners para los botones
        const shareBtn = messageBox.querySelector('.share-btn');
        const favoriteBtn = messageBox.querySelector('.favorite-btn');
        
        shareBtn.addEventListener('click', () => {
            this.shareMessage(this.message);
        });
        
        favoriteBtn.addEventListener('click', () => {
            this.toggleFavorite();
        });
        
        // Auto-cerrar después de 8 segundos
        setTimeout(() => {
            if (messageBox.parentElement) {
                messageBox.remove();
            }
        }, 8000);
    }

    getFlowerEmoji() {
        const emojis = {
            rosa: '🌹',
            tulipan: '🌷',
            girasol: '🌻',
            margarita: '🌼',
            orquidea: '🌺',
            lirio: '🌸'
        };
        return emojis[this.type] || '🌸';
    }

    createClickEffect(x, y) {
        garden.effectsManager.createClickParticles(x, y, this.colors[0], this.type);
    }

    createHoverEffect() {
        // Efecto sutil de brillos al hacer hover
        const sparkles = [];
        for (let i = 0; i < 3; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 60 + 'px';
            sparkle.style.top = Math.random() * 60 + 'px';
            sparkle.style.background = this.colors[1];
            this.element.appendChild(sparkle);
            sparkles.push(sparkle);
        }
        
        setTimeout(() => {
            sparkles.forEach(sparkle => sparkle.remove());
        }, 1000);
    }

    blossomAnimation() {
        if (this.isBlossoming) return;
        
        this.isBlossoming = true;
        this.element.classList.add('blossoming');
        
        setTimeout(() => {
            this.element.classList.remove('blossoming');
            this.isBlossoming = false;
        }, 1000);
    }

    startGrowthAnimation() {
        this.element.style.transform = 'scale(0) translateY(20px)';
        this.element.style.opacity = '0';
        
        setTimeout(() => {
            this.element.style.transition = 'all 0.6s ease-out';
            this.element.style.transform = 'scale(1) translateY(0)';
            this.element.style.opacity = '1';
        }, 100);
    }

    // Métodos para funcionalidades futuras
    shareMessage(message) {
        const shareText = `🌸 ${message}\n\n✨ Mensaje desde mi Jardín del Amor ✨`;
        
        if (navigator.share) {
            navigator.share({
                title: '🌸 Mensaje del Jardín del Amor',
                text: shareText
            }).catch(err => {
                // Si falla el Web Share API, usar fallback
                this.fallbackShare(shareText);
            });
        } else {
            // Fallback: copiar al portapapeles
            this.fallbackShare(shareText);
        }
    }
    
    fallbackShare(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                garden.showNotification('Mensaje copiado al portapapeles 💕');
            }).catch(() => {
                // Fallback para navegadores muy antiguos
                this.legacyShare(text);
            });
        } else {
            this.legacyShare(text);
        }
    }
    
    legacyShare(text) {
        // Crear un elemento temporal para copiar el texto
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            garden.showNotification('Mensaje copiado al portapapeles 💕');
        } catch (err) {
            garden.showNotification('No se pudo copiar el mensaje');
        }
        
        document.body.removeChild(textArea);
    }

    toggleFavorite() {
        // Implementar sistema de favoritos
        garden.showNotification('¡Mensaje agregado a favoritos! ⭐');
    }
}