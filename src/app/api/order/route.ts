import { type NextRequest } from 'next/server';
import postgres from 'postgres';
import { cookies } from 'next/headers';
import { CartItem, OrderItem } from '@/types/cart'
import { ShoppingItem } from '@/types/shopping';
import { mockCartItems, mockOrderItems, mockInventoryData } from '@/lib/mockData';     // temporary data used for this route.

export async function GET(request: Request) {
    return Response.json(mockOrderItems);
}

export async function POST(request: Request) {
    // since mockCartItems is being referenced throughout the function,
    // a new variable is made storing the values of the mockCartItems
    const storedMockCartItems = Array.from(mockCartItems);
    const newOrder = {
        id: String(mockOrderItems.length + 1),
        orderList: storedMockCartItems
    };
    mockOrderItems.push(newOrder)
    
    mockCartItems.forEach((cartItem) => {
        const itemList = mockInventoryData.filter((data) => data.id == cartItem.shoppingItem.id);
        const item = itemList[0];
        const index = mockInventoryData.indexOf(item);
        mockInventoryData[index].stock = item.stock - cartItem.quantity;
    })

    mockCartItems.splice(0, mockCartItems.length)

    const returnData = {
        OrderItems: mockOrderItems,
        InventoryData: mockInventoryData,
        CartItems: mockCartItems,
    }

    return new Response(JSON.stringify(returnData), {
        headers: { "Content-Type": "application/json" },
        status: 201,
    })
}