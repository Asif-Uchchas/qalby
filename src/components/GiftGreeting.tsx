'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Stars } from 'lucide-react';

export default function GiftGreeting() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const hasSeen = sessionStorage.getItem('qalby_gift_greeting_seen');
        if (!hasSeen) {
            const timer = setTimeout(() => setShow(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setShow(false);
        sessionStorage.setItem('qalby_gift_greeting_seen', 'true');
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        background: 'radial-gradient(circle at center, rgba(5, 13, 9, 0.9) 0%, rgba(5, 13, 9, 0.98) 100%)',
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    {/* Background Particles */}
                    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: Math.random() * 100 + '%',
                                    y: '110%',
                                    opacity: 0,
                                    scale: 0.5
                                }}
                                animate={{
                                    y: '-10%',
                                    opacity: [0, 1, 1, 0],
                                    scale: [0.5, 1.2, 1, 0.8],
                                    rotate: Math.random() * 360
                                }}
                                transition={{
                                    duration: 5 + Math.random() * 5,
                                    repeat: Infinity,
                                    delay: Math.random() * 5,
                                    ease: "linear"
                                }}
                                style={{
                                    position: 'absolute',
                                    color: i % 2 === 0 ? 'var(--accent-500)' : 'var(--primary-400)',
                                }}
                            >
                                {i % 2 === 0 ? <Heart size={20 + Math.random() * 20} fill="currentColor" /> : <Stars size={20 + Math.random() * 20} />}
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ scale: 0.8, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                        style={{
                            maxWidth: '400px',
                            width: '100%',
                            textAlign: 'center',
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                            <motion.div
                                animate={{
                                    scale: [1, 1.15, 1],
                                    filter: ['drop-shadow(0 0 10px var(--accent-500))', 'drop-shadow(0 0 30px var(--accent-500))', 'drop-shadow(0 0 10px var(--accent-500))']
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Heart size={80} fill="var(--accent-500)" color="var(--accent-500)" />
                            </motion.div>
                        </div>

                        <h2 className="font-display" style={{
                            fontSize: '2rem',
                            color: 'var(--text-primary)',
                            marginBottom: '16px',
                            textShadow: '0 0 20px var(--glow-primary)'
                        }}>
                            Welcome Back, My Love
                        </h2>

                        <p style={{
                            color: 'var(--text-muted)',
                            lineHeight: 1.6,
                            marginBottom: '32px',
                            fontSize: '1.1rem'
                        }}>
                            May this Ramadan bring peace, joy, and countless blessings to your heart. I am so lucky to have you.
                        </p>

                        <motion.button
                            onClick={handleClose}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)',
                                color: 'white',
                                padding: '14px 40px',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4), 0 0 30px var(--glow-primary)',
                            }}
                        >
                            Ramadan Mubarak ❤️
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
