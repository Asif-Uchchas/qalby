import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { prayerEntries } from '@/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { subDays } from 'date-fns';

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'daily';
    const userId = session.user.id;
    const today = new Date().toISOString().split('T')[0];

    try {
        if (type === 'history') {
            // Fetch last 30 days of prayer statuses for heatmap
            const thirtyDaysAgo = subDays(new Date(), 30).toISOString().split('T')[0];

            const history = await db
                .select({
                    date: prayerEntries.date,
                    count: sql<number>`count(case when ${prayerEntries.status} = 'ontime' then 1 end)`,
                })
                .from(prayerEntries)
                .where(and(eq(prayerEntries.userId, userId), gte(prayerEntries.date, thirtyDaysAgo)))
                .groupBy(prayerEntries.date);

            return NextResponse.json(history);
        }

        // Default: Fetch today's prayers
        const prayers = await db
            .select()
            .from(prayerEntries)
            .where(and(eq(prayerEntries.userId, userId), eq(prayerEntries.date, today)));

        return NextResponse.json(prayers);
    } catch (error) {
        console.error('Failed to fetch prayers:', error);
        return NextResponse.json({ error: 'Failed to fetch prayers' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { prayer, status, isTarawih } = body;

        if (!prayer || !status) {
            return NextResponse.json({ error: 'Missing prayer or status' }, { status: 400 });
        }

        const userId = session.user.id;
        const today = new Date().toISOString().split('T')[0];

        // Find existing entry for this prayer today
        const [existing] = await db
            .select()
            .from(prayerEntries)
            .where(
                and(
                    eq(prayerEntries.userId, userId),
                    eq(prayerEntries.date, today),
                    eq(prayerEntries.prayer, prayer)
                )
            )
            .limit(1);

        if (existing) {
            await db
                .update(prayerEntries)
                .set({ status, isTarawih: isTarawih ?? existing.isTarawih })
                .where(eq(prayerEntries.id, existing.id));
        } else {
            await db
                .insert(prayerEntries)
                .values({
                    userId,
                    date: today,
                    prayer,
                    status,
                    isTarawih: isTarawih ?? false,
                });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update prayer:', error);
        return NextResponse.json({ error: 'Failed to update prayer' }, { status: 500 });
    }
}
