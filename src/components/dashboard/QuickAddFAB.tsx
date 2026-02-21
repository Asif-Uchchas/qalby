'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface QuickAddFABProps {
    onClick?: () => void;
}

export default function QuickAddFAB({ onClick }: QuickAddFABProps) {
    return (
        <motion.button
            onClick={onClick}
            style={{
                position: 'fixed',
                bottom: '96px',
                right: '20px',
                zIndex: 40,
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gradient-warm)',
                boxShadow: '0 4px 20px var(--glow-accent), 0 0 40px var(--glow-card)',
            }}
            whileHover={{
                scale: 1.1,
                boxShadow: '0 6px 30px var(--glow-accent), 0 0 60px var(--glow-card)',
            }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        >
            <Plus size={24} color="#05060F" strokeWidth={3} />
        </motion.button>
    );
}
