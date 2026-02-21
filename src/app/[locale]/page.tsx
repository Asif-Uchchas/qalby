'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import LanguageToggle from '@/components/LanguageToggle';
import PageTransition from '@/components/PageTransition';
import HijriDate from '@/components/dashboard/HijriDate';
import CountdownRing from '@/components/dashboard/CountdownRing';
import CompletionRings from '@/components/dashboard/CompletionRings';
import MoodLogger from '@/components/dashboard/MoodLogger';
import StreakHeatmap from '@/components/dashboard/StreakHeatmap';
import QuickAddFAB from '@/components/dashboard/QuickAddFAB';

// Dynamically import Three.js components (no SSR)
const CrescentMoon3D = dynamic(
    () => import('@/components/dashboard/CrescentMoon3D'),
    { ssr: false }
);

// Demo data - would come from API in production
function getSuhoorTime() {
    const today = new Date();
    today.setHours(4, 30, 0, 0);
    if (today.getTime() < Date.now()) {
        today.setDate(today.getDate() + 1);
    }
    return today;
}

function getIftarTime() {
    const today = new Date();
    today.setHours(18, 15, 0, 0);
    if (today.getTime() < Date.now()) {
        today.setDate(today.getDate() + 1);
    }
    return today;
}

const demoStreakData = Array.from({ length: 28 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - i));
    return {
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 5),
    };
});

export default function DashboardPage() {
    const t = useTranslations('dashboard');

    const completionRings = [
        { label: t('prayerProgress'), current: 3, total: 5, color: '#C9974A' },
        { label: t('quranProgress'), current: 4, total: 10, color: '#2ECFC4' },
        { label: t('dhikrProgress'), current: 66, total: 99, color: '#F4A830' },
        { label: t('fastingProgress'), current: 1, total: 1, color: '#A78BFA' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

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
                        marginBottom: '8px',
                        paddingTop: '8px',
                    }}
                >
                    <div>
                        <h1
                            className="font-display"
                            style={{
                                fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                                color: 'var(--text-primary)',
                                fontWeight: 700,
                            }}
                        >
                            {t('greeting')} 👋
                        </h1>
                    </div>
                    <LanguageToggle />
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                    {/* 3D Crescent Hero + Hijri Date */}
                    <motion.div variants={itemVariants}>
                        <GlassCard elevated hover={false}>
                            <CrescentMoon3D />
                            <HijriDate />
                        </GlassCard>
                    </motion.div>

                    {/* Countdown Timers */}
                    <motion.div variants={itemVariants}>
                        <GlassCard hover={false}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                }}
                            >
                                <CountdownRing
                                    targetTime={getSuhoorTime()}
                                    label={t('suhoor')}
                                    color="var(--accent-teal)"
                                    size={140}
                                />
                                <CountdownRing
                                    targetTime={getIftarTime()}
                                    label={t('iftar')}
                                    color="var(--accent-gold)"
                                    size={140}
                                />
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Completion Rings */}
                    <motion.div variants={itemVariants}>
                        <GlassCard hover={false}>
                            <CompletionRings rings={completionRings} />
                        </GlassCard>
                    </motion.div>

                    {/* Mood Logger */}
                    <motion.div variants={itemVariants}>
                        <GlassCard>
                            <MoodLogger
                                onSelect={(mood) => console.log('Mood:', mood)}
                            />
                        </GlassCard>
                    </motion.div>

                    {/* Weekly Streak */}
                    <motion.div variants={itemVariants}>
                        <GlassCard hover={false}>
                            <p
                                style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--text-muted)',
                                    marginBottom: '12px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                }}
                            >
                                {t('weeklyStreak')}
                            </p>
                            <StreakHeatmap data={demoStreakData} />
                        </GlassCard>
                    </motion.div>
                </motion.div>

                {/* Quick Add FAB */}
                <QuickAddFAB onClick={() => console.log('Quick add')} />
            </div>
        </PageTransition>
    );
}
