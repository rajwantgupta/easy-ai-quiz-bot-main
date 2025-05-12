import { NextResponse } from 'next/server';
import { downloadResource } from '@/api/training';

export async function GET(
  request: Request,
  { params }: { params: { resourceId: string } }
) {
  try {
    const resourceUrl = await downloadResource(params.resourceId);
    return NextResponse.json({ url: resourceUrl });
  } catch (error) {
    console.error('Error downloading resource:', error);
    return NextResponse.json(
      { error: 'Failed to download resource' },
      { status: 500 }
    );
  }
} 