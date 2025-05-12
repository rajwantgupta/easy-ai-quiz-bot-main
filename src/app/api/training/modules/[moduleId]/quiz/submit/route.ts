import { NextResponse } from 'next/server';
import { submitQuiz } from '@/api/training';

export async function POST(
  request: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { answers } = await request.json();
    const result = await submitQuiz(params.moduleId, answers);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
} 