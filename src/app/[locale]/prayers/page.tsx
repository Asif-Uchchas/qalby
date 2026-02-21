'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import PageTransition from '@/components/PageTransition';
import GoldenParticleBurst from '@/components/GoldenParticleBurst';
import { subDays } from 'date-fns';

type PrayerStatus = 'pending' | 'ontime' | 'late' | 'missed';
type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

interface PrayerState {
    name: PrayerName;
    status: PrayerStatus;
    time: string;
}

const statusConfig: Record<PrayerStatus, { icon: string; color: string }> = {
    pending: { icon: '⬜', color: 'var(--text-muted)' },
    ontime: { icon: '✅', color: 'var(--secondary-500)' },
    late: { icon: '⏰', color: 'var(--warm-500)' },
    missed: { icon: '❌', color: 'var(--accent-500)' },
};

const statusCycle: PrayerStatus[] = ['pending', 'ontime', 'late', 'missed'];

// Demo prayer times
const defaultPrayers: PrayerState[] = [
    { name: 'fajr', status: 'pending', time: '05:12' },
    { name: 'dhuhr', status: 'pending', time: '12:15' },
    { name: 'asr', status: 'pending', time: '15:45' },
    { name: 'maghrib', status: 'pending', time: '18:10' },
    { name: 'isha', status: 'pending', time: '19:30' },
];

function PrayerCard({
    prayer,
    onStatusChange,
    t,
}: {
    prayer: PrayerState;
    onStatusChange: (name: PrayerName, status: PrayerStatus) => void;
    t: ReturnType<typeof useTranslations<'prayers'>>;
}) {
    const config = statusConfig[prayer.status];
    const statusLabel =
        prayer.status === 'ontime'
            ? t('onTime')
            : prayer.status === 'late'
                ? t('late')
                : prayer.status === 'missed'
                    ? t('missed')
                    : t('notYet');

    const cyclePrayerStatus = () => {
        const currentIdx = statusCycle.indexOf(prayer.status);
        const nextIdx = (currentIdx + 1) % statusCycle.length;
        onStatusChange(prayer.name, statusCycle[nextIdx]);
    };

    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={cyclePrayerStatus}
            style={{ cursor: 'pointer' }}
        >
            <GlassCard>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <motion.div
                            key={prayer.status}
                            initial={{ scale: 0.5, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            style={{ fontSize: '1.5rem' }}
                        >
                            {config.icon}
                        </motion.div>
                        <div>
                            <h3
                                className="font-display"
                                style={{
                                    fontSize: '1.15rem',
                                    color: 'var(--text-primary)',
                                    fontWeight: 700,
                                    margin: 0,
                                }}
                            >
                                {t(prayer.name as 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha')}
                            </h3>
                            <p
                                className="font-mono"
                                style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)',
                                    margin: 0,
                                }}
                            >
                                {prayer.time}
                            </p>
                        </div>
                    </div>
                    <motion.span
                        key={prayer.status}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: config.color,
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            background: `${config.color}15`,
                            border: `1px solid ${config.color}30`,
                        }}
                    >
                        {statusLabel}
                    </motion.span>
                </div>
            </GlassCard>
        </motion.div>
    );
}

function MonthlyHeatmap({ data, t }: { data: any[]; t: ReturnType<typeof useTranslations<'prayers'>> }) {
    const days = 30;
    // Map history to 30 days
    const heatData = Array.from({ length: days }, (_, i) => {
        const dateStr = subDays(new Date(), days - 1 - i).toISOString().split('T')[0];
        const entry = data.find(d => d.date === dateStr);
        return entry ? entry.count : 0;
    });

    const getColor = (value: number) => {
        if (value === 0) return 'var(--bg-card)';
        if (value <= 1) return 'rgba(245, 158, 11, 0.4)'; // accent gold
        if (value <= 2) return 'rgba(249, 115, 22, 0.4)'; // warm-500
        if (value <= 3) return 'rgba(249, 115, 22, 0.6)'; // warm-500
        if (value <= 4) return 'rgba(16, 185, 129, 0.7)'; // primary emerald
        return 'rgba(13, 148, 136, 0.8)'; // secondary jade
    };

    return (
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
                {t('consistency')}
            </p>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px',
                }}
            >
                {heatData.map((value, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.02 }}
                        style={{
                            aspectRatio: '1',
                            borderRadius: '4px',
                            background: getColor(value),
                            border: '1px solid rgba(201, 151, 74, 0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.55rem',
                            color: 'var(--text-muted)',
                        }}
                        whileHover={{ scale: 1.2 }}
                        title={`Day: ${value}/5 prayers on time`}
                    >
                    </motion.div>
                ))}
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '12px',
                    fontSize: '0.6rem',
                    color: 'var(--text-muted)',
                }}
            >
                <span>0/5</span>
                <div
                    style={{
                        display: 'flex',
                        gap: '2px',
                        alignItems: 'center',
                    }}
                >
                    {[0, 1, 2, 3, 4, 5].map((v) => (
                        <div
                            key={v}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '2px',
                                background: getColor(v),
                            }}
                        />
                    ))}
                </div>
                <span>5/5</span>
            </div>
        </GlassCard>
    );
}

export default function PrayersPage() {
    const t = useTranslations('prayers');
    const [prayers, setPrayers] = useState<PrayerState[]>(defaultPrayers);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tarawih, setTarawih] = useState(false);
    const [showBurst, setShowBurst] = useState(false);

    const fetchPrayers = async () => {
        try {
            setLoading(true);
            const [pRes, hRes] = await Promise.all([
                fetch('/api/prayers'),
                fetch('/api/prayers?type=history'),
            ]);

            if (pRes.ok) {
                const dbPrayers = await pRes.json();
                if (dbPrayers.length > 0) {
                    setPrayers(prev => prev.map(p => {
                        const dbP = dbPrayers.find((dbp: any) => dbp.prayer === p.name);
                        return dbP ? { ...p, status: dbP.status } : p;
                    }));
                }
            }
            if (hRes.ok) {
                const hData = await hRes.json();
                setHistory(hData);
            }
        } catch (error) {
            console.error('Failed to fetch prayers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrayers();
    }, []);

    const handleStatusChange = async (name: PrayerName, status: PrayerStatus) => {
        const updated = prayers.map((p) =>
            p.name === name ? { ...p, status } : p
        );
        setPrayers(updated);

        try {
            await fetch('/api/prayers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prayer: name, status }),
            });
            // Update history set after change
            const hRes = await fetch('/api/prayers?type=history');
            if (hRes.ok) setHistory(await hRes.json());
        } catch (error) {
            console.error('Failed to update prayer:', error);
        }

        // Check if all prayers are on-time
        const allOnTime = updated.every((p) => p.status === 'ontime');
        if (allOnTime) {
            setShowBurst(true);
            setTimeout(() => setShowBurst(false), 4000);
        }
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

                {/* Prayer Cards */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                    {prayers.map((prayer, i) => (
                        <motion.div
                            key={prayer.name}
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                show: { opacity: 1, x: 0 },
                            }}
                        >
                            <PrayerCard
                                prayer={prayer}
                                onStatusChange={handleStatusChange}
                                t={t}
                            />
                        </motion.div>
                    ))}

                    {/* Tarawih Toggle */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: -20 },
                            show: { opacity: 1, x: 0 },
                        }}
                    >
                        <GlassCard onClick={() => setTarawih(!tarawih)}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🌙</span>
                                    <h3
                                        className="font-display"
                                        style={{
                                            fontSize: '1.15rem',
                                            color: 'var(--text-primary)',
                                            fontWeight: 700,
                                            margin: 0,
                                        }}
                                    >
                                        {t('tarawih')}
                                    </h3>
                                </div>
                                <motion.div
                                    animate={{
                                        background: tarawih
                                            ? 'var(--gradient-primary)'
                                            : 'var(--bg-card)',
                                        borderColor: tarawih
                                            ? 'var(--primary-500)'
                                            : 'var(--glass-border)',
                                    }}
                                    style={{
                                        width: '48px',
                                        height: '28px',
                                        borderRadius: '14px',
                                        border: '2px solid',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '2px',
                                    }}
                                >
                                    <motion.div
                                        animate={{ x: tarawih ? 20 : 0 }}
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            background: tarawih
                                                ? '#05060F'
                                                : 'var(--text-muted)',
                                        }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                </motion.div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Monthly Heatmap */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0 },
                        }}
                    >
                        {loading ? (
                            <GlassCard elevated hover={false} style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <p style={{ color: 'var(--text-muted)' }}>{t('loading')}...</p>
                            </GlassCard>
                        ) : (
                            <MonthlyHeatmap data={history} t={t} />
                        )}
                    </motion.div>
                </motion.div>

                {/* Golden Burst Celebration */}
                <GoldenParticleBurst
                    show={showBurst}
                    message={t('allComplete')}
                    onComplete={() => setShowBurst(false)}
                />
            </div>
        </PageTransition>
    );
}
