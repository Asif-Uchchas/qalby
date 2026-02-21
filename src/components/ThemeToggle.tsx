'use client';

import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
    const { theme, setTheme } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="p-2 rounded-xl glass-card"
                aria-label="Toggle theme"
                style={{ border: '1px solid rgba(139, 92, 246, 0.3)' }}
            >
                <div className="w-5 h-5" />
            </button>
        );
    }

    return (
        <motion.div
            className="flex items-center gap-2 px-4 py-3 glass-card hover:border-accent-gold/40 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
                minWidth: '100px',
                justifyContent: 'center',
                border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5" style={{ color: '#FBBF24' }} />
            ) : (
                <Moon className="w-5 h-5" style={{ color: '#A78BFA' }} />
            )}
            <span style={{ color: '#A78BFA', fontWeight: 600 }}>
                {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
            <motion.div
                className="w-2 h-2 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                style={{ backgroundColor: '#A78BFA' }}
            />
        </motion.div>
    );
}
