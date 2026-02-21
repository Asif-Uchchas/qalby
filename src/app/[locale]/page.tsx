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
import GiftGreeting from '@/components/GiftGreeting';
import { QalbyLogo } from '@/components/QalbyLogo';

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

import { useState, useEffect } from 'react';

export default function DashboardPage() {
    const t = useTranslations('dashboard');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/dashboard');
            if (res.ok) {
                const d = await res.json();
                setData(d);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleMoodSelect = async (mood: string) => {
        try {
            await fetch('/api/daily-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood }),
            });
            fetchDashboardData(); // Refresh to show updated mood
        } catch (error) {
            console.error('Failed to update mood:', error);
        }
    };

    const completionRings = [
        {
            label: t('prayerProgress'),
            current: data?.prayers?.completed || 0,
            total: data?.prayers?.total || 5,
            color: 'var(--accent-gold)'
        },
        {
            label: t('quranProgress'),
            current: data?.quran?.completed || 0,
            total: data?.quran?.total || 30,
            color: 'var(--accent-teal)'
        },
        {
            label: t('dhikrProgress'),
            current: data?.dhikr?.completed || 0,
            total: data?.dhikr?.total || 99,
            color: 'var(--accent-amber)'
        },
    ];

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-text-muted">{t('loading')}...</p>
            </div>
        );
    }

    return (
        <PageTransition>
            <GiftGreeting />
            <div className="max-w-7xl mx-auto p-4 md:p-8 w-full min-h-screen">
                {/* Header */}
                <div className="mb-6 md:mb-10 text-center md:text-left flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    <div className="logo-glow animate-float">
                        <QalbyLogo size={64} className="sm:w-20 sm:h-20" />
                    </div>
                    <div>
                        <h1 className="font-display text-4xl md:text-6xl font-bold text-text-primary mb-1 md:mb-2">
                            {t('greeting')} 👋
                        </h1>
                        <p className="text-text-muted text-base md:text-xl flex items-center justify-center md:justify-start gap-2">
                            <span>Day {data?.ramadanDay || 3} of Ramadan</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-accent-400"></span>
                            <span className="text-accent-400 font-semibold tracking-wider uppercase text-xs sm:text-sm">Qalby Premium</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Vision & Identity */}
                    <div className="lg:col-span-4 space-y-6">
                        <GlassCard elevated hover={false} className="aspect-square flex items-center justify-center p-0 overflow-hidden">
                            <CrescentMoon3D />
                        </GlassCard>
                        <GlassCard elevated hover={false} className="py-8">
                            <HijriDate ramadanDay={data?.ramadanDay || 3} />
                        </GlassCard>
                    </div>

                    {/* Middle Column: Focus & Progress */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Countdown Timers */}
                        <div className="grid grid-cols-2 gap-4">
                            <GlassCard elevated hover={false} className="p-4 flex flex-col items-center">
                                <CountdownRing
                                    targetTime={getSuhoorTime()}
                                    label={t('suhoor')}
                                    color="var(--accent-teal)"
                                    size={100}
                                />
                            </GlassCard>
                            <GlassCard elevated hover={false} className="p-4 flex flex-col items-center">
                                <CountdownRing
                                    targetTime={getIftarTime()}
                                    label={t('iftar')}
                                    color="var(--accent-gold)"
                                    size={100}
                                />
                            </GlassCard>
                        </div>

                        {/* Completion Rings */}
                        <GlassCard elevated hover={false} className="h-full flex items-center">
                            <CompletionRings rings={completionRings} />
                        </GlassCard>

                        {/* Mood Logger */}
                        <GlassCard elevated hover={false}>
                            <MoodLogger
                                onSelect={handleMoodSelect}
                            />
                        </GlassCard>
                    </div>

                    {/* Right Column: Consistency & Actions */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Weekly Streak */}
                        <GlassCard elevated hover={false} className="h-full">
                            <div className="flex flex-col h-full">
                                <p className="text-text-muted mb-6 text-sm font-semibold uppercase tracking-widest">
                                    {t('weeklyStreak')}
                                </p>
                                <div className="flex-1 flex items-center justify-center">
                                    <StreakHeatmap data={demoStreakData} />
                                </div>
                            </div>
                        </GlassCard>

                        {/* Today's Insights - Decorative or for later expansion */}
                        <GlassCard elevated={false} className="bg-primary-900/10 border-primary-500/20">
                            <p className="text-primary-400 text-sm italic text-center">
                                "The best of you are those who learn the Quran and teach it."
                            </p>
                        </GlassCard>
                    </div>
                </div>

                {/* Quick Add FAB */}
                <QuickAddFAB onClick={() => console.log('Quick add')} />
            </div>
        </PageTransition>
    );
}
