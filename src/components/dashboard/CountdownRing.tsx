'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CountdownRingProps {
    targetTime: Date;
    label: string;
    color?: string;
    size?: number;
}

export default function CountdownRing({
    targetTime,
    label,
    color = 'var(--accent-gold)',
    size = 160,
}: CountdownRingProps) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const totalDuration = 12 * 60 * 60 * 1000; // 12-hour window

        const update = () => {
            const now = new Date();
            const diff = targetTime.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                setProgress(1);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
            setProgress(1 - diff / totalDuration);
        };

        update();
        intervalRef.current = setInterval(update, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [targetTime]);

    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - Math.max(0, Math.min(1, progress)));

    const formatNum = (n: number) => n.toString().padStart(2, '0');

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
            }}
        >
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="var(--bg-card)"
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress arc */}
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{
                            filter: `drop-shadow(0 0 6px ${color})`,
                        }}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </svg>

                {/* Timer text */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <span
                        className="font-mono"
                        style={{
                            fontSize: size > 140 ? '1.5rem' : '1.1rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            letterSpacing: '1px',
                        }}
                    >
                        {formatNum(timeLeft.hours)}:{formatNum(timeLeft.minutes)}:{formatNum(timeLeft.seconds)}
                    </span>
                    <span
                        style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            marginTop: '2px',
                        }}
                    >
                        {label}
                    </span>
                </div>
            </div>
        </div>
    );
}
