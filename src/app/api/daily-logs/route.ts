import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { dailyLogs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const userId = session.user.id;

    try {
        const [log] = await db
            .select()
            .from(dailyLogs)
            .where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, dateStr)))
            .limit(1);

        return NextResponse.json(log || {
            mood: null,
            energy: null,
            niyyah: '',
            fastingCompleted: false
        });
    } catch (error) {
        console.error('Failed to fetch daily log:', error);
        return NextResponse.json({ error: 'Failed to fetch log' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { date, mood, energy, niyyah, fastingCompleted } = body;

        const userId = session.user.id;
        const targetDate = date || new Date().toISOString().split('T')[0];

        const [existing] = await db
            .select()
            .from(dailyLogs)
            .where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, targetDate)))
            .limit(1);

        if (existing) {
            const [updated] = await db
                .update(dailyLogs)
                .set({
                    mood: mood !== undefined ? mood : existing.mood,
                    energy: energy !== undefined ? energy : existing.energy,
                    niyyah: niyyah !== undefined ? niyyah : existing.niyyah,
                    fastingCompleted: fastingCompleted !== undefined ? fastingCompleted : existing.fastingCompleted,
                })
                .where(eq(dailyLogs.id, existing.id))
                .returning();
            return NextResponse.json(updated);
        } else {
            const [inserted] = await db
                .insert(dailyLogs)
                .values({
                    userId,
                    date: targetDate,
                    mood: mood || null,
                    energy: energy || null,
                    niyyah: niyyah || '',
                    fastingCompleted: fastingCompleted || false,
                })
                .returning();
            return NextResponse.json(inserted);
        }
    } catch (error) {
        console.error('Failed to update daily log:', error);
        return NextResponse.json({ error: 'Failed to update log' }, { status: 500 });
    }
}
