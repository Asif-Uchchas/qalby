'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import PageTransition from '@/components/PageTransition';
import { Plus, Target, BookOpen, CheckCircle, Flame } from 'lucide-react';

interface Goal {
    id: string;
    title: string;
    completed: number;
    target: number;
    emoji: string;
}

const demoGoals: Goal[] = [
    { id: '1', title: 'Complete Quran', emoji: '📖', completed: 7, target: 30 },
    { id: '2', title: 'Pray all 5 on time', emoji: '🕌', completed: 12, target: 30 },
    { id: '3', title: 'Read tafsir daily', emoji: '📚', completed: 5, target: 30 },
    { id: '4', title: 'Give charity daily', emoji: '💝', completed: 8, target: 30 },
    { id: '5', title: 'No backbiting', emoji: '🤐', completed: 10, target: 30 },
    { id: '6', title: 'Extra dhikr 100x daily', emoji: '📿', completed: 9, target: 30 },
];

const reflectionPrompts = [
    'What am I most grateful for this week?',
    'How has my connection with Allah grown?',
    'What is one thing I can improve for next week?',
    'Which act of worship felt most meaningful?',
    'How can I be more present in my prayers?',
];

function GoalCard({
    goal,
    onIncrement,
}: {
    goal: Goal;
    onIncrement: () => void;
}) {
    const pct = Math.round((goal.completed / goal.target) * 100);

    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onIncrement}
            style={{ cursor: 'pointer' }}
        >
            <GlassCard>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                    }}
                >
                    <span style={{ fontSize: '1.6rem' }}>{goal.emoji}</span>
                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '6px',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                }}
                            >
                                {goal.title}
                            </span>
                            <span
                                className="font-mono"
                                style={{
                                    fontSize: '0.75rem',
                                    color: pct >= 100 ? 'var(--secondary-400)' : 'var(--primary-400)',
                                    fontWeight: 700,
                                }}
                            >
                                {goal.completed}/{goal.target}
                            </span>
                        </div>
                        <div
                            style={{
                                width: '100%',
                                height: '6px',
                                borderRadius: '3px',
                                background: 'var(--bg-card)',
                                overflow: 'hidden',
                            }}
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(pct, 100)}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                style={{
                                    height: '100%',
                                    borderRadius: '3px',
                                    background:
                                        pct >= 100
                                            ? 'linear-gradient(90deg, var(--secondary-500), var(--secondary-400))'
                                            : 'var(--gradient-primary)',
                                    boxShadow:
                                        pct >= 100
                                            ? '0 0 8px rgba(6,182,212,0.4)'
                                            : '0 0 8px var(--glow-primary)',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}

function HabitGrid({ goal }: { goal: Goal }) {
    return (
        <div
            style={{
                display: 'flex',
                gap: '3px',
                flexWrap: 'wrap',
            }}
        >
            {Array.from({ length: goal.target }, (_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        background:
                            i < goal.completed
                                ? 'var(--primary-500)'
                                : 'var(--bg-card)',
                        border: '1px solid var(--glass-border)',
                    }}
                />
            ))}
        </div>
    );
}

export default function GoalsPage() {
    const t = useTranslations('goals');
    const [goals, setGoals] = useState(demoGoals);
    const [journalEntry, setJournalEntry] = useState('');
    const [showPrompt, setShowPrompt] = useState(true);

    const promptIndex = new Date().getDay() % reflectionPrompts.length;

    const incrementGoal = (id: string) => {
        setGoals((prev) =>
            prev.map((g) =>
                g.id === id && g.completed < g.target
                    ? { ...g, completed: g.completed + 1 }
                    : g
            )
        );
    };

    const completedGoals = goals.filter((g) => g.completed >= g.target).length;
    const totalDaysCompleted = Math.round(
        goals.reduce((sum, g) => sum + g.completed / g.target, 0) /
        goals.length *
        30
    );

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
                        marginBottom: '16px',
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
                        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                    {/* Summary Stats */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <GlassCard
                                hover={false}
                                style={{ flex: 1, padding: '16px', textAlign: 'center' }}
                            >
                                <Flame size={24} style={{ color: 'var(--accent-amber)', margin: '0 auto 8px' }} />
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
                                    {totalDaysCompleted}
                                </p>
                                <p
                                    style={{
                                        fontSize: '0.65rem',
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        margin: '4px 0 0',
                                    }}
                                >
                                    {t('daysCompleted')}
                                </p>
                            </GlassCard>
                            <GlassCard
                                hover={false}
                                style={{ flex: 1, padding: '16px', textAlign: 'center' }}
                            >
                                <Target size={24} style={{ color: 'var(--accent-teal)', margin: '0 auto 8px' }} />
                                <p
                                    className="font-mono"
                                    style={{
                                        fontSize: '1.8rem',
                                        fontWeight: 800,
                                        color: 'var(--secondary-400)',
                                        margin: 0,
                                        lineHeight: 1,
                                    }}
                                >
                                    {completedGoals}/{goals.length}
                                </p>
                                <p
                                    style={{
                                        fontSize: '0.65rem',
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        margin: '4px 0 0',
                                    }}
                                >
                                    {t('goalsAchieved')}
                                </p>
                            </GlassCard>
                        </div>
                    </motion.div>

                    {/* Reflection Prompt */}
                    <AnimatePresence>
                        {showPrompt && (
                            <motion.div
                                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <GlassCard elevated hover={false}>
                                    <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                                        <span style={{ fontSize: '1.5rem', marginTop: '2px' }}>💭</span>
                                        <div style={{ flex: 1 }}>
                                            <p
                                                style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--primary-400)',
                                                    fontWeight: 600,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px',
                                                    marginBottom: '6px',
                                                }}
                                            >
                                                {t('weeklyPrompt')}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: '0.95rem',
                                                    color: 'var(--text-primary)',
                                                    fontStyle: 'italic',
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                &ldquo;{reflectionPrompts[promptIndex]}&rdquo;
                                            </p>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Goals List */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                        <p
                            style={{
                                fontSize: '0.85rem',
                                color: 'var(--text-muted)',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            <Target size={14} />
                            {t('progress')}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {goals.map((goal) => (
                                <GoalCard
                                    key={goal.id}
                                    goal={goal}
                                    onIncrement={() => incrementGoal(goal.id)}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Daily Journal */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                        <GlassCard hover={false}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <BookOpen size={16} style={{ color: 'var(--accent-gold)' }} />
                                <span
                                    style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--accent-gold)',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                    }}
                                >
                                    {t('journal')}
                                </span>
                            </div>
                            <textarea
                                value={journalEntry}
                                onChange={(e) => setJournalEntry(e.target.value)}
                                placeholder={t('journalPlaceholder')}
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--glass-border)',
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    fontFamily: 'var(--font-dm-sans)',
                                    resize: 'vertical',
                                    outline: 'none',
                                    lineHeight: 1.6,
                                }}
                            />
                        </GlassCard>
                    </motion.div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
