import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const where: { userId: string; status?: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' } = { userId: currentUser.userId };
    
    if (status && ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
      where.status = status as 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.order.count({ where })
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { shippingAddress } = await request.json();

    if (!shippingAddress || shippingAddress.trim().length === 0) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: currentUser.userId },
      include: {
        product: true
      }
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Check stock availability for all items
    for (const cartItem of cartItems) {
      if (cartItem.product.stock < cartItem.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${cartItem.product.name}` },
          { status: 400 }
        );
      }
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (Number(item.product.price) * item.quantity);
    }, 0);

    // Create order and order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: currentUser.userId,
          totalAmount,
          shippingAddress,
          status: 'PENDING'
        }
      });

      // Create order items and update product stock
      const orderItems = [];
      for (const cartItem of cartItems) {
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.product.price
          }
        });
        orderItems.push(orderItem);

        // Update product stock
        await tx.product.update({
          where: { id: cartItem.productId },
          data: {
            stock: {
              decrement: cartItem.quantity
            }
          }
        });
      }

      // Clear user's cart
      await tx.cartItem.deleteMany({
        where: { userId: currentUser.userId }
      });

      return { ...newOrder, orderItems };
    });

    // Fetch the complete order with items for response
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Order created successfully',
      order: completeOrder
    }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}