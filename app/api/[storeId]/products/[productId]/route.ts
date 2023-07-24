import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import prismaDb from '@/lib/prisma-db';

export async function GET(
  req: Request,
  { params }: { params: { productId: string } },
) {
  try {
    if (!params.productId) {
      return new NextResponse('Product is required', { status: 400 });
    }
    const product = await prismaDb.product.findUnique({
      where: { id: params.productId },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {
      name,
      price,
      images,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse('Images are required', { status: 400 });
    }
    if (!price) {
      return new NextResponse('Price is required', { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse('Category ID is required', { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse('Size ID is required', { status: 400 });
    }
    if (!colorId) {
      return new NextResponse('Color ID is required', { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse('Store is required', { status: 400 });
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prismaDb.product.update({
      where: { id: params.productId, storeId: params.storeId },
      data: {
        name,
        price,
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured,
        isArchived,
        images: { deleteMany: {} },
      },
    });

    const product = await prismaDb.product.update({
      where: { id: params.productId, storeId: params.storeId },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse('Store is required', { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse('Product is required', { status: 400 });
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const product = await prismaDb.product.deleteMany({
      where: { id: params.productId, storeId: params.storeId },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
