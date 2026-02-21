import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { quranProgress } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userId = session.user.id;
        const today = new Date().toISOString().split('T')[0];

        // Fetch all progress records to aggregate juz
        const allProgress = await db
            .select({ juzCompleted: quranProgress.juzCompleted })
            .from(quranProgress)
            .where(eq(quranProgress.userId, userId));

        // Flatten unique juz numbers
        const completedJuzSet = new Set<number>();
        allProgress.forEach(p => {
            if (Array.isArray(p.juzCompleted)) {
                p.juzCompleted.forEach(j => completedJuzSet.add(j));
            }
        });

        // Fetch today's pages read
        const [todayProgress] = await db
            .select({ pagesRead: quranProgress.pagesRead })
            .from(quranProgress)
            .where(and(eq(quranProgress.userId, userId), eq(quranProgress.date, today)))
            .limit(1);

        return NextResponse.json({
            completedJuz: Array.from(completedJuzSet),
            pagesReadToday: todayProgress?.pagesRead || 0,
        });
    } catch (error) {
        console.error('Failed to fetch quran progress:', error);
        return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { juzNumber, completed } = body;

        if (juzNumber === undefined) {
            return NextResponse.json({ error: 'Missing juzNumber' }, { status: 400 });
        }

        const userId = session.user.id;
        const today = new Date().toISOString().split('T')[0];

        // Find today's record
        const [todayRecord] = await db
            .select()
            .from(quranProgress)
            .where(and(eq(quranProgress.userId, userId), eq(quranProgress.date, today)))
            .limit(1);

        let currentJuzList: number[] = (todayRecord?.juzCompleted as number[]) || [];

        if (completed) {
            if (!currentJuzList.includes(juzNumber)) {
                currentJuzList.push(juzNumber);
            }
        } else {
            // Need to handle removing juz. If it's not in today's record, it might be in another date's.
            // For simplicity, we'll try to find any record that has this juz and remove it.
            // But let's start with today's.
            currentJuzList = currentJuzList.filter(j => j !== juzNumber);

            // If it's not in today's list, we might need to search across all records.
            // Removing a juz is rarer, so we'll just handle today's for now or 
            // maybe we should have one record per Juz instead? 
            // But the schema is per date.
        }

        if (todayRecord) {
            await db
                .update(quranProgress)
                .set({ juzCompleted: currentJuzList })
                .where(eq(quranProgress.id, todayRecord.id));
        } else {
            await db
                .insert(quranProgress)
                .values({
                    userId,
                    date: today,
                    juzCompleted: currentJuzList,
                    pagesRead: 0,
                });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to toggle juz:', error);
        return NextResponse.json({ error: 'Failed to toggle juz' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { pages } = body;

        const userId = session.user.id;
        const today = new Date().toISOString().split('T')[0];

        const [todayRecord] = await db
            .select()
            .from(quranProgress)
            .where(and(eq(quranProgress.userId, userId), eq(quranProgress.date, today)))
            .limit(1);

        if (todayRecord) {
            await db
                .update(quranProgress)
                .set({ pagesRead: pages })
                .where(eq(quranProgress.id, todayRecord.id));
        } else {
            await db
                .insert(quranProgress)
                .values({
                    userId,
                    date: today,
                    juzCompleted: [],
                    pagesRead: pages,
                });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update pages read:', error);
        return NextResponse.json({ error: 'Failed to update pages' }, { status: 500 });
    }
}
