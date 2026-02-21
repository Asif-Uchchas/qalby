'use client';

import { useState, useEffect } from 'react';
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
                                'linear-gradient(90deg, transparent, var(--glow-accent), transparent)',
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
                            <Check size={14} color="var(--bg-void)" strokeWidth={3} />
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export default function PlannerPage() {
    const t = useTranslations('planner');
    const [tasks, setTasks] = useState<PlannerTask[]>([]);
    const [niyyah, setNiyyah] = useState('');
    const [view, setView] = useState<'day' | 'week'>('day');
    const [loading, setLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/planner');
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const title = newTaskTitle.trim();
        setNewTaskTitle('');

        try {
            const res = await fetch('/api/planner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    date: new Date().toISOString().split('T')[0],
                    category: 'worship',
                }),
            });

            if (res.ok) {
                const newTask = await res.json();
                setTasks((prev) => [...prev, newTask]);
            }
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const toggleTask = async (id: string, currentlyCompleted: boolean) => {
        // Optimistic update
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !currentlyCompleted } : task
            )
        );

        try {
            const res = await fetch('/api/planner', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, completed: !currentlyCompleted }),
            });
            if (!res.ok) {
                // Rollback on error
                setTasks((prev) =>
                    prev.map((task) =>
                        task.id === id ? { ...task, completed: currentlyCompleted } : task
                    )
                );
            }
        } catch (error) {
            console.error('Failed to toggle task:', error);
            // Rollback on error
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === id ? { ...task, completed: currentlyCompleted } : task
                )
            );
        }
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

                    {/* Add Task Input */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    >
                        <form
                            onSubmit={addTask}
                            style={{
                                display: 'flex',
                                gap: '8px',
                            }}
                        >
                            <div style={{ flex: 1, position: 'relative' }}>
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder={t('addTask')}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        paddingLeft: '40px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--glass-border)',
                                        background: 'var(--bg-card)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                    }}
                                />
                                <Plus
                                    size={18}
                                    style={{
                                        position: 'absolute',
                                        left: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)',
                                    }}
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                style={{
                                    padding: '0 20px',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    background: 'var(--gradient-primary)',
                                    color: '#FAFAFA',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                {t('addTask')}
                            </motion.button>
                        </form>
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
                                {tasks.length > 0 ? (
                                    `${completedCount}/${tasks.length} ${t('completed')}`
                                ) : (
                                    t('noTasks')
                                )}
                            </span>
                            {tasks.length > 0 && (
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
                            )}
                        </div>
                    </motion.div>

                    {/* Task List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <AnimatePresence>
                            {loading ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}
                                >
                                    {t('loading')}...
                                </motion.div>
                            ) : tasks.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}
                                >
                                    {t('emptyPlanner')}
                                </motion.div>
                            ) : (
                                tasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onToggle={() => toggleTask(task.id, task.completed)}
                                        t={t}
                                    />
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
