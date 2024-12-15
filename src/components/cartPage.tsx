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
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Tu Carrito</h1>
      
      {cartItems.length === 0 ? (
        <p className="text-center">Tu carrito está vacío</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div 
              key={item.id} 
              className="flex items-center border-b border-gray-700 py-4"
            >
              <img 
                src={item.image_url} 
                alt={item.title} 
                className="w-20 h-20 object-cover mr-4" 
              />
              <div className="flex-grow">
                <h2 className="text-xl">{item.title}</h2>
                <p>${item.price.toFixed(2)}</p>
              </div>
              <div className='flex-grow'>
                <p>{item.description}</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                  className="bg-gray-700 text-white px-2 py-1 rounded mr-2"
                >
                  -
                </button>
                <span>{item.quantity || 1}</span>
                <button 
                  onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                  className="bg-gray-700 text-white px-2 py-1 rounded ml-2 mr-4"
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
            <button className="bg-green-600 text-white px-6 py-2 rounded mt-4">
              Procesar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
};