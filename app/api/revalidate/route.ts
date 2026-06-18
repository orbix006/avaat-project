import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getFriendlyErrorMessage } from '@/lib/error-handler';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret') || req.headers.get('x-revalidate-secret');
    const localSecret = process.env.REVALIDATE_SECRET;

    if (!localSecret) {
      console.warn('REVALIDATE_SECRET environment variable is not defined.');
      return NextResponse.json(
        { success: false, message: 'Revalidation secret not configured' },
        { status: 500 }
      );
    }

    if (secret !== localSecret) {
      return NextResponse.json(
        { success: false, message: 'Invalid secret token' },
        { status: 401 }
      );
    }

    const path = searchParams.get('path');
    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path });
    } else {
      revalidatePath('/');
      revalidatePath('/portfolio');
      revalidatePath('/blog');
      revalidatePath('/contact');
      return NextResponse.json({
        revalidated: true,
        paths: ['/', '/portfolio', '/blog', '/contact'],
      });
    }
  } catch (err: any) {
    const friendlyMessage = getFriendlyErrorMessage(err);
    console.error('Revalidation error:', err);
    return NextResponse.json(
      { success: false, message: friendlyMessage },
      { status: 500 }
    );
  }
}