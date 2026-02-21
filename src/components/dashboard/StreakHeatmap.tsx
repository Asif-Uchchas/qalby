'use client';

import { motion } from 'framer-motion';

interface StreakHeatmapProps {
    data: { date: string; value: number }[];
    weeks?: number;
}

export default function StreakHeatmap({ data, weeks = 4 }: StreakHeatmapProps) {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const totalCells = weeks * 7;

    // Create grid data
    const grid: { date: string; value: number }[] = [];
    const today = new Date();

    for (let i = totalCells - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const entry = data.find((d) => d.date === dateStr);
        grid.push({ date: dateStr, value: entry?.value || 0 });
    }

    const getColor = (value: number) => {
        if (value === 0) return 'var(--bg-card)';
        if (value === 1) return 'rgba(201, 151, 74, 0.2)';
        if (value === 2) return 'rgba(201, 151, 74, 0.4)';
        if (value === 3) return 'rgba(201, 151, 74, 0.6)';
        return 'rgba(201, 151, 74, 0.85)';
    };

    return (
        <div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `auto repeat(${weeks}, 1fr)`,
                    gap: '3px',
                    fontSize: '0.6rem',
                }}
            >
                {/* Day labels */}
                {days.map((day, i) => (
                    <div
                        key={`day-${i}`}
                        style={{
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '16px',
                            height: '16px',
                            fontSize: '0.55rem',
                        }}
                    >
                        {i % 2 === 1 ? day : ''}
                    </div>
                ))}

                {/* Heat cells — transposed to columns */}
                {Array.from({ length: weeks }).map((_, weekIdx) =>
                    Array.from({ length: 7 }).map((_, dayIdx) => {
                        const cellIdx = weekIdx * 7 + dayIdx;
                        const cell = grid[cellIdx];
                        if (!cell) return null;

                        return (
                            <motion.div
                                key={cell.date}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    delay: cellIdx * 0.01,
                                    duration: 0.2,
                                }}
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '3px',
                                    background: getColor(cell.value),
                                    border: '1px solid rgba(201, 151, 74, 0.05)',
                                    gridColumn: weekIdx + 2,
                                    gridRow: dayIdx + 1,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                }}
                                whileHover={{
                                    scale: 1.3,
                                    boxShadow: '0 0 8px var(--glow-gold-strong)',
                                }}
                                title={`${cell.date}: ${cell.value}/4`}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
