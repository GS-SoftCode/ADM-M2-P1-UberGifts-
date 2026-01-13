import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  rating?: number;
  price: number;
  description: string;
  category: string;
  quantity: number;
  storeIcon?: string;
}

export interface Carrito {
  id?: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private cartItems = new BehaviorSubject<CartItem[]>(this.loadCart());
  public cartItems$ = this.cartItems.asObservable();
  private collectionName = 'carritos';

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {}

  /**
   * Cargar carrito del localStorage (para compatibilidad)
   */
  private loadCart(): CartItem[] {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Guardar carrito en localStorage
   */
  private saveCart(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartItems.next(items);
  }

  /**
   * Agregar item al carrito
   */
  addToCart(item: CartItem): void {
    const currentCart = this.cartItems.value;
    const existingItem = currentCart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentCart.push(item);
    }

    this.saveCart(currentCart);
    this.syncCartToFirestore();
  }

  /**
   * Eliminar item del carrito
   */
  removeFromCart(itemId: string): void {
    const currentCart = this.cartItems.value.filter((item) => item.id !== itemId);
    this.saveCart(currentCart);
    this.syncCartToFirestore();
  }

  /**
   * Actualizar cantidad de un item
   */
  updateQuantity(itemId: string, quantity: number): void {
    const currentCart = this.cartItems.value;
    const item = currentCart.find((cartItem) => cartItem.id === itemId);

    if (item) {
      if (quantity > 0) {
        item.quantity = quantity;
        this.saveCart(currentCart);
        this.syncCartToFirestore();
      } else {
        this.removeFromCart(itemId);
      }
    }
  }

  /**
   * Obtener carrito actual
   */
  getCart(): CartItem[] {
    return this.cartItems.value;
  }

  /**
   * Vaciar carrito
   */
  clearCart(): void {
    this.saveCart([]);
    this.syncCartToFirestore();
  }

  /**
   * Obtener total del carrito
   */
  getCartTotal(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  /**
   * Obtener cantidad de items en el carrito
   */
  getCartItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Sincronizar carrito con Firestore
   * Guardar el carrito en Firestore para persistencia entre dispositivos
   */
  private syncCartToFirestore(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return;
    }

    const carrito: Carrito = {
      userId: currentUser.uid,
      items: this.cartItems.value,
      subtotal: this.getCartTotal(),
      lastUpdated: new Date()
    };

    // Buscar si ya existe un carrito para este usuario
    this.firestoreService
      .getDocumentsWhere(this.collectionName, 'userId', '==', currentUser.uid)
      .subscribe((carritos) => {
        if (carritos.length > 0) {
          // Actualizar carrito existente
          this.firestoreService
            .updateDocument(this.collectionName, carritos[0].id, carrito)
            .subscribe();
        } else {
          // Crear nuevo carrito
          this.firestoreService.addDocument(this.collectionName, carrito).subscribe();
        }
      });
  }

  /**
   * Cargar carrito desde Firestore
   */
  loadCartFromFirestore(): Observable<CartItem[]> {
    return new Observable((observer) => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        observer.next([]);
        observer.complete();
        return;
      }

      this.firestoreService
        .getDocumentsWhere(this.collectionName, 'userId', '==', currentUser.uid)
        .subscribe((carritos) => {
          if (carritos.length > 0) {
            const items = carritos[0].items || [];
            this.saveCart(items);
            observer.next(items);
          } else {
            observer.next([]);
          }
          observer.complete();
        });
    });
  }

  /**
   * Escuchar cambios del carrito en tiempo real
   */
  listenToCart(): Observable<CartItem[]> {
    return new Observable((observer) => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        observer.error('Usuario no autenticado');
        return;
      }

      // Obtener primer carrito del usuario
      this.firestoreService
        .getDocumentsWhere(this.collectionName, 'userId', '==', currentUser.uid)
        .subscribe((carritos) => {
          if (carritos.length > 0) {
            // Escuchar cambios en ese carrito
            this.firestoreService.listenToDocument(this.collectionName, carritos[0].id).subscribe(
              (carrito: any) => {
                if (carrito && carrito.items) {
                  this.saveCart(carrito.items);
                  observer.next(carrito.items);
                }
              }
            );
          }
        });
    });
  }
}
