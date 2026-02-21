'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import PageTransition from '@/components/PageTransition';
import { BookOpen, CheckCircle, TrendingUp, Search } from 'lucide-react';

const JUZ_NAMES = [
    'Alif Lam Mim', 'Sayaqul', 'Tilkal Rusul', 'Lan Tanaloo', 'Wal Muhsanat',
    'La Yuhibbullah', 'Wa Iza Samiu', 'Wa Lau Annana', 'Qalal Mala', 'Wa Alamu',
    'Yatazeroon', 'Wa Mamin Dabbah', 'Wa Ma Ubarri', 'Rubama', 'Subhanallazi',
    'Qal Alam', 'Iqtaraba', 'Qad Aflaha', 'Wa Qalallazina', 'Amman Khalaq',
    'Otlu Ma Oohi', 'Wa Manyaqnut', 'Wa Mali', 'Faman Azlam', 'Ilaihi Yuraddu',
    'Ha Mim', 'Qala Fama Khatbukum', 'Qad Sami Allah', 'Tabarakallazi', 'Amma',
];

function JuzGrid({
    completed,
    onToggle,
}: {
    completed: Set<number>;
    onToggle: (juz: number) => void;
}) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
            }}
        >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
                const done = completed.has(juz);
                return (
                    <motion.button
                        key={juz}
                        onClick={() => onToggle(juz)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.85 }}
                        style={{
                            aspectRatio: '1',
                            borderRadius: 'var(--radius-md)',
                            border: done
                                ? '2px solid var(--primary-500)'
                                : '1px solid var(--glass-border)',
                            background: done
                                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(245, 158, 11, 0.1))'
                                : 'var(--bg-card)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2px',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                        title={JUZ_NAMES[juz - 1]}
                    >
                        {done && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="animate-shimmer"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    borderRadius: 'var(--radius-md)',
                                }}
                            />
                        )}
                        <span
                            className="font-mono"
                            style={{
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: done ? 'var(--primary-400)' : 'var(--text-muted)',
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            {juz}
                        </span>
                        {done && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{ position: 'relative', zIndex: 1 }}
                            >
                                <CheckCircle size={12} color="var(--primary-400)" />
                            </motion.div>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}

function ProgressBook({ completed }: { completed: number }) {
    const pct = Math.round((completed / 30) * 100);
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
                padding: '20px 0',
            }}
        >
            {/* 3D-ish Book */}
            <motion.div
                style={{
                    width: '100px',
                    height: '130px',
                    perspective: '400px',
                }}
                whileHover={{ scale: 1.05 }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        transformStyle: 'preserve-3d',
                        transform: 'rotateY(-15deg)',
                    }}
                >
                    {/* Book cover */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '4px 12px 12px 4px',
                            background: 'linear-gradient(135deg, #2E1065, #1E1B4B)',
                            border: '2px solid var(--primary-500)',
                            boxShadow: '4px 4px 12px rgba(0,0,0,0.4), 0 0 20px var(--glow-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        <BookOpen size={28} color="var(--primary-300)" />
                        <span
                            className="font-display"
                            style={{
                                fontSize: '0.7rem',
                                color: 'var(--primary-300)',
                                letterSpacing: '1px',
                            }}
                        >
                            القرآن
                        </span>
                    </div>
                    {/* Book spine */}
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '12px',
                            background: 'linear-gradient(to right, var(--primary-500), var(--primary-700, #4C1D95))',
                            borderRadius: '4px 0 0 4px',
                            transform: 'rotateY(-90deg) translateX(-6px)',
                            transformOrigin: 'left',
                        }}
                    />
                </div>
            </motion.div>

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span
                    className="font-mono"
                    style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        color: 'var(--primary-400)',
                        lineHeight: 1,
                        textShadow: '0 0 20px var(--glow-primary)',
                    }}
                >
                    {pct}%
                </span>
                <span
                    style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                    }}
                >
                    {completed}/30 Juz
                </span>
                <div
                    style={{
                        width: '120px',
                        height: '6px',
                        borderRadius: '3px',
                        background: 'var(--bg-card)',
                        overflow: 'hidden',
                    }}
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                            height: '100%',
                            borderRadius: '3px',
                            background: 'var(--gradient-primary)',
                            boxShadow: '0 0 8px var(--glow-primary)',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function QuranPage() {
    const t = useTranslations('quran');
    const [completedJuz, setCompletedJuz] = useState<Set<number>>(new Set());
    const [pagesRead, setPagesRead] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchProgress = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/quran');
            if (res.ok) {
                const data = await res.json();
                setCompletedJuz(new Set(data.completedJuz));
                setPagesRead(data.pagesReadToday);
            }
        } catch (error) {
            console.error('Failed to fetch quran progress:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgress();
    }, []);

    const toggleJuz = async (juz: number) => {
        const isDone = completedJuz.has(juz);

        // Optimistic update
        setCompletedJuz((prev) => {
            const next = new Set(prev);
            if (isDone) next.delete(juz);
            else next.add(juz);
            return next;
        });

        try {
            await fetch('/api/quran', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ juzNumber: juz, completed: !isDone }),
            });
        } catch (error) {
            console.error('Failed to toggle juz:', error);
            fetchProgress(); // Rollback
        }
    };

    const updatePages = async (newPages: number) => {
        const pages = Math.max(0, newPages);
        setPagesRead(pages);

        try {
            await fetch('/api/quran', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pages }),
            });
        } catch (error) {
            console.error('Failed to update pages:', error);
        }
    };

    const daysLeft = 26; // Mock for now, should calculate based on Ramadan dates
    const pagesLeft = (30 - completedJuz.size) * 20;
    const pagesPerDay = daysLeft > 0 ? Math.ceil(pagesLeft / daysLeft) : 0;

    return (
        <PageTransition>
            <div
                style={{
                    padding: '16px',
                    maxWidth: '500px',
                    margin: '0 auto',
                }}
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <h1
                        className="font-display"
                        style={{
                            fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                            color: 'var(--text-primary)',
                            fontWeight: 700,
                            margin: 0,
                        }}
                    >
                        {t('title')}
                    </h1>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                    {/* Progress Book */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                        <GlassCard elevated hover={false}>
                            <p
                                style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--text-muted)',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '4px',
                                }}
                            >
                                {t('khatmProgress')}
                            </p>
                            <ProgressBook completed={completedJuz.size} />
                        </GlassCard>
                    </motion.div>

                    {/* Pages Read Today */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                        <GlassCard hover={false}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <div>
                                    <p
                                        style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--text-muted)',
                                            marginBottom: '4px',
                                        }}
                                    >
                                        {t('pagesRead')}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <motion.button
                                            whileTap={{ scale: 0.8 }}
                                            onClick={() => updatePages(pagesRead - 1)}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                border: '1px solid var(--glass-border)',
                                                background: 'var(--bg-card)',
                                                color: 'var(--text-primary)',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            −
                                        </motion.button>
                                        <motion.span
                                            key={pagesRead}
                                            initial={{ scale: 1.3 }}
                                            animate={{ scale: 1 }}
                                            className="font-mono"
                                            style={{
                                                fontSize: '2rem',
                                                fontWeight: 800,
                                                color: 'var(--primary-400)',
                                                minWidth: '48px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {pagesRead}
                                        </motion.span>
                                        <motion.button
                                            whileTap={{ scale: 0.8 }}
                                            onClick={() => updatePages(pagesRead + 1)}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                border: '1px solid var(--primary-500)',
                                                background: 'var(--glow-primary)',
                                                color: 'var(--primary-400)',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            +
                                        </motion.button>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            color: 'var(--secondary-400)',
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        <TrendingUp size={14} />
                                        <span>{pagesPerDay} pages/day needed</span>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Juz Grid */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                        <GlassCard hover={false}>
                            <p
                                style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--text-muted)',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '16px',
                                }}
                            >
                                {t('juzCompleted', { count: completedJuz.size })}
                            </p>
                            {loading ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                                    {t('loading')}...
                                </p>
                            ) : (
                                <JuzGrid completed={completedJuz} onToggle={toggleJuz} />
                            )}
                        </GlassCard>
                    </motion.div>

                    {/* Recitation Streak */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                        <GlassCard hover={false}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        background: 'var(--glow-primary)',
                                        border: '2px solid var(--primary-500)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>🔥</span>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                                        {t('recitationStreak')}
                                    </p>
                                    <p
                                        className="font-mono"
                                        style={{
                                            fontSize: '1.8rem',
                                            fontWeight: 800,
                                            color: 'var(--primary-400)',
                                            margin: 0,
                                            lineHeight: 1,
                                        }}
                                    >
                                        4 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('days')}</span>
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
