import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { plannerTasks } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    try {
        const tasks = await db
            .select()
            .from(plannerTasks)
            .where(
                and(
                    eq(plannerTasks.userId, session.user.id),
                    eq(plannerTasks.date, date)
                )
            )
            .orderBy(asc(plannerTasks.order), asc(plannerTasks.timeSlot));

        return NextResponse.json(tasks);
    } catch (error) {
        console.error('Failed to fetch planner tasks:', error);
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, category, timeSlot, date } = body;

        if (!title || !date) {
            return NextResponse.json({ error: 'Missing title or date' }, { status: 400 });
        }

        const [newTask] = await db
            .insert(plannerTasks)
            .values({
                userId: session.user.id,
                date,
                title,
                category: category || 'worship',
                timeSlot,
                completed: false,
            })
            .returning();

        return NextResponse.json(newTask);
    } catch (error) {
        console.error('Failed to create planner task:', error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, completed, title, category, timeSlot } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing task ID' }, { status: 400 });
        }

        const [updatedTask] = await db
            .update(plannerTasks)
            .set({
                ...(completed !== undefined && { completed }),
                ...(title && { title }),
                ...(category && { category }),
                ...(timeSlot && { timeSlot }),
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(plannerTasks.id, id),
                    eq(plannerTasks.userId, session.user.id)
                )
            )
            .returning();

        if (!updatedTask) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error('Failed to update planner task:', error);
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing task ID' }, { status: 400 });
        }

        await db
            .delete(plannerTasks)
            .where(
                and(
                    eq(plannerTasks.id, id),
                    eq(plannerTasks.userId, session.user.id)
                )
            );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete planner task:', error);
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}
