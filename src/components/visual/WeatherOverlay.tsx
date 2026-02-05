import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';

export const WeatherOverlay = () => {
    const { weather } = useGameStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: { x: number; y: number; speed: number; size: number; opacity?: number }[] = [];

        // Initialize particles
        const initParticles = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];

            const count = weather === 'rain' ? 500 : weather === 'snow' ? 200 : weather === 'ash' ? 100 : 0;

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    speed: Math.random() * 5 + 2,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
        };

        const render = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fog Overlay
            if (weather === 'fog') {
                ctx.fillStyle = 'rgba(200, 200, 200, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Draw particles
            if (weather === 'rain') {
                ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
                ctx.lineWidth = 1;
                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - 1, p.y + 10);
                    ctx.stroke();

                    p.y += p.speed * 2;
                    p.x -= 0.5;

                    if (p.y > canvas.height) {
                        p.y = -10;
                        p.x = Math.random() * canvas.width;
                    }
                });
            } else if (weather === 'snow') {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();

                    p.y += p.speed * 0.2;
                    p.x += Math.sin(p.y * 0.01) * 0.5;

                    if (p.y > canvas.height) {
                        p.y = -10;
                        p.x = Math.random() * canvas.width;
                    }
                });
            } else if (weather === 'ash') {
                ctx.fillStyle = 'rgba(255, 100, 100, 0.4)'; // Reddish ash roughly fitting "Det faldne hjerte"? Or grey. Let's do grey/dark. 
                // Actually typical ash is grey.
                ctx.fillStyle = 'rgba(120, 120, 120, 0.6)';

                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();

                    p.y += p.speed * 0.1;
                    p.x += Math.random() * 2 - 1;

                    if (p.y > canvas.height) {
                        p.y = -10;
                        p.x = Math.random() * canvas.width;
                    }
                });
            }

            animationFrameId = requestAnimationFrame(render);
        };

        initParticles();
        window.addEventListener('resize', initParticles);
        render();

        return () => {
            window.removeEventListener('resize', initParticles);
            cancelAnimationFrame(animationFrameId);
        };
    }, [weather]);

    if (weather === 'clear') return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[60]" // z-60 to be above most things but below modals if they are z-70
        />
    );
};
