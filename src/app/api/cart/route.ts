import { type NextRequest } from 'next/server';
import postgres from 'postgres';
import { cookies } from 'next/headers';
import { CartItem } from '@/types/cart'
import { ShoppingItem } from '@/types/shopping';
import { mockCartItems } from '@/lib/mockData';     // temporary data used for this route.


// this line hasn't been used yet
// I'm not really sure if I just need to use 'cookies' or I need to connect to the 'server'
// either way we can use both if ever needed
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// this function is used exclusively by the 'GET' method
function cartArray(cartItem: CartItem[]) {
    const cartList = cartItem.map(item => (
        `<ul>
        ${shoppingItemList(item.shoppingItem)}
        <li>${item.quantity}</li>
        </ul>`
    ))
    const content = cartList.join("");
    return (
        `<div>
            ${content}
        </div>`
    )
}

// this function is used exclusively by the 'cartArray' function
function shoppingItemList(item: ShoppingItem) {
    return (
        `<li>${item.id}</li>
        <li>${item.imageAlt}</li>
        <li>${item.imageUrl}</li>
        <li>${item.productName}</li>
        <li>${item.sellerName}</li>
        <li>${item.price}</li>
        <li>${item.rating}</li>
        <li>${item.isAddedToCart}</li>`
    )
}

// no error handling has been used in the making of this function
// this file is still using mock data
export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    cookieStore.set("Cart", JSON.stringify(mockCartItems));

    const getCart = cookieStore.get("Cart");

    const cartValue = JSON.parse(getCart!.value);

    return new Response(cartArray(cartValue), {
        headers: {
            "Content-Type": 'text/html',
        },
    });
}

// no error handling has been used in the making of this function
// this file is still using mock data
export async function POST(request: NextRequest) {
    const cartItem = await request.json();
    const item = cartItem.shoppingItem;
    
    const newItem = {
        shoppingItem: {
        id: String(mockCartItems.length + 1),
        imageAlt: item.imageAlt,
        imageUrl: item.imageUrl,
        productName: item.productName,
        sellerName: item.sellerName,
        price: item.price,
        rating: item.rating,
        isAddedToCart: true,
    },
        quantity: cartItem.quantity,
    };
    mockCartItems.push(newItem);
    return new Response(JSON.stringify(newItem), {
        headers: { "Content-Type": "application/json" },
        status: 201,
    })
}