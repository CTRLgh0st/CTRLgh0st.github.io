document.addEventListener('DOMContentLoaded', () => {
    const glitchStatic = document.querySelector('.site-title');
    const originalText = 'CTRLgh0st';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

    // Create two glitch overlay layers
    for (let i = 0; i < 2; i++) {
        const overlay = document.createElement('span');
        overlay.className = 'glitch-overlay';
        overlay.textContent = originalText;
        glitchStatic.appendChild(overlay);
    }

    // Random character generator
    const randomChar = () => chars[Math.floor(Math.random() * chars.length)];

    // Glitch effect function
    function applyGlitch() {
        let currentText = originalText.split('');
        const glitchCount = Math.floor(Math.random() * 2) + 1; // 1-2 chars glitched
        for (let i = 0; i < glitchCount; i++) {
            const index = Math.floor(Math.random() * currentText.length);
            currentText[index] = randomChar();
        }
        glitchStatic.childNodes[0].textContent = currentText.join('');

        // Update overlay layers with slight delay
        setTimeout(() => {
            glitchStatic.querySelectorAll('.glitch-overlay').forEach((layer, idx) => {
                let layerText = originalText.split('');
                const layerGlitchCount = Math.floor(Math.random() * 2) + 1;
                for (let i = 0; i < layerGlitchCount; i++) {
                    const index = Math.floor(Math.random() * layerText.length);
                    layerText[index] = randomChar();
                }
                layer.textContent = layerText.join('');
            });
        }, 15);

        // Reset all to original text
        setTimeout(() => {
            glitchStatic.childNodes[0].textContent = originalText;
            glitchStatic.querySelectorAll('.glitch-overlay').forEach(layer => {
                layer.textContent = originalText;
            });
        }, 50);
    }

    // Run glitch effect at random intervals
    setInterval(() => {
        if (Math.random() > 0.5) { // 50% chance to glitch
            applyGlitch();
        }
    }, 150);

    // Occasional glitch burst
    setInterval(() => {
        if (Math.random() > 0.8) { // 20% chance for burst
            for (let i = 0; i < 2; i++) {
                setTimeout(applyGlitch, i * 30);
            }
        }
    }, 800);
});