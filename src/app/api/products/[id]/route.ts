import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
            memberSince: true,
            isSeller: true,
          }
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = getCurrentUser(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.sellerId !== currentUser.userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only edit your own products' },
        { status: 403 }
      );
    }

    const { name, description, price, imageUrl, category, stock } = await request.json();

    const updateData: {
      name?: string;
      description?: string;
      price?: number;
      imageUrl?: string;
      category?: string;
      stock?: number;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) {
      if (price <= 0) {
        return NextResponse.json(
          { error: 'Price must be greater than 0' },
          { status: 400 }
        );
      }
      updateData.price = parseFloat(price);
    }
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (category !== undefined) updateData.category = category;
    if (stock !== undefined) {
      if (stock < 0) {
        return NextResponse.json(
          { error: 'Stock cannot be negative' },
          { status: 400 }
        );
      }
      updateData.stock = stock;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = getCurrentUser(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.sellerId !== currentUser.userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only delete your own products' },
        { status: 403 }
      );
    }

    // Check if product is in any carts or orders
    const [cartItems, orderItems] = await Promise.all([
      prisma.cartItem.findFirst({ where: { productId: id } }),
      prisma.orderItem.findFirst({ where: { productId: id } })
    ]);

    if (cartItems || orderItems) {
      return NextResponse.json(
        { error: 'Cannot delete product that is in carts or orders' },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}