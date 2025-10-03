// Jardín Interactivo - Gestor de Efectos Visuales
// Maneja partículas, animaciones y efectos especiales

class EffectsManager {
    constructor() {
        this.particlePool = [];
        this.activeParticles = [];
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.animationFrame = null;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.startAnimationLoop();
        this.createWeatherEffect();
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'effects-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '10';
        document.body.appendChild(canvas);
        return canvas;
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    startAnimationLoop() {
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.updateParticles();
            this.renderParticles();
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }

    createGrowthParticles(x, y, color) {
        const rect = garden.garden.getBoundingClientRect();
        const centerX = rect.left + x;
        const centerY = rect.top + y;
        
        for (let i = 0; i < GardenConfig.effects.particles.count; i++) {
            this.createParticle({
                x: centerX + (Math.random() - 0.5) * 20,
                y: centerY + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 3 - 1,
                color: color,
                type: 'growth',
                life: 1.0,
                decay: 0.02,
                size: Math.random() * 6 + 2
            });
        }
    }

    createClickParticles(x, y, color, flowerType) {
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = Math.random() * 3 + 2;
            
            this.createParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                type: this.getParticleType(flowerType),
                life: 1.0,
                decay: 0.015,
                size: Math.random() * 8 + 3,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2
            });
        }
    }

    getParticleType(flowerType) {
        const particleTypes = {
            rosa: 'heart',
            tulipan: 'star',
            girasol: 'sparkle',
            margarita: 'bubble',
            orquidea: 'heart',
            lirio: 'star'
        };
        return particleTypes[flowerType] || 'sparkle';
    }

    createParticle(properties) {
        const particle = this.particlePool.pop() || {};
        Object.assign(particle, properties);
        this.activeParticles.push(particle);
    }

    updateParticles() {
        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            const particle = this.activeParticles[i];
            
            // Actualizar posición
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // Gravedad
            
            // Actualizar rotación
            if (particle.rotation !== undefined) {
                particle.rotation += particle.rotationSpeed;
            }
            
            // Actualizar vida
            particle.life -= particle.decay;
            
            // Remover partículas muertas
            if (particle.life <= 0) {
                this.activeParticles.splice(i, 1);
                this.particlePool.push(particle);
            }
        }
    }

    renderParticles() {
        this.activeParticles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.translate(particle.x, particle.y);
            
            if (particle.rotation !== undefined) {
                this.ctx.rotate(particle.rotation);
            }
            
            this.renderParticleByType(particle);
            this.ctx.restore();
        });
    }

    renderParticleByType(particle) {
        switch (particle.type) {
            case 'heart':
                this.renderHeart(particle);
                break;
            case 'star':
                this.renderStar(particle);
                break;
            case 'sparkle':
                this.renderSparkle(particle);
                break;
            case 'bubble':
                this.renderBubble(particle);
                break;
            default:
                this.renderDefault(particle);
        }
    }

    renderHeart(particle) {
        const size = particle.size;
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, size / 4);
        this.ctx.bezierCurveTo(-size / 2, -size / 4, -size, size / 4, 0, size);
        this.ctx.bezierCurveTo(size, size / 4, size / 2, -size / 4, 0, size / 4);
        this.ctx.fill();
    }

    renderStar(particle) {
        const size = particle.size;
        const spikes = 5;
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        
        for (let i = 0; i < spikes * 2; i++) {
            const angle = (i * Math.PI) / spikes;
            const radius = i % 2 === 0 ? size : size / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    renderSparkle(particle) {
        const size = particle.size;
        this.ctx.fillStyle = particle.color;
        this.ctx.fillRect(-size / 2, -size / 2, size, size);
        
        // Agregar brillo cruzado
        this.ctx.fillRect(-size / 4, -size, size / 2, size * 2);
        this.ctx.fillRect(-size, -size / 4, size * 2, size / 2);
    }

    renderBubble(particle) {
        const size = particle.size;
        this.ctx.strokeStyle = particle.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Brillo en la burbuja
        this.ctx.fillStyle = particle.color + '30';
        this.ctx.fill();
    }

    renderDefault(particle) {
        const size = particle.size;
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    createWeatherEffect() {
        // Efecto de pétalos cayendo ocasionalmente
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% de probabilidad
                this.createFallingPetal();
            }
        }, 2000);
    }

    createFallingPetal() {
        const colors = ['#ff6b9d', '#c084fc', '#fbbf24', '#60a5fa'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        this.createParticle({
            x: Math.random() * window.innerWidth,
            y: -20,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 2 + 1,
            color: color,
            type: 'heart',
            life: 1.0,
            decay: 0.005,
            size: Math.random() * 12 + 8,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        });
    }

    // Efectos especiales para logros
    createAchievementEffect() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Explosión de partículas doradas
        for (let i = 0; i < 50; i++) {
            const angle = (i / 50) * Math.PI * 2;
            const speed = Math.random() * 5 + 3;
            
            this.createParticle({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: '#ffd700',
                type: 'star',
                life: 1.0,
                decay: 0.01,
                size: Math.random() * 10 + 5,
                rotation: 0,
                rotationSpeed: 0.2
            });
        }
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.canvas.remove();
    }
}