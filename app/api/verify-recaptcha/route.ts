import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { token } = await request.json()

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid reCAPTCHA' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to verify reCAPTCHA' }, { status: 500 });
  }
}