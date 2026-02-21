'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

async function saveAvatar(file: File): Promise<string | null> {
    if (!file || file.size === 0) return null;

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const path = join(process.cwd(), 'public', 'uploads', filename);

        await writeFile(path, buffer);
        return `/uploads/${filename}`;
    } catch (error) {
        console.error('Failed to save avatar:', error);
        return null;
    }
}

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const avatar = formData.get('avatar') as File | null;

    if (!email || !password || !name) {
        return { error: 'Missing fields' };
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
    }

    try {
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (existingUser) {
            return { error: 'User already exists' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let imageUrl: string | null = null;
        if (avatar && avatar.size > 0) {
            imageUrl = await saveAvatar(avatar);
        }

        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
        });

        return { success: true };
    } catch (error) {
        console.error('Registration error:', error);
        return { error: 'Failed to create user' };
    }
}
