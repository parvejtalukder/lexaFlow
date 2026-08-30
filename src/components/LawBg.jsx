'use client';

import { useEffect, useRef } from 'react';

export default function LawBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse for dynamic spotlight interaction
    const mouse = { x: width / 2, y: height / 2, radius: 180 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const symbols = ['scale', 'gavel', 'pillar', 'section'];
    const items = [];
    const itemCount = Math.floor((width * height) / 35000); // Clean density

    class LegalSymbol {
      constructor() {
        this.reset();
        // Randomize initial positions across canvas
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 40;
        this.vy = -(Math.random() * 0.3 + 0.15); // Slow upward drift
        this.vx = (Math.random() - 0.5) * 0.1;
        this.size = Math.random() * 12 + 18;
        this.type = symbols[Math.floor(Math.random() * symbols.length)];
        this.baseOpacity = Math.random() * 0.2 + 0.1;
        this.rotation = (Math.random() - 0.5) * 0.2;
        this.angle = Math.random() * Math.PI * 2;
      }

      update() {
        this.y += this.vy;
        this.x += this.vx;
        this.angle += this.rotation * 0.01;

        // Reset if it drifts off the top screen
        if (this.y < -50) this.reset();
      }

      draw() {
        // Calculate distance to mouse for interactive ambient lighting
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let opacity = this.baseOpacity;
        if (dist < mouse.radius) {
          opacity += (1 - dist / mouse.radius) * 0.35; // Brightens when hovered
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle = `rgba(197, 160, 89, ${opacity})`; // Gold color scheme
        ctx.fillStyle = `rgba(197, 160, 89, ${opacity})`;
        ctx.lineWidth = 1.5;

        // Vector drawing functions for key legal motifs
        if (this.type === 'scale') {
          // Scales of Justice
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(0, this.size / 2); // Center post
          ctx.moveTo(-this.size / 2, -this.size / 4);
          ctx.lineTo(this.size / 2, -this.size / 4); // Beam
          ctx.stroke();

          // Left/Right pans
          [-this.size / 2, this.size / 2].forEach((xPos) => {
            ctx.beginPath();
            ctx.moveTo(xPos, -this.size / 4);
            ctx.lineTo(xPos - 4, this.size / 4);
            ctx.lineTo(xPos + 4, this.size / 4);
            ctx.closePath();
            ctx.stroke();
          });
        } else if (this.type === 'gavel') {
          // Gavel head & handle
          ctx.beginPath();
          ctx.rect(-this.size / 3, -this.size / 6, (this.size * 2) / 3, this.size / 3);
          ctx.moveTo(0, 0);
          ctx.lineTo(0, this.size / 2);
          ctx.stroke();
        } else if (this.type === 'pillar') {
          // Greek pillar (Law / Institution)
          ctx.beginPath();
          ctx.rect(-this.size / 3, -this.size / 2, (this.size * 2) / 3, 3); // Capital
          ctx.rect(-this.size / 3, this.size / 2 - 3, (this.size * 2) / 3, 3); // Base
          ctx.moveTo(-this.size / 4, -this.size / 2 + 3);
          ctx.lineTo(-this.size / 4, this.size / 2 - 3);
          ctx.moveTo(0, -this.size / 2 + 3);
          ctx.lineTo(0, this.size / 2 - 3);
          ctx.moveTo(this.size / 4, -this.size / 2 + 3);
          ctx.lineTo(this.size / 4, this.size / 2 - 3);
          ctx.stroke();
        } else if (this.type === 'section') {
          // Legal Section Symbol (§)
          ctx.font = `${this.size}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('§', 0, 0);
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < itemCount; i++) {
      items.push(new LegalSymbol());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Add dynamic subtle background glow near cursor
      const radialGradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        400
      );
      radialGradient.addColorStop(0, 'rgba(197, 160, 89, 0.04)');
      radialGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, width, height);

      items.forEach((item) => {
        item.update();
        item.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-slate-950 pointer-events-none"
    />
  );
}