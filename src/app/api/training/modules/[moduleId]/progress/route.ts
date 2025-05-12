import { NextResponse } from 'next/server';
import { updateModuleProgress } from '@/api/training';

export async function PUT(
  request: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { progress } = await request.json();
    const result = await updateModuleProgress(params.moduleId, progress);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
} 