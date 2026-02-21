import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { goals, goalEntries } from '@/db/schema';
import { eq, and, sql, count } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch goals with completed count
        const userGoals = await db
            .select({
                id: goals.id,
                title: goals.title,
                target: goals.targetCount,
                category: goals.category,
                completed: sql<number>`cast(count(${goalEntries.id}) as int)`,
            })
            .from(goals)
            .leftJoin(
                goalEntries,
                and(
                    eq(goals.id, goalEntries.goalId),
                    eq(goalEntries.completed, true)
                )
            )
            .where(eq(goals.userId, session.user.id))
            .groupBy(goals.id);

        // Add today's completion status to each goal
        const today = new Date().toISOString().split('T')[0];
        const todayEntries = await db
            .select()
            .from(goalEntries)
            .where(eq(goalEntries.date, today));

        const goalsWithTodayStatus = userGoals.map(goal => ({
            ...goal,
            doneToday: todayEntries.some(e => e.goalId === goal.id && e.completed),
            // Mock emoji for now as it's not in schema, but we can use category/title to map
            emoji: '🎯'
        }));

        return NextResponse.json(goalsWithTodayStatus);
    } catch (error) {
        console.error('Failed to fetch goals:', error);
        return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, targetCount, startDate, endDate, category } = body;

        if (!title || !startDate || !endDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [newGoal] = await db
            .insert(goals)
            .values({
                userId: session.user.id,
                title,
                targetCount: targetCount || 30,
                startDate,
                endDate,
                category,
            })
            .returning();

        return NextResponse.json(newGoal);
    } catch (error) {
        console.error('Failed to create goal:', error);
        return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { goalId, date, completed } = body;

        if (!goalId) {
            return NextResponse.json({ error: 'Missing goalId' }, { status: 400 });
        }

        const targetDate = date || new Date().toISOString().split('T')[0];

        // Upsert entry for the date
        const existingEntry = await db
            .select()
            .from(goalEntries)
            .where(and(eq(goalEntries.goalId, goalId), eq(goalEntries.date, targetDate)))
            .limit(1);

        if (existingEntry.length > 0) {
            await db
                .update(goalEntries)
                .set({ completed: completed ?? true })
                .where(eq(goalEntries.id, existingEntry[0].id));
        } else {
            await db
                .insert(goalEntries)
                .values({
                    goalId,
                    date: targetDate,
                    completed: completed ?? true,
                });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update goal entry:', error);
        return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
    }
}
