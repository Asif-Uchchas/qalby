'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'vibrant' | 'glow';
    elevated?: boolean;
    hover?: boolean;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export default function GlassCard({
    children,
    className = '',
    variant = 'default',
    elevated = false,
    hover = true,
    onClick,
    style,
}: GlassCardProps) {
    const getVariantClass = () => {
        switch (variant) {
            case 'vibrant':
                return 'card-vibrant';
            case 'glow':
                return 'card-glow';
            default:
                return elevated ? 'glass-card-elevated' : 'glass-card';
        }
    };

    return (
        <motion.div
            className={`${getVariantClass()} ${hover ? 'press-effect' : ''} ${className}`}
            style={{
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : 'default',
                ...style,
            }}
            onClick={onClick}
            whileHover={hover ? { y: -2 } : undefined}
            whileTap={onClick ? { scale: 0.98 } : undefined}
        >
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
