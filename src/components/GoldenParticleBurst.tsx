'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GoldenParticleBurstProps {
    show: boolean;
    message?: string;
    onComplete?: () => void;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    hue: number;
}

export default function GoldenParticleBurst({
    show,
    message = 'Alhamdulillah!',
    onComplete,
}: GoldenParticleBurstProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number>(0);

    const createParticles = useCallback(() => {
        const particles: Particle[] = [];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        for (let i = 0; i < 150; i++) {
            const angle = (Math.PI * 2 * i) / 150;
            const speed = 2 + Math.random() * 6;
            particles.push({
                id: i,
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
                vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 2,
                life: 1,
                maxLife: 60 + Math.random() * 60,
                size: 2 + Math.random() * 4,
                hue: 35 + Math.random() * 20, // Gold range
            });
        }
        return particles;
    }, []);

    useEffect(() => {
        if (!show || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        particlesRef.current = createParticles();
        let frame = 0;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current = particlesRef.current.filter((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05; // gravity
                p.vx *= 0.99; // friction
                p.life -= 1 / p.maxLife;

                if (p.life <= 0) return false;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.life * 0.8})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `hsla(${p.hue}, 80%, 60%, 0.5)`;
                ctx.fill();

                return true;
            });

            frame++;
            if (particlesRef.current.length > 0) {
                animFrameRef.current = requestAnimationFrame(animate);
            } else {
                onComplete?.();
            }
        };

        animFrameRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [show, createParticles, onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                        }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                        style={{
                            position: 'relative',
                            zIndex: 1,
                            textAlign: 'center',
                        }}
                    >
                        <p
                            className="font-display"
                            style={{
                                fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                                color: 'var(--accent-gold)',
                                textShadow: '0 0 40px var(--glow-gold-strong)',
                                fontWeight: 700,
                            }}
                        >
                            {message}
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
