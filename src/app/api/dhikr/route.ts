import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { dhikrSessions } from '@/db/schema';
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
        const sessions = await db
            .select()
            .from(dhikrSessions)
            .where(and(eq(dhikrSessions.userId, userId), eq(dhikrSessions.date, dateStr)));

        return NextResponse.json(sessions);
    } catch (error) {
        console.error('Failed to fetch dhikr sessions:', error);
        return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { type, count, target } = body;

        const userId = session.user.id;
        const today = new Date().toISOString().split('T')[0];

        const [existing] = await db
            .select()
            .from(dhikrSessions)
            .where(
                and(
                    eq(dhikrSessions.userId, userId),
                    eq(dhikrSessions.date, today),
                    eq(dhikrSessions.type, type)
                )
            )
            .limit(1);

        if (existing) {
            await db
                .update(dhikrSessions)
                .set({ count, target: target || existing.target })
                .where(eq(dhikrSessions.id, existing.id));
        } else {
            await db
                .insert(dhikrSessions)
                .values({
                    userId,
                    date: today,
                    type,
                    count,
                    target: target || 33,
                });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update dhikr:', error);
        return NextResponse.json({ error: 'Failed to update dhikr' }, { status: 500 });
    }
}
