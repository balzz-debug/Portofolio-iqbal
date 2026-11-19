/**
 * Yudha Pradana - Portfolio 2025
 * Core Script: Slide Deck Controller, Web Audio Synthesizer,
 * Particle Canvas, Lightbox & Interactive Game Elements.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       STATE & CONFIGURATION
       ========================================================================== */
    const state = {
        currentSlide: 0,
        totalSlides: 4,
        viewMode: localStorage.getItem('portfolio_view_mode') || 'slide',
        audioEnabled: localStorage.getItem('portfolio_audio') !== 'false',
        particlesEnabled: localStorage.getItem('portfolio_particles') !== 'false',
        lightboxIndex: 0
    };

    /* ==========================================================================
       WEB AUDIO SYNTHESIZER (ZERO EXTERNAL ASSETS NEEDED)
       ========================================================================== */
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playHoverSound() {
        if (!state.audioEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(850, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {
            // Audio context not allowed before user interaction
        }
    }

    function playClickSound() {
        if (!state.audioEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.09);
        } catch (e) {}
    }

    function playSlideSound() {
        if (!state.audioEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.16);
        } catch (e) {}
    }

    // Attach hover & click sound listeners to interactive elements
    function attachSoundTriggers() {
        const hoverTargets = document.querySelectorAll('button, a, .mosaic-item, .skill-badge, .archive-card, .dot-item');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => playHoverSound());
            el.addEventListener('click', () => playClickSound());
        });
    }

    /* ==========================================================================
       SLIDE DECK NAVIGATION
       ========================================================================== */
    const slides = document.querySelectorAll('.slide-card');
    const dots = document.querySelectorAll('.dot-item');
    const slideNumDisplay = document.getElementById('current-slide-num');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');

    function goToSlide(index) {
        if (state.viewMode === 'scroll') {
            const targetSlide = document.getElementById(`slide-${index + 1}`);
            if (targetSlide) {
                targetSlide.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        if (index < 0) index = 0;
        if (index >= state.totalSlides) index = state.totalSlides - 1;

        if (state.currentSlide === index && slides[index].classList.contains('active')) return;

        state.currentSlide = index;

        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === index);
        });

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === index);
        });

        if (slideNumDisplay) {
            slideNumDisplay.textContent = index + 1;
        }

        // Update pill navigation buttons in slides
        updatePillsForSlide(index);

        playSlideSound();
    }

    function updatePillsForSlide(slideIndex) {
        // slide 1 (idx 0): Hero
        // slide 2 (idx 1): PROFIL
        // slide 3 (idx 2): PROJECT
        // slide 4 (idx 3): CONTACT PERSON
        const targetId = `slide-${slideIndex + 1}`;
        document.querySelectorAll('.nav-pill').forEach(pill => {
            const target = pill.getAttribute('data-target');
            pill.classList.toggle('active', target === targetId);
        });
    }

    // Event listeners for slide deck controls
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(state.currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(state.currentSlide + 1));

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => goToSlide(idx));
    });

    // Pill Navigation buttons (Top pills on slides 2, 3, 4)
    document.querySelectorAll('.nav-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            const targetId = pill.getAttribute('data-target');
            if (targetId) {
                const targetIdx = parseInt(targetId.replace('slide-', '')) - 1;
                goToSlide(targetIdx);
            }
        });
    });

    // Hero Game Menu Buttons
    const btnStart = document.getElementById('btn-start');
    if (btnStart) {
        btnStart.addEventListener('click', () => goToSlide(1)); // to Profil
    }

    const btnRestart = document.getElementById('btn-restart');
    if (btnRestart) {
        btnRestart.addEventListener('click', () => goToSlide(0)); // to Hero
    }

    // Keyboard Navigation
    window.addEventListener('keydown', (e) => {
        // If modal is open, let modal handle it
        if (document.querySelector('.lightbox-modal.active') ||
            document.querySelector('.options-modal.active')) {
            return;
        }

        switch (e.key) {
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                goToSlide(state.currentSlide + 1);
                break;
            case 'ArrowLeft':
            case 'PageUp':
                goToSlide(state.currentSlide - 1);
                break;
            case '1':
                goToSlide(0);
                break;
            case '2':
                goToSlide(1);
                break;
            case '3':
                goToSlide(2);
                break;
            case '4':
                goToSlide(3);
                break;
        }
    });

    /* ==========================================================================
       VIEW MODE TOGGLE (SLIDE vs SCROLL)
       ========================================================================== */
    const viewModeBtn = document.getElementById('view-mode-toggle');
    const optViewSelect = document.getElementById('opt-viewmode-select');

    function applyViewMode(mode) {
        state.viewMode = mode;
        localStorage.setItem('portfolio_view_mode', mode);
        document.body.classList.remove('mode-slide', 'mode-scroll');
        document.body.classList.add(`mode-${mode}`);

        if (viewModeBtn) {
            const label = viewModeBtn.querySelector('.btn-label');
            if (label) label.textContent = mode === 'slide' ? 'Slide View' : 'Scroll View';
        }
        if (optViewSelect) {
            optViewSelect.value = mode;
        }

        if (mode === 'slide') {
            goToSlide(state.currentSlide);
        }
    }

    if (viewModeBtn) {
        viewModeBtn.addEventListener('click', () => {
            applyViewMode(state.viewMode === 'slide' ? 'scroll' : 'slide');
        });
    }

    if (optViewSelect) {
        optViewSelect.addEventListener('change', (e) => {
            applyViewMode(e.target.value);
        });
    }

    applyViewMode(state.viewMode);

    /* ==========================================================================
       AUDIO & FULLSCREEN CONTROLS
       ========================================================================== */
    const audioBtn = document.getElementById('audio-toggle');
    const iconOn = document.getElementById('audio-icon-on');
    const iconOff = document.getElementById('audio-icon-off');
    const optSfxCheck = document.getElementById('opt-sfx-check');

    function setAudioEnabled(enabled) {
        state.audioEnabled = enabled;
        localStorage.setItem('portfolio_audio', enabled);
        if (iconOn && iconOff) {
            iconOn.classList.toggle('hidden', !enabled);
            iconOff.classList.toggle('hidden', enabled);
        }
        if (optSfxCheck) optSfxCheck.checked = enabled;
    }

    if (audioBtn) {
        audioBtn.addEventListener('click', () => setAudioEnabled(!state.audioEnabled));
    }
    if (optSfxCheck) {
        optSfxCheck.addEventListener('change', (e) => setAudioEnabled(e.target.checked));
    }
    setAudioEnabled(state.audioEnabled);

    // Fullscreen Toggle
    const fsBtn = document.getElementById('fullscreen-toggle');
    if (fsBtn) {
        fsBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });
    }

    /* ==========================================================================
       AMBIENT CANVAS PARTICLES (Embers & Sparks)
       ========================================================================== */
    const canvas = document.getElementById('particles-canvas');
    let ctx = canvas ? canvas.getContext('2d') : null;
    let particles = [];
    let animationFrameId = null;

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * (canvas ? canvas.width : window.innerWidth);
            this.y = (canvas ? canvas.height : window.innerHeight) + Math.random() * 50;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = -(Math.random() * 1.4 + 0.6);
            this.size = Math.random() * 2.5 + 1;
            this.alpha = Math.random() * 0.7 + 0.2;
            this.color = Math.random() > 0.4 ? '0, 240, 255' : '255, 120, 40'; // cyan or ember flame
            this.life = Math.random() * 180 + 100;
            this.currentLife = 0;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.currentLife++;

            if (this.currentLife >= this.life || this.y < -20) {
                this.reset();
            }
        }

        draw() {
            if (!ctx) return;
            const progress = this.currentLife / this.life;
            const currentAlpha = this.alpha * (1 - progress);

            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${currentAlpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `rgba(${this.color}, 0.8)`;
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        if (!canvas || !ctx) return;
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        particles = [];
        const count = window.innerWidth < 768 ? 25 : 55;
        for (let i = 0; i < count; i++) {
            const p = new Particle();
            p.y = Math.random() * canvas.height; // scatter initially
            particles.push(p);
        }

        function loop() {
            if (!state.particlesEnabled) {
                animationFrameId = requestAnimationFrame(loop);
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(loop);
        }
        loop();
    }

    const optParticlesCheck = document.getElementById('opt-particles-check');
    if (optParticlesCheck) {
        optParticlesCheck.addEventListener('change', (e) => {
            state.particlesEnabled = e.target.checked;
            localStorage.setItem('portfolio_particles', state.particlesEnabled);
        });
    }

    initParticles();

    /* ==========================================================================
       INTERACTIVE LIGHTBOX MODAL
       ========================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCat = document.getElementById('lightbox-cat');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxTools = document.getElementById('lightbox-tools');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const mosaicItems = Array.from(document.querySelectorAll('.mosaic-item, .archive-card'));

    function openLightbox(index) {
        if (index < 0 || index >= mosaicItems.length) return;
        state.lightboxIndex = index;

        const item = mosaicItems[index];
        const isArchive = item.classList.contains('archive-card');

        let img = item.getAttribute('data-img') || '';
        let title = item.getAttribute('data-title') || 'Project Preview';
        let cat = item.getAttribute('data-cat') || (isArchive ? 'portofolio' : 'Cooming soon');
        let tools = item.getAttribute('data-tools') || (isArchive ? 'portofolio ' : 'cooming soon');
        let desc = item.getAttribute('data-desc') || (isArchive ? 'cooming soon' : 'Portofolio.');

        if (lightboxImg) lightboxImg.src = img;
        if (lightboxCat) lightboxCat.textContent = cat;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxTools) lightboxTools.textContent = tools;
        if (lightboxDesc) lightboxDesc.textContent = desc;

        if (lightbox) lightbox.classList.add('active');
        playClickSound();
    }

    function closeLightbox() {
        if (lightbox) lightbox.classList.remove('active');
    }

    mosaicItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            let nextIdx = state.lightboxIndex - 1;
            if (nextIdx < 0) nextIdx = mosaicItems.length - 1;
            openLightbox(nextIdx);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            let nextIdx = state.lightboxIndex + 1;
            if (nextIdx >= mosaicItems.length) nextIdx = 0;
            openLightbox(nextIdx);
        });
    }

    /* ==========================================================================
       OPTIONS & EXIT MODALS
       ========================================================================== */
    const optionsModal = document.getElementById('options-modal');
    const btnOptions = document.getElementById('btn-options');
    const optionsClose = document.getElementById('options-close');
    const optionsSave = document.getElementById('options-save');

    function openOptions() {
        if (optionsModal) optionsModal.classList.add('active');
        playClickSound();
    }

    function closeOptions() {
        if (optionsModal) optionsModal.classList.remove('active');
    }

    if (btnOptions) btnOptions.addEventListener('click', openOptions);
    if (optionsClose) optionsClose.addEventListener('click', closeOptions);
    if (optionsSave) optionsSave.addEventListener('click', closeOptions);
    const optBackdrop = document.querySelector('.options-backdrop');
    if (optBackdrop) optBackdrop.addEventListener('click', closeOptions);

    // Exit Dialog
    const exitModal = document.getElementById('exit-modal');
    const btnExit = document.getElementById('btn-exit');
    const exitClose = document.getElementById('exit-close');
    const exitStayBtn = document.getElementById('exit-stay-btn');

    function openExit() {
        if (exitModal) exitModal.classList.add('active');
        playClickSound();
    }

    function closeExit() {
        if (exitModal) exitModal.classList.remove('active');
    }

    if (btnExit) btnExit.addEventListener('click', openExit);
    if (exitClose) exitClose.addEventListener('click', closeExit);
    if (exitStayBtn) exitStayBtn.addEventListener('click', closeExit);

    // Global Esc key to close all modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeOptions();
            closeExit();
        }
    });

    /* ==========================================================================
       TOAST NOTIFICATION (Copy to clipboard)
       ========================================================================== */
    const toast = document.getElementById('toast');
    let toastTimeout = null;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    document.querySelectorAll('.social-channel-item').forEach(item => {
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const handle = item.getAttribute('data-handle');
            if (handle) {
                navigator.clipboard.writeText(handle).then(() => {
                    showToast(`Copied ${handle} to clipboard!`);
                });
            }
        });
    });

    // Touch Swipe for mobile slides
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (state.viewMode === 'scroll') return;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 60) {
            if (diff < 0) {
                goToSlide(state.currentSlide + 1);
            } else {
                goToSlide(state.currentSlide - 1);
            }
        }
    }

    // Initialize sound hooks
    attachSoundTriggers();

    console.log('Portfolio 2026 loaded successfully for balzz.');
});
