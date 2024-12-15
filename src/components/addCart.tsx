import React, { useState } from 'react';

interface Book {
  id: number;
  title: string;
  price: number;
  image_url: string;
}

interface AddToCartButtonProps {
  book: Book;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ book }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    // Obtener el carrito actual del localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Verificar si el libro ya está en el carrito
    const existingBookIndex = cart.findIndex((item: Book) => item.id === book.id);
    
    if (existingBookIndex > -1) {
      // Si ya está, incrementar la cantidad
      cart[existingBookIndex].quantity = (cart[existingBookIndex].quantity || 1) + 1;
    } else {
      // Si no está, añadir con cantidad 1
      cart.push({ ...book, quantity: 1 });
    }
    
    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Mostrar efecto de añadido
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAddToCart} 
      className={`
        ${isAdded ? 'bg-green-500' : 'bg-black'} 
        text-white rounded-lg px-4 py-2 mt-10 max-w-52 transition-colors
      `}
    >
      {isAdded ? 'Añadido ✓' : 'Añadir al carrito'}
    </button>
  );
};