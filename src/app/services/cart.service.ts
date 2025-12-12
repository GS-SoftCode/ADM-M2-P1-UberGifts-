import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
  description: string;
  category: string;
  quantity: number;
  storeIcon: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>(this.loadCart());
  public cartItems$ = this.cartItems.asObservable();

  constructor() {}

  private loadCart(): CartItem[] {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartItems.next(items);
  }

  addToCart(item: CartItem): void {
    const currentCart = this.cartItems.value;
    const existingItem = currentCart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentCart.push(item);
    }

    this.saveCart(currentCart);
  }

  removeFromCart(itemId: string): void {
    const currentCart = this.cartItems.value.filter(item => item.id !== itemId);
    this.saveCart(currentCart);
  }

  updateQuantity(itemId: string, quantity: number): void {
    const currentCart = this.cartItems.value;
    const item = currentCart.find(cartItem => cartItem.id === itemId);
    
    if (item) {
      if (quantity > 0) {
        item.quantity = quantity;
        this.saveCart(currentCart);
      } else {
        this.removeFromCart(itemId);
      }
    }
  }

  getCart(): CartItem[] {
    return this.cartItems.value;
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}
