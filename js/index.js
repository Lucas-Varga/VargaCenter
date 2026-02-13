class VargaCenterAnimations {
    constructor() {
        this.init();
    }

    init() {
        console.log('Varga Center iniciado!');
        
        // Aguardar o DOM carregar completamente
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAnimations();
            });
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        this.replaceAnimationClasses();
        this.setupScrollAnimations();
        this.setupCarousel();
        this.setupParallax();
        this.setupButtonEffects();
    }

    // Substituir as classes CSS antigas pelas novas classes JS
    replaceAnimationClasses() {
        // autoBlur → js-blur-effect
        document.querySelectorAll('.autoBlur').forEach(element => {
            element.classList.remove('autoBlur');
            element.classList.add('js-blur-effect');
        });

        // autoTakeFull → js-scale-effect
        document.querySelectorAll('.autoTakeFull').forEach(element => {
            element.classList.remove('autoTakeFull');
            element.classList.add('js-scale-effect');
        });

        // autoDisplay → js-fade-in
        document.querySelectorAll('.autoDisplay').forEach(element => {
            element.classList.remove('autoDisplay');
            element.classList.add('js-fade-in');
        });
    }

    // Configurar animações de scroll
    setupScrollAnimations() {
        // Observer para fade-in (cards)
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observer para blur effect (hero)
        const blurObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const scrollProgress = 1 - entry.intersectionRatio;
                
                if (scrollProgress > 0.6) {
                    entry.target.classList.add('animate');
                } else {
                    entry.target.classList.remove('animate');
                }
            });
        }, {
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        });

        // Observer para scale effect (image-box)
        const scaleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0.7) {
                    entry.target.classList.add('animate');
                } else {
                    entry.target.classList.remove('animate');
                }
            });
        }, {
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        });

        // Aplicar observers
        document.querySelectorAll('.js-fade-in').forEach(el => {
            fadeInObserver.observe(el);
        });

        document.querySelectorAll('.js-blur-effect').forEach(el => {
            blurObserver.observe(el);
        });

        document.querySelectorAll('.js-scale-effect').forEach(el => {
            scaleObserver.observe(el);
        });
    }

    // Carousel infinito
    setupCarousel() {
        const track = document.querySelector('.carousel-track');
        if (!track) return;

        // Clonar cards para efeito infinito
        const cards = Array.from(track.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });

        let position = 0;
        const speed = 1; // velocidade em pixels
        let isPaused = false;

        const animate = () => {
            if (!isPaused) {
                position -= speed;
                
                // Reset quando chegar na metade (onde estão os clones)
                if (Math.abs(position) >= (cards.length * 380)) {
                    position = 0;
                }
                
                track.style.transform = `translateX(${position}px)`;
            }
            requestAnimationFrame(animate);
        };

        // Pausar no hover
        track.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        track.addEventListener('mouseleave', () => {
            isPaused = false;
        });

        // Iniciar animação
        animate();
    }

    // Efeito parallax no hero
    setupParallax() {
        const heroVideo = document.querySelector('.hero-video');
        const performanceText = document.querySelector('.performance-text');

        if (!heroVideo || !performanceText) return;

        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            const rate2 = scrolled * 0.3;

            if (scrolled < window.innerHeight) {
                heroVideo.style.transform = `translateY(${rate}px)`;
                performanceText.style.transform = `translateY(${rate2}px)`;
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // Efeitos nos botões
    setupButtonEffects() {
        const buttons = document.querySelectorAll('button');

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });

            // Efeito hover suave
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }

    // Efeito ripple nos botões
    createRipple(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;

        // Garantir que o botão tenha position relative
        const originalPosition = button.style.position;
        button.style.position = 'relative';
        button.style.overflow = 'hidden';

        button.appendChild(ripple);

        // Remover o ripple após a animação
        setTimeout(() => {
            ripple.remove();
            if (!originalPosition) {
                button.style.position = '';
            }
        }, 600);
    }
}

// Adicionar CSS para o efeito ripple
const rippleCSS = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

// Injetar CSS no head
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Inicializar quando a página carregar
new VargaCenterAnimations();