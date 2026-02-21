'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import PageTransition from '@/components/PageTransition';
import { Plus, GripVertical, Check, Clock } from 'lucide-react';

type TaskCategory = 'worship' | 'quran' | 'rest' | 'work' | 'family';

interface PlannerTask {
    id: string;
    title: string;
    category: TaskCategory;
    timeSlot: string;
    completed: boolean;
}

const categoryConfig: Record<TaskCategory, { emoji: string; color: string }> = {
    worship: { emoji: '✨', color: 'var(--warm-500)' },
    quran: { emoji: '📖', color: 'var(--secondary-500)' },
    rest: { emoji: '🌙', color: 'var(--primary-500)' },
    work: { emoji: '💼', color: 'var(--text-muted)' },
    family: { emoji: '🏠', color: 'var(--accent-500)' },
};

const demoTasks: PlannerTask[] = [
    { id: '1', title: 'Suhoor meal', category: 'rest', timeSlot: '04:00', completed: true },
    { id: '2', title: 'Fajr prayer', category: 'worship', timeSlot: '05:12', completed: true },
    { id: '3', title: 'Morning Adhkar', category: 'worship', timeSlot: '05:30', completed: false },
    { id: '4', title: 'Quran recitation (Juz 8)', category: 'quran', timeSlot: '06:00', completed: false },
    { id: '5', title: 'Work session', category: 'work', timeSlot: '09:00', completed: false },
    { id: '6', title: 'Dhuhr prayer', category: 'worship', timeSlot: '12:15', completed: false },
    { id: '7', title: 'Family time', category: 'family', timeSlot: '16:00', completed: false },
    { id: '8', title: 'Asr prayer', category: 'worship', timeSlot: '15:45', completed: false },
    { id: '9', title: 'Iftar preparation', category: 'family', timeSlot: '17:30', completed: false },
    { id: '10', title: 'Maghrib prayer', category: 'worship', timeSlot: '18:10', completed: false },
    { id: '11', title: 'Isha + Tarawih', category: 'worship', timeSlot: '19:30', completed: false },
    { id: '12', title: 'Evening Adhkar', category: 'worship', timeSlot: '21:00', completed: false },
];

function TaskCard({
    task,
    onToggle,
    t,
}: {
    task: PlannerTask;
    onToggle: () => void;
    t: ReturnType<typeof useTranslations<'planner'>>;
}) {
    const cat = categoryConfig[task.category];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileTap={{ scale: 0.98 }}
        >
            <div
                onClick={onToggle}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: task.completed ? 'var(--glow-primary)' : 'var(--bg-card)',
                    border: `1px solid ${task.completed ? 'var(--primary-500)' : 'var(--glass-border)'}`,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                }}
            >
                {/* Gold shimmer on completed */}
                {task.completed && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background:
                                'linear-gradient(90deg, transparent, rgba(201,151,74,0.15), transparent)',
                            pointerEvents: 'none',
                        }}
                    />
                )}

                <GripVertical
                    size={16}
                    style={{ color: 'var(--text-muted)', opacity: 0.4, flexShrink: 0 }}
                />

                <div
                    style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: cat.color,
                        flexShrink: 0,
                    }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                        style={{
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: task.completed ? 'var(--primary-400)' : 'var(--text-primary)',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {task.title}
                    </p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexShrink: 0,
                    }}
                >
                    <span
                        className="font-mono"
                        style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                        }}
                    >
                        {task.timeSlot}
                    </span>
                    <motion.div
                        animate={{
                            background: task.completed
                                ? 'var(--primary-500)'
                                : 'transparent',
                            borderColor: task.completed
                                ? 'var(--primary-500)'
                                : 'var(--text-muted)',
                        }}
                        style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '6px',
                            border: '2px solid',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {task.completed && (
                            <Check size={14} color="#05060F" strokeWidth={3} />
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export default function PlannerPage() {
    const t = useTranslations('planner');
    const [tasks, setTasks] = useState(demoTasks);
    const [niyyah, setNiyyah] = useState('');
    const [view, setView] = useState<'day' | 'week'>('day');

    const toggleTask = (id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const completedCount = tasks.filter((t) => t.completed).length;

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
                    {/* View Toggle */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                gap: '4px',
                                background: 'var(--bg-card)',
                                borderRadius: 'var(--radius-full)',
                                padding: '4px',
                                width: 'fit-content',
                            }}
                        >
                            {(['day', 'week'] as const).map((v) => (
                                <motion.button
                                    key={v}
                                    onClick={() => setView(v)}
                                    style={{
                                        padding: '6px 20px',
                                        borderRadius: 'var(--radius-full)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        background:
                                            view === v
                                                ? 'var(--gradient-primary)'
                                                : 'transparent',
                                        color: view === v ? '#FAFAFA' : 'var(--text-muted)',
                                        transition: 'all 0.2s ease',
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {v === 'day' ? t('dayView') : t('weekView')}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Niyyah */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    >
                        <GlassCard hover={false}>
                            <label
                                style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--primary-400)',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    display: 'block',
                                    marginBottom: '8px',
                                }}
                            >
                                ✨ {t('niyyah')}
                            </label>
                            <input
                                type="text"
                                value={niyyah}
                                onChange={(e) => setNiyyah(e.target.value)}
                                placeholder={t('niyyahPlaceholder')}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--glass-border)',
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    fontFamily: 'var(--font-dm-sans)',
                                    outline: 'none',
                                }}
                            />
                        </GlassCard>
                    </motion.div>

                    {/* Progress Summary */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0 4px',
                            }}
                        >
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                {completedCount}/{tasks.length} {t('completed')}
                            </span>
                            <div
                                style={{
                                    flex: 1,
                                    maxWidth: '120px',
                                    height: '4px',
                                    borderRadius: '2px',
                                    background: 'var(--bg-card)',
                                    marginLeft: '12px',
                                    overflow: 'hidden',
                                }}
                            >
                                <motion.div
                                    animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
                                    style={{
                                        height: '100%',
                                        borderRadius: '2px',
                                        background: 'var(--gradient-primary)',
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Task List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <AnimatePresence>
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onToggle={() => toggleTask(task.id)}
                                    t={t}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
