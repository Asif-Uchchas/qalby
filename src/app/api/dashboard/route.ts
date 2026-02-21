import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import {
    prayerEntries,
    quranProgress,
    dhikrSessions,
    dailyLogs,
    plannerTasks
} from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const today = new Date().toISOString().split('T')[0];

    try {
        // 1. Prayer Progress (Completed vs Total for today)
        const prayers = await db
            .select({ status: prayerEntries.status })
            .from(prayerEntries)
            .where(and(eq(prayerEntries.userId, userId), eq(prayerEntries.date, today)));

        const prayersCompleted = prayers.filter(p => p.status === 'ontime').length;
        const totalPrayers = 5; // Standard 5 prayers

        // 2. Quran Progress (Juz completed total)
        const allQuranRecords = await db
            .select({ juzCompleted: quranProgress.juzCompleted })
            .from(quranProgress)
            .where(eq(quranProgress.userId, userId));

        const completedJuzSet = new Set<number>();
        allQuranRecords.forEach(r => {
            if (Array.isArray(r.juzCompleted)) {
                r.juzCompleted.forEach(j => completedJuzSet.add(j));
            }
        });
        const juzCompleted = completedJuzSet.size;

        // 3. Dhikr Progress
        const dhikr = await db
            .select({ count: dhikrSessions.count, target: dhikrSessions.target })
            .from(dhikrSessions)
            .where(and(eq(dhikrSessions.userId, userId), eq(dhikrSessions.date, today)));

        const dhikrDone = dhikr.reduce((sum, s) => sum + (s.count || 0), 0);
        const dhikrTarget = dhikr.reduce((sum, s) => sum + (s.target || 33), 0) || 100;

        // 4. Daily Log (Mood & Fasting)
        const [todayLog] = await db
            .select()
            .from(dailyLogs)
            .where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, today)))
            .limit(1);

        // 5. Planner Summary
        const tasks = await db
            .select({ completed: plannerTasks.completed })
            .from(plannerTasks)
            .where(and(eq(plannerTasks.userId, userId), eq(plannerTasks.date, today)));

        const tasksCompleted = tasks.filter(t => t.completed).length;
        const totalTasks = tasks.length;

        return NextResponse.json({
            prayers: { completed: prayersCompleted, total: totalPrayers },
            quran: { completed: juzCompleted, total: 30 },
            dhikr: { completed: dhikrDone, total: dhikrTarget },
            fasting: todayLog?.fastingCompleted || false,
            mood: todayLog?.mood || null,
            energy: todayLog?.energy || null,
            tasks: { completed: tasksCompleted, total: totalTasks }
        });
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
    }
}
