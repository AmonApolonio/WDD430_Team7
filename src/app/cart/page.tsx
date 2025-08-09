"use client";

import Layout from '../../components/common/Layout';
import { Button } from '../../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { fetchCartItems, fetchShippingAndTax, handleCheckout, handleRemoveFromCart } from "@/lib/api";
import { CartItem } from "@/types/cart";
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { CartPageSkeleton } from '@/components/ui/Skeletons';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

// Cart Content component that uses data fetching
function CartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAndTax, setShippingAndTax] = useState({ shippingCost: 0, taxAmount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCartData = async () => {
      try {
        const items = await fetchCartItems();
        const shippingData = await fetchShippingAndTax();
        setCartItems(items);
        setShippingAndTax(shippingData);
      } catch (error) {
        console.error('Error loading cart data:', error);
        toast.error('Failed to load cart data');
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, []);

  if (loading) {
    return <CartPageSkeleton />;
  }

  return (
    <CartPageComponent 
      initialCartItems={cartItems} 
      initialShippingAndTax={shippingAndTax}
    />
  );
}

// Client component for cart functionality
function CartPageComponent({ 
  initialCartItems, 
  initialShippingAndTax 
}: { 
  initialCartItems: CartItem[];
  initialShippingAndTax: { shippingCost: number; taxAmount: number };
}) {
  const router = useRouter();
  const [cartItems] = useState<CartItem[]>(initialCartItems);
  const [quantities, setQuantities] = useState<number[]>(initialCartItems.map(item => item.quantity));
  const [shippingAndTax] = useState(initialShippingAndTax);

  const updateQuantity = (index: number, delta: number) => {
    setQuantities(prev => {
      const newQuantities = [...prev];
      newQuantities[index] = Math.max(newQuantities[index] + delta, 1);
      return newQuantities;
    });
  };

  const subtotal = cartItems.reduce((acc, item, index) => acc + quantities[index] * item.shoppingItem.price, 0);

  const handleCheckoutClick = async () => {
    try {
      const response = await handleCheckout();
      if (response.status === 200) {
        toast.success(response.message);
        router.push('/');
      } else {
        toast.error('Checkout failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during checkout.');
      console.error('Checkout error:', error);
    }
  };

  const handleRemoveItem = async (itemId: string, index: number) => {
    try {
      const response = await handleRemoveFromCart(itemId);
      if (response.status === 200) {
        toast.success(response.message);
        setQuantities((prev) => prev.filter((_, i) => i !== index));
        cartItems.splice(index, 1);
      } else {
        toast.error("Failed to remove item. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while removing the item.");
      console.error("Remove item error:", error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <main className="max-w-7xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Shopping Cart is Empty</h2>
          <p className="text-gray-600 mb-6">No items added yet. Start shopping now!</p>
          <Link href="/">
            <Button variant="filled" className="px-4 py-2">
              Go to Home Page
            </Button>
          </Link>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="link" className="p-2">
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-orange-300/50 border-dashed rounded-lg">
              {/* Cart Header */}
              <div className="border-b-2 border-orange-300/50 p-4">
                <h2 className="text-xl font-bold text-gray-800">Shopping Cart ({cartItems.length} items)</h2>
              </div>

              {cartItems.map((item, index) => (
                <div key={item.shoppingItem.id} className="border-b-2 border-orange-300/50 p-4 relative">
                  <Button
                    className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                    onClick={() => handleRemoveItem(item.shoppingItem.id, index)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                  </Button>
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-200 border-2 border-orange-300/50 border-dashed rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.shoppingItem.imageUrl}
                        alt={item.shoppingItem.imageAlt}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded"
                        unoptimized={item.shoppingItem.imageUrl.startsWith('http')}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.shoppingItem.productName}</h3>
                      <p className="text-sm text-gray-600 mb-2">by {item.shoppingItem.sellerName}</p>

                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-gray-700 font-medium">Quantity:</span>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            className={`px-1 ${quantities[index] === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => updateQuantity(index, -1)}
                            disabled={quantities[index] === 1}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </Button>
                          <span className="px-4 py-1">{quantities[index]}</span>
                          <Button
                            variant="outline"
                            className="px-1"
                            onClick={() => updateQuantity(index, 1)}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </div>
                      </div>

                      {/* Price */}
                      <span className="font-semibold text-gray-800">{formatCurrency(item.shoppingItem.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-orange-300/50 border-dashed rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700 gap-x-2">
                  <span>Subtotal ({quantities.reduce((acc, quantity) => acc + quantity, 0)} items):</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping:</span>
                  <span>{formatCurrency(shippingAndTax.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax:</span>
                  <span>{formatCurrency(shippingAndTax.taxAmount)}</span>
                </div>

                <div className="border-t-2 border-orange-300/50 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total:</span>
                    <span>{formatCurrency(subtotal + shippingAndTax.shippingCost + shippingAndTax.taxAmount)}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="filled"
                className="w-full px-3 py-2"
                onClick={handleCheckoutClick}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

// Main page component with Suspense wrapper
export default function CartPage() {
  return (
    <Suspense fallback={<CartPageSkeleton />}>
      <CartContent />
    </Suspense>
  );
}
