import { NextResponse } from 'next/server';
import { generateShareLink } from '@/api/training';

export async function POST(
  request: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const result = await generateShareLink(params.moduleId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating share link:', error);
    return NextResponse.json(
      { error: 'Failed to generate share link' },
      { status: 500 }
    );
  }
} 