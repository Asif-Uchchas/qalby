'use client';

import { motion } from 'framer-motion';

interface CompletionRing {
    label: string;
    current: number;
    total: number;
    color: string;
}

interface CompletionRingsProps {
    rings: CompletionRing[];
}

export default function CompletionRings({ rings }: CompletionRingsProps) {
    const size = 70;
    const strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-around',
                gap: '12px',
                padding: '8px 0',
            }}
        >
            {rings.map((ring, index) => {
                const progress = ring.total > 0 ? ring.current / ring.total : 0;
                const strokeDashoffset = circumference * (1 - progress);

                return (
                    <motion.div
                        key={ring.label}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                        <div style={{ position: 'relative', width: size, height: size }}>
                            <svg
                                width={size}
                                height={size}
                                viewBox={`0 0 ${size} ${size}`}
                                style={{ transform: 'rotate(-90deg)' }}
                            >
                                <circle
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    fill="none"
                                    stroke="var(--bg-card)"
                                    strokeWidth={strokeWidth}
                                />
                                <motion.circle
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    fill="none"
                                    stroke={ring.color}
                                    strokeWidth={strokeWidth}
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset }}
                                    transition={{ duration: 1, delay: index * 0.15, ease: 'easeOut' }}
                                    style={{
                                        filter: `drop-shadow(0 0 4px ${ring.color})`,
                                    }}
                                />
                            </svg>
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <span
                                    className="font-mono"
                                    style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    {ring.current}/{ring.total}
                                </span>
                            </div>
                        </div>
                        <span
                            style={{
                                fontSize: '0.65rem',
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontWeight: 600,
                            }}
                        >
                            {ring.label}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
}
