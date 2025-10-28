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
            "Cada conversación contigo hace mi día mejor 💬",
            "Tu mirada tiene algo especial que me cautiva 👀✨",
            "Me encanta cómo te emociona las pequeñas cosas de la vida 🌟",
            "Eres la razón por la que mis días son más brillantes 🌞",
            "Tu energía positiva es contagiosa y hermosa 💫",
            "Cada momento contigo es un regalo que atesoro 🎁",
            "Tu forma de expresarte me fascina completamente 💭",
            "Eres la persona más genuina que conozco 💝",
            "Me encanta tu forma única de ver el mundo 🌍✨",
            "Tu presencia ilumina cualquier lugar donde estés 🌟",
            "Eres extraordinaria en tantas formas que no puedo contarlas 💖"
        ],
        inspiring: [
            "Eres una persona genuina y auténtica, eso es hermoso 💎",
            "Tu creatividad y pasión son inspiradoras 🎨",
            "Eres fuerte y valiente, aunque a veces no lo notes 💪",
            "Tu forma de pensar me fascina 💭✨",
            "Eres única y eso te hace increíble 🦋",
            "Tu determinación para lograr tus sueños es admirable 🎯",
            "Tienes una capacidad increíble para superar obstáculos 🏔️",
            "Tu inteligencia emocional es algo que realmente valoro 🧠💖",
            "Admiro tu constancia y dedicación en todo lo que haces ⭐",
            "Tienes un don especial para inspirar a otros 🌟",
            "Tu resiliencia ante las dificultades es inspiradora 🌱",
            "Eres capaz de lograr cosas increíbles, no lo dudes nunca 🚀",
            "Tu perspectiva única hace la diferencia donde estés 👁️✨",
            "Admiro cómo te mantienes fiel a ti misma 💪💕",
            "Tienes un talento natural que merece brillar 🌟"
        ],
        caring: [
            "Me gusta cómo te preocupas por las personas que quieres 💝",
            "Tienes un corazón enorme y generoso ❤️",
            "Tu presencia hace que todo sea más especial 🌈",
            "Me encanta lo apasionada que eres con lo que te gusta 🔥",
            "Tienes un talento especial para hacer sentir bien a los demás 🤗",
            "Tu empatía y comprensión son cualidades hermosas 💙",
            "Sabes escuchar de una manera que pocos pueden 👂💖",
            "Tu bondad hace de este mundo un lugar mejor 🌍✨",
            "Eres un refugio seguro para quienes te rodean 🏡💕",
            "Tu capacidad de amar es algo verdaderamente especial ❤️",
            "Siempre sabes qué decir para animar a los demás 💬✨",
            "Tu calor humano es algo que el mundo necesita más 🔥💖",
            "Tienes una luz interior que brilla intensamente 💡",
            "Tu sensibilidad es una fortaleza, no una debilidad 🌸",
            "Eres un ejemplo de amor y compasión genuinos 💝🌟"
        ],
        missing: [
            "Te extraño más de lo que las palabras pueden expresar 💔",
            "Cada día sin verte se siente incompleto 🌙",
            "Extraño tu presencia, tu voz, todo de ti 💭💕",
            "No pasa un momento sin que piense en ti 🕰️💖",
            "La distancia no cambia lo mucho que te extraño 🌍💔"
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
    }
};