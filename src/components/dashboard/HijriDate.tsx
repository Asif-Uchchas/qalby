'use client';

import { useTranslations } from 'next-intl';

interface HijriDateProps {
    ramadanDay?: number;
}

// Simple Hijri date approximation (for demo — production should use a proper library)
function getHijriDate(): { day: number; month: string; year: number } {
    // Approximate — for a real app, use a library like `hijri-converter`
    // This is a placeholder that returns a reasonable Ramadan date
    const now = new Date();
    const hijriYear = 1447; // Approximate for 2026
    const ramadanStart = new Date('2026-02-19'); // Adjusted so Feb 21 is Day 3
    const daysSinceStart = Math.floor(
        (now.getTime() - ramadanStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const ramadanDay = Math.max(1, Math.min(30, daysSinceStart + 1));

    return {
        day: ramadanDay,
        month: 'Ramadan',
        year: hijriYear,
    };
}

export default function HijriDate({ ramadanDay }: HijriDateProps) {
    const t = useTranslations('dashboard');
    const hijri = getHijriDate();
    const day = ramadanDay || hijri.day;

    return (
        <div style={{ textAlign: 'center' }}>
            <p
                className="font-display"
                style={{
                    fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                    color: 'var(--accent-gold)',
                    fontWeight: 700,
                    textShadow: '0 0 20px var(--glow-gold-strong)',
                    marginBottom: '4px',
                    lineHeight: 1.2,
                }}
            >
                {hijri.day} {hijri.month} {hijri.year}
            </p>
            <p
                style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                }}
            >
                {t('dayOf', { day })}
            </p>
        </div>
    );
}
