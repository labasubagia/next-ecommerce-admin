import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prismaDb from '@/lib/prisma-db';

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } },
) {
  try {
    if (!params.categoryId) {
      return new NextResponse('Billboard is required', { status: 400 });
    }
    const category = await prismaDb.category.findUnique({
      where: { id: params.categoryId },
      include: { billboard: true },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse('Store is required', { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse('Billboard is required', { status: 400 });
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const category = await prismaDb.category.updateMany({
      where: { id: params.categoryId, storeId: params.storeId },
      data: { name, billboardId },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse('Store is required', { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse('Category ID is required', { status: 400 });
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const category = await prismaDb.category.deleteMany({
      where: { id: params.categoryId, storeId: params.storeId },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
