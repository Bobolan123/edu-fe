import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Payment creation failed');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Payment creation failed' },
      { status: 500 }
    );
  }
} 