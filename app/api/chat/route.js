import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    hasKey: !!process.env.OPENAI_API_KEY,
    keyLength: process.env.OPENAI_API_KEY?.length || 0
  });
}