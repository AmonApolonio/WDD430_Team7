import { type NextRequest } from 'next/server';
import postgres from 'postgres';
import { cookies } from 'next/headers';
import { CartItem, OrderItem } from '@/types/cart'
import { ShoppingItem } from '@/types/shopping';
import { mockCartItems, mockOrderItems, mockInventoryData } from '@/lib/mockData';     // temporary data used for this route.

export async function GET(request: Request, { params }: { params: Promise<{ orderId: string}>}) {
    const { orderId } = await params;
    const specificOrder = mockOrderItems.find((order) => order.id == orderId)
    return Response.json(specificOrder);
}