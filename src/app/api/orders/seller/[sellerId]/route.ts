import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sellerId: string }> }
) {
  try {
    const currentUser = getCurrentUser(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { sellerId } = await params;

    // Only allow sellers to view their own sales data
    if (currentUser.userId !== sellerId) {
      return NextResponse.json(
        { error: 'Unauthorized - can only view your own sales data' },
        { status: 403 }
      );
    }

    // Calculate total sales from order items containing the seller's products
    // We need to join OrderItem -> Product -> sellerId and sum up the sales
    const salesData = await prisma.orderItem.aggregate({
      where: {
        product: {
          sellerId: sellerId
        },
        order: {
          status: {
            in: ['CONFIRMED', 'SHIPPED', 'DELIVERED'] // Only count completed orders
          }
        }
      },
      _sum: {
        price: true
      },
      _count: {
        id: true
      }
    });

    // Get order count for the seller
    const orderCount = await prisma.order.count({
      where: {
        orderItems: {
          some: {
            product: {
              sellerId: sellerId
            }
          }
        },
        status: {
          in: ['CONFIRMED', 'SHIPPED', 'DELIVERED']
        }
      }
    });

    const totalSales = Number(salesData._sum.price || 0);
    const totalOrderItems = salesData._count || 0;

    return NextResponse.json({
      totalSales,
      totalOrderItems,
      orderCount,
      sellerId
    });
  } catch (error) {
    console.error('Get seller sales error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}