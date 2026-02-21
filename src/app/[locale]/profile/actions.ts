'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.get
    formData.append('file', file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            return data.url;
        }
    } catch (error) {
        console.error('Upload failed:', error);
    }
    return null;
}

export async function updatePassword(currentPassword: string, newPassword: string) {
    const session = await auth();
    
    if (!session?.user?.email) {
        return { error: 'Not authenticated' };
    }

    if (!currentPassword || !newPassword) {
        return { error: 'Missing required fields' };
    }

    if (newPassword.length < 6) {
        return { error: 'Password must be at least 6 characters' };
    }

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, session.user.email));

    if (!user || !user.password) {
        return { error: 'User not found or using social login' };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isValid) {
        return { error: 'Current password is incorrect' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        await db
            .update(users)
            .set({ password: hashedPassword, updatedAt: new Date() })
            .where(eq(users.email, session.user.email));
        
        return { success: true };
    } catch (error) {
        console.error('Password update error:', error);
        return { error: 'Failed to update password' };
    }
}

export async function updateProfilePhoto(file: File) {
    const session = await auth();
    
    if (!session?.user?.email) {
        return { error: 'Not authenticated' };
    }

    if (!file || file.size === 0) {
        return { error: 'No file provided' };
    }

    const imageUrl = await uploadImage(file);
    
    if (!imageUrl) {
        return { error: 'Failed to upload image' };
    }

    try {
        await db
            .update(users)
            .set({ image: imageUrl, updatedAt: new Date() })
            .where(eq(users.email, session.user.email));
        
        revalidatePath('/profile');
        return { success: true, url: imageUrl };
    } catch (error) {
        console.error('Photo update error:', error);
        return { error: 'Failed to update profile photo' };
    }
}

export async function updateUserName(name: string) {
    const session = await auth();
    
    if (!session?.user?.email) {
        return { error: 'Not authenticated' };
    }

    if (!name || name.trim().length === 0) {
        return { error: 'Name is required' };
    }

    try {
        await db
            .update(users)
            .set({ name: name.trim(), updatedAt: new Date() })
            .where(eq(users.email, session.user.email));
        
        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Name update error:', error);
        return { error: 'Failed to update name' };
    }
}
