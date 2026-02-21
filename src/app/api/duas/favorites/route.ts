import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { duasFavorites } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const favorites = await db
            .select({ duaId: duasFavorites.duaId })
            .from(duasFavorites)
            .where(eq(duasFavorites.userId, session.user.id));

        return NextResponse.json(favorites.map(f => f.duaId));
    } catch (error) {
        console.error('Failed to fetch favorites:', error);
        return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { duaId } = body;

        const userId = session.user.id;

        const [existing] = await db
            .select()
            .from(duasFavorites)
            .where(and(eq(duasFavorites.userId, userId), eq(duasFavorites.duaId, duaId)))
            .limit(1);

        if (existing) {
            await db
                .delete(duasFavorites)
                .where(eq(duasFavorites.id, existing.id));
            return NextResponse.json({ favorite: false });
        } else {
            await db
                .insert(duasFavorites)
                .values({ userId, duaId });
            return NextResponse.json({ favorite: true });
        }
    } catch (error) {
        console.error('Failed to toggle favorite:', error);
        return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
    }
}
