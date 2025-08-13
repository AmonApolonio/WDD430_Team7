import { type NextRequest } from 'next/server';
import postgres from 'postgres';
import { cookies } from 'next/headers';
import { CartItem } from '@/types/cart'
import { ShoppingItem } from '@/types/shopping';
import { mockCartItems } from '@/lib/mockData';     // temporary data used for this route.

// since this is using mock data, this can only use the original data from the mockdata file, 
// though the file contents wouldn't be affected
export async function PATCH(
    request: Request,
    { params } : { params: Promise<{ itemId: string}>}
) {
    const { itemId } = await params;
    const quantityChange = await request.json();
    const itemList = mockCartItems.filter((cartItem) => cartItem.shoppingItem.id === itemId);
    const item = itemList[0];
    item.quantity = quantityChange.quantity;
    return Response.json(item);
}

export async function DELETE(
    request: Request,
    { params } : { params: Promise<{ itemId: string}>}
) {
    const { itemId } = await params;
    const itemList = mockCartItems.filter((cartItem) => cartItem.shoppingItem.id !== itemId);
    return Response.json(itemList);
}