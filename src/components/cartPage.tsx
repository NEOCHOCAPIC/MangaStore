import React, { useState, useEffect } from 'react';

interface Book {
  id: number;
  title: string;
  price: number;
  image_url: string;
  quantity?: number;
  description: string;
}

export const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<Book[]>([]);
  
    useEffect(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    }, []);
  
    const updateQuantity = (bookId: number, newQuantity: number) => {
      const updatedCart = cartItems.map(item => 
        item.id === bookId 
          ? { ...item, quantity: Math.max(1, newQuantity) } 
          : item
      );
      
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
  
    const removeItem = (bookId: number) => {
      const updatedCart = cartItems.filter(item => item.id !== bookId);
      
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
  
    const calculateTotal = () => {
      return cartItems.reduce((total, item) => 
        total + (item.price * (item.quantity || 1)), 0
      ).toFixed(2);
    };
  
    return (
      <div className="container mx-4 px-4 py-8 text-white md:mx-auto">
        <h1 className="text-3xl font-bold mb-6">Tu Carrito</h1>
        
        {cartItems.length === 0 ? (
          <p className="text-center">Tu carrito está vacío</p>
        ) : (
          <>
            {cartItems.map(item => (
              <div 
                key={item.id} 
                className="flex flex-col md:flex-row items-center border-b border-gray-700 py-4 space-y-4 md:space-y-0 md:space-x-4"
              >
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-20 h-20 object-cover mr-4"
                />
                <div className="flex-grow">
                  <h2 className="text-xl">{item.title}</h2>
                  <p className="text-sm md:text-base">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex-grow">
                  <p className="text-xs md:text-sm truncate">{item.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                    className="bg-gray-700 text-white px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity || 1}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    className="bg-gray-700 text-white px-2 py-1 rounded"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-6 text-right">
              <h2 className="text-2xl font-bold">
                Total: ${calculateTotal()}
              </h2>
              <button className="bg-green-600 text-white px-6 py-2 rounded mt-4 w-full md:w-auto">
                Procesar Compra
              </button>
            </div>
          </>
        )}
      </div>
    );
  };
  