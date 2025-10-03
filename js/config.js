// Jardín Interactivo - Configuración Principal
// Author: Romance Garden Project
// Version: 2.0

const GardenConfig = {
    // Configuración de flores
    flowers: {
        types: ['rosa', 'tulipan', 'girasol', 'margarita', 'orquidea', 'lirio'],
        maxFlowers: 50,
        growthSpeed: 600,
        seasonalColors: {
            spring: [['#ff6b9d', '#ff8fab'], ['#c084fc', '#e9d5ff'], ['#fbbf24', '#fef3c7']],
            summer: [['#60a5fa', '#dbeafe'], ['#f472b6', '#fce7f3'], ['#10b981', '#d1fae5']],
            autumn: [['#f59e0b', '#fef3c7'], ['#dc2626', '#fee2e2'], ['#7c2d12', '#fed7aa']],
            winter: [['#6366f1', '#e0e7ff'], ['#8b5cf6', '#f3e8ff'], ['#06b6d4', '#cffafe']]
        }
    },

    // Configuración de mensajes
    messages: {
        romantic: [
            "Me encanta tu sonrisa, ilumina todo a tu alrededor ☀️",
            "Eres increíblemente inteligente y siempre me sorprendes 🧠✨",
            "Tu risa es mi sonido favorito en el mundo 🎵",
            "Admiro tu forma de ver la vida con tanto optimismo 🌟",
            "Cada conversación contigo hace mi día mejor 💬"
        ],
        inspiring: [
            "Eres una persona genuina y auténtica, eso es hermoso 💎",
            "Tu creatividad y pasión son inspiradoras 🎨",
            "Eres fuerte y valiente, aunque a veces no lo notes 💪",
            "Tu forma de pensar me fascina 💭✨",
            "Eres única y eso te hace increíble 🦋"
        ],
        caring: [
            "Me gusta cómo te preocupas por las personas que quieres 💝",
            "Tienes un corazón enorme y generoso ❤️",
            "Tu presencia hace que todo sea más especial 🌈",
            "Me encanta lo apasionada que eres con lo que te gusta 🔥",
            "Tienes un talento especial para hacer sentir bien a los demás 🤗"
        ]
    },

    // Configuración de efectos
    effects: {
        particles: {
            count: 12,
            lifetime: 3000,
            types: ['heart', 'star', 'sparkle', 'bubble']
        },
        sounds: {
            enabled: true,
            volume: 0.3,
            files: {
                grow: 'sounds/grow.mp3',
                click: 'sounds/click.mp3',
                ambient: 'sounds/ambient.mp3'
            }
        },
        animations: {
            duration: 600,
            easing: 'ease-out'
        }
    },

    // Configuración de personalización
    personalization: {
        themes: ['romantic', 'dreamy', 'nature', 'cosmic', 'sunset'],
        saveProgress: true,
        userName: '',
        partnerName: ''
    },

    // Configuración de gamificación
    achievements: {
        firstFlower: { name: "Primera Flor", description: "Cultivaste tu primera flor", icon: "🌸" },
        florist: { name: "Florista", description: "Cultivaste 10 flores", icon: "🌺" },
        gardener: { name: "Jardinero", description: "Cultivaste 25 flores", icon: "🌻" },
        botanist: { name: "Botánico", description: "Cultivaste 50 flores", icon: "🌿" },
        loveGarden: { name: "Jardín del Amor", description: "Completaste todos los mensajes", icon: "💕" }
    }
};