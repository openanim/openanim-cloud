import { NextRequest, NextResponse } from 'next/server';
import { sql, initDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    await initDB();

    try {
      await sql`INSERT INTO waitlist (email) VALUES (${email})`;
      return NextResponse.json({ success: true, message: "You're on the list." });
    } catch (err: unknown) {
      const pgErr = err as { code?: string };
      if (pgErr.code === '23505') {
        return NextResponse.json(
          { success: false, message: "You're already on the waitlist." },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
