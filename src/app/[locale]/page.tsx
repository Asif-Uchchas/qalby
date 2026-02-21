'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import PageTransition from '@/components/PageTransition';
import HijriDate from '@/components/dashboard/HijriDate';
import CountdownRing from '@/components/dashboard/CountdownRing';
import CompletionRings from '@/components/dashboard/CompletionRings';
import MoodLogger from '@/components/dashboard/MoodLogger';
import StreakHeatmap from '@/components/dashboard/StreakHeatmap';
import QuickAddFAB from '@/components/dashboard/QuickAddFAB';

interface CompletionRing {
    label: string;
    current: number;
    total: number;
    color: string;
}

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
    ];

    return (
        <PageTransition>
            <div className="max-w-2xl mx-auto p-6 w-full h-full min-h-screen">
                {/* Header */}
                <div className="mb-8 pt-4">
                    <h1 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-2">
                        {t('greeting')} 👋
                    </h1>
                    <p className="text-text-muted text-sm md:text-lg">
                        Day {new Date().getDate()} of Ramadan
                    </p>
                </div>

                <div className="space-y-8">
                    {/* 3D Crescent Hero + Hijri Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GlassCard elevated hover={false}>
                            <CrescentMoon3D />
                        </GlassCard>
                        <GlassCard elevated hover={false}>
                            <HijriDate />
                        </GlassCard>
                    </div>

                    {/* Countdown Timers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GlassCard elevated hover={false}>
                            <CountdownRing
                                targetTime={getSuhoorTime()}
                                label={t('suhoor')}
                                color="var(--accent-teal)"
                                size={140}
                            />
                        </GlassCard>
                        <GlassCard elevated hover={false}>
                            <CountdownRing
                                targetTime={getIftarTime()}
                                label={t('iftar')}
                                color="var(--accent-gold)"
                                size={140}
                            />
                        </GlassCard>
                    </div>

                    {/* Completion Rings */}
                    <GlassCard elevated hover={false}>
                        <CompletionRings rings={completionRings} />
                    </GlassCard>

                    {/* Mood Logger */}
                    <GlassCard elevated hover={false}>
                        <MoodLogger
                            onSelect={(mood: string) => console.log('Mood:', mood)}
                        />
                    </GlassCard>

                    {/* Weekly Streak */}
                    <GlassCard elevated hover={false}>
                        <p
                            className="text-text-muted mb-4 text-sm md:text-base font-semibold uppercase tracking-wider"
                        >
                            {t('weeklyStreak')}
                        </p>
                        <StreakHeatmap data={demoStreakData} />
                    </GlassCard>
                </div>

                {/* Quick Add FAB */}
                <QuickAddFAB onClick={() => console.log('Quick add')} />
            </div>
        </PageTransition>
    );
}
