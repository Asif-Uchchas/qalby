'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password || !name) {
        return { error: 'Missing fields' };
    }

    // Check if user exists
    const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

    if (existingUser) {
        return { error: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    try {
        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        });
        return { success: true };
    } catch (error) {
        return { error: 'Failed to create user' };
    }
}
