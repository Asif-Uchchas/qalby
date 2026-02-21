'use client';

import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useState, useEffect } from 'react';

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
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl glass-card transition-all"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ border: '1px solid rgba(139, 92, 246, 0.3)' }}
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5" style={{ color: '#FBBF24' }} />
            ) : (
                <Moon className="w-5 h-5" style={{ color: '#8B5CF6' }} />
            )}
        </button>
    );
}
