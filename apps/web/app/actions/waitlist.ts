'use server';

import { sql, initDB } from '@/lib/db';

export async function joinWaitlist(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { success: false, error: 'Invalid email address.' };
  }

  await initDB();

  try {
    await sql`INSERT INTO waitlist (email) VALUES (${email})`;
    return { success: true, message: "You're on the list. We'll reach out before launch." };
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr.code === '23505') {
      return { success: false, error: "You're already on the waitlist.", status: 'duplicate' };
    }
    console.error('Waitlist error:', err);
    return { success: false, error: 'Something went wrong. Try again.' };
  }
}
