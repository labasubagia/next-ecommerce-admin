import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import prismaDb from '@/lib/prisma-db';

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } },
) {
  try {
    if (!params.billboardId) {
      return new NextResponse('Billboard is required', { status: 400 });
    }
    const billboard = await prismaDb.billboard.findUnique({
      where: { id: params.billboardId },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    if (!label) {
      return new NextResponse('Label is required', { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse('Image is required', { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse('Store is required', { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse('Billboard is required', { status: 400 });
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const billboard = await prismaDb.billboard.updateMany({
      where: { id: params.billboardId, storeId: params.storeId },
      data: { label, imageUrl },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse('Store is required', { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse('Billboard is required', { status: 400 });
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const billboard = await prismaDb.billboard.deleteMany({
      where: { id: params.billboardId, storeId: params.storeId },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
