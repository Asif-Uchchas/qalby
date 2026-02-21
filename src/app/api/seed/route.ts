import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import {
    dailyLogs,
    prayerEntries,
    quranProgress,
    dhikrSessions,
    plannerTasks,
    users
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    const session = await auth();
    let userId = session?.user?.id;

    if (!userId) {
        // Fallback to first user for seeding purposes in dev
        const allUsers = await db.select().from(users).limit(1);
        if (allUsers.length > 0) {
            userId = allUsers[0].id;
        }
    }

    if (!userId) {
        return NextResponse.json({ error: 'No user found to seed' }, { status: 404 });
    }

    const today = new Date().toISOString().split('T')[0];

    try {
        // 1. Seed Daily Log
        await db.delete(dailyLogs).where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, today)));
        await db.insert(dailyLogs).values({
            userId,
            date: today,
            mood: 'energized',
            energy: 5,
            niyyah: 'To be better than yesterday and grow closer to Allah.',
            fastingCompleted: true,
        });

        // 2. Seed Prayer Entries
        await db.delete(prayerEntries).where(and(eq(prayerEntries.userId, userId), eq(prayerEntries.date, today)));
        const prayers: ('fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha')[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        const statuses: ('ontime' | 'ontime' | 'late' | 'pending' | 'pending')[] = ['ontime', 'ontime', 'late', 'pending', 'pending'];

        for (let i = 0; i < prayers.length; i++) {
            await db.insert(prayerEntries).values({
                userId,
                date: today,
                prayer: prayers[i],
                status: statuses[i],
            });
        }

        // 3. Seed Quran Progress
        await db.delete(quranProgress).where(and(eq(quranProgress.userId, userId), eq(quranProgress.date, today)));
        await db.insert(quranProgress).values({
            userId,
            date: today,
            juzCompleted: [1, 2],
            pagesRead: 10,
        });

        // 4. Seed Dhikr Sessions
        await db.delete(dhikrSessions).where(and(eq(dhikrSessions.userId, userId), eq(dhikrSessions.date, today)));
        const dhikrs = [
            { type: 'subhanallah', count: 33 },
            { type: 'alhamdulillah', count: 33 },
            { type: 'allahuakbar', count: 33 },
        ];
        for (const d of dhikrs) {
            await db.insert(dhikrSessions).values({
                userId,
                date: today,
                type: d.type,
                count: d.count,
                target: 33,
            });
        }

        // 5. Seed Fundamental Planner Tasks
        await db.delete(plannerTasks).where(and(eq(plannerTasks.userId, userId), eq(plannerTasks.date, today)));

        const tasks = [
            { title: 'Fajr Prayer', category: 'worship', completed: true, order: 1 },
            { title: 'Dhuhr Prayer', category: 'worship', completed: true, order: 2 },
            { title: 'Asr Prayer', category: 'worship', completed: true, order: 3 },
            { title: 'Maghrib Prayer', category: 'worship', completed: false, order: 4 },
            { title: 'Isha Prayer', category: 'worship', completed: false, order: 5 },
            { title: 'Taraweeh Prayer', category: 'worship', completed: false, order: 6 },
            { title: 'Read 1 Juz of Quran', category: 'quran', completed: true, order: 7 },
            { title: 'Morning Dhikr', category: 'worship', completed: true, order: 8 },
            { title: 'Giving Sadaqah', category: 'worship', completed: false, order: 9 },
            { title: 'Night Reflection', category: 'rest', completed: false, order: 10 },
        ];

        for (const t of tasks) {
            await db.insert(plannerTasks).values({
                userId,
                date: today,
                title: t.title,
                category: t.category as any,
                completed: t.completed,
                order: t.order,
            });
        }

        for (const t of tasks) {
            await db.insert(plannerTasks).values({
                userId,
                date: today,
                title: t.title,
                category: t.category as any,
                completed: t.completed,
                order: t.order,
            });
        }

        return NextResponse.json({ success: true, message: 'Day 3 dummy data seeded successfully!' });
    } catch (error) {
        console.error('Seeding failed:', error);
        return NextResponse.json({ error: 'Seeding failed', details: (error as Error).message }, { status: 500 });
    }
}
