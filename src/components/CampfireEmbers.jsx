import React, { useEffect, useRef } from 'react';

const CampfireEmbers = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let animationFrameId;

    // Handle Resize
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Particle Config
    const maxParticles = 50; // Keep it subtle and optimized
    
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        // Start near the bottom of the screen, slightly biased towards the center
        this.x = (Math.random() * canvas.width * 0.8) + (canvas.width * 0.1);
        this.y = canvas.height + Math.random() * 100;
        
        // Size: 1 to 4 pixels
        this.size = Math.random() * 3 + 1;
        
        // Speed: rise slowly, drift slightly sideways
        this.speedY = -(Math.random() * 1.5 + 0.5);
        this.speedX = (Math.random() - 0.5) * 1;
        
        // Embers are usually orange, red, or yellow
        const hue = Math.floor(Math.random() * 40 + 10); // 10 to 50
        this.color = `hsl(${hue}, 100%, 60%)`;
        
        // Lifespan & Opacity
        this.opacity = Math.random() * 0.5 + 0.3;
        this.decay = Math.random() * 0.005 + 0.002;
        
        // Wiggle for wind effect
        this.wiggleFactor = Math.random() * 0.05;
        this.angle = Math.random() * Math.PI * 2;
      }

      update() {
        this.y += this.speedY;
        
        // Add a slight sine wave to horizontal movement to simulate heat convection/wind
        this.angle += this.wiggleFactor;
        this.x += Math.sin(this.angle) * 0.5 + this.speedX;
        
        // Fade out
        this.opacity -= this.decay;
        
        // Reset if completely faded or off top of screen
        if (this.opacity <= 0 || this.y < -10) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        // Apply glow
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = this.color;
        
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0; // reset for next drawing
      }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      // stagger initial Y positions so they don't all spawn at the bottom at once
      const p = new Particle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -1,
        // Optional subtle blend mode to make it feel more integrated with dark backgrounds
        mixBlendMode: 'screen',
        opacity: 0.8
      }}
    />
  );
};

export default CampfireEmbers;
