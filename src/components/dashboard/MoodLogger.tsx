'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

type Mood = 'energized' | 'peaceful' | 'struggling';

const moods: { key: Mood; emoji: string }[] = [
    { key: 'energized', emoji: '🌟' },
    { key: 'peaceful', emoji: '😌' },
    { key: 'struggling', emoji: '😔' },
];

interface MoodLoggerProps {
    onSelect?: (mood: Mood) => void;
    currentMood?: Mood | null;
}

export default function MoodLogger({ onSelect, currentMood }: MoodLoggerProps) {
    const [selected, setSelected] = useState<Mood | null>(currentMood || null);
    const t = useTranslations('dashboard');

    const handleSelect = (mood: Mood) => {
        setSelected(mood);
        onSelect?.(mood);
    };

    return (
        <div>
            <p
                style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    marginBottom: '12px',
                    fontWeight: 500,
                }}
            >
                {t('moodLog')}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                {moods.map((mood) => (
                    <motion.button
                        key={mood.key}
                        onClick={() => handleSelect(mood.key)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-lg)',
                            border:
                                selected === mood.key
                                    ? '2px solid var(--accent-gold)'
                                    : '2px solid transparent',
                            background:
                                selected === mood.key
                                    ? 'var(--glow-gold)'
                                    : 'var(--bg-card)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <span style={{ fontSize: '1.8rem' }}>{mood.emoji}</span>
                        <span
                            style={{
                                fontSize: '0.7rem',
                                color:
                                    selected === mood.key
                                        ? 'var(--accent-gold)'
                                        : 'var(--text-muted)',
                                fontWeight: 600,
                            }}
                        >
                            {t(mood.key)}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
