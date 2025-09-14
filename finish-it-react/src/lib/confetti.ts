export const mountConfetti = () => {
    const createSoftParticle = (x: number, y: number) => {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '12px';
        particle.style.height = '12px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        // Soft bright colors
        const colors = [
            '#667eea', // purple
            '#764ba2', // deep purple
            '#48bb78', // green
            '#38a169', // deep green
            '#a8edea', // soft cyan
            '#fed6e3', // soft pink
            '#d299c2', // soft purple
            '#fef9d7', // soft yellow
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = `linear-gradient(135deg, ${color}, ${color}dd)`;
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '30%';
        particle.style.boxShadow = `0 0 20px ${color}60, 0 4px 15px rgba(0, 0, 0, 0.1)`;
        
        document.body.appendChild(particle);
        
        // Gentle physics animation
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 15 + 10;
        const gravity = 0.4;
        const friction = 0.99;
        
        let vx = Math.cos(angle) * velocity;
        let vy = Math.sin(angle) * velocity;
        let currentX = x;
        let currentY = y;
        let rotation = 0;
        let scale = 1;
        
        const animate = () => {
            currentX += vx;
            currentY += vy;
            vy += gravity;
            vx *= friction;
            vy *= friction;
            rotation += 4;
            scale *= 0.997;
            
            particle.style.left = currentX + 'px';
            particle.style.top = currentY + 'px';
            particle.style.transform = `rotate(${rotation}deg) scale(${scale})`;
            particle.style.opacity = Math.max(0, 1 - (currentY - y) / 800).toString();
            
            if (currentY < window.innerHeight + 100 && parseFloat(particle.style.opacity) > 0 && scale > 0.1) {
                requestAnimationFrame(animate);
            } else {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            }
        };
        
        requestAnimationFrame(animate);
    };
    
    const createSparkle = (x: number, y: number) => {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.width = '8px';
        sparkle.style.height = '8px';
        sparkle.style.background = 'linear-gradient(135deg, #ffffff, #f7fafc)';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.8)';
        
        document.body.appendChild(sparkle);
        
        const duration = 1000 + Math.random() * 500;
        const distance = 60 + Math.random() * 120;
        const angle = Math.random() * Math.PI * 2;
        
        sparkle.animate([
            {
                transform: 'translate(0, 0) scale(0)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).onfinish = () => {
            if (document.body.contains(sparkle)) {
                document.body.removeChild(sparkle);
            }
        };
    };
    
    return (x: number, y: number) => {
        // Create soft particle explosion
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createSoftParticle(
                    x + (Math.random() - 0.5) * 100,
                    y + (Math.random() - 0.5) * 60
                );
            }, i * 15);
        }
        
        // Create sparkles
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                createSparkle(
                    x + (Math.random() - 0.5) * 150,
                    y + (Math.random() - 0.5) * 80
                );
            }, i * 25);
        }
        
        // Add soft flash effect
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '9998';
        
        document.body.appendChild(flash);
        
        flash.animate([
            {
                opacity: 1,
                transform: 'scale(0.9)'
            },
            {
                opacity: 0.7,
                transform: 'scale(1.1)'
            },
            {
                opacity: 0,
                transform: 'scale(1.3)'
            }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).onfinish = () => {
            if (document.body.contains(flash)) {
                document.body.removeChild(flash);
            }
        };
    };
};