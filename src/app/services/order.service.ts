import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface CurrentOrder {
  orderNumber: string;
  total: number;
  estimatedTime: number;
  deliveryAddress: string;
  orderDate: string;
  timeRemaining?: number;
  isDelivered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private currentOrderSubject = new BehaviorSubject<CurrentOrder | null>(null);
  currentOrder$: Observable<CurrentOrder | null> = this.currentOrderSubject.asObservable();
  private timerSubscription: Subscription | null = null;

  constructor() {
    this.loadCurrentOrder();
  }

  setCurrentOrder(order: CurrentOrder) {
    const fullOrder: CurrentOrder = {
      ...order,
      timeRemaining: order.estimatedTime,
      isDelivered: false
    };
    this.currentOrderSubject.next(fullOrder);
    localStorage.setItem('currentOrder', JSON.stringify(fullOrder));
    
    // Iniciar el countdown
    this.startDeliveryCountdown(order.estimatedTime);
  }

  getCurrentOrder(): CurrentOrder | null {
    return this.currentOrderSubject.value;
  }

  hasActiveOrder(): boolean {
    const order = this.currentOrderSubject.value;
    return order !== null && !order.isDelivered;
  }

  private startDeliveryCountdown(initialTime: number) {
    // Limpiar cualquier timer anterior
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    let timeRemaining = initialTime;
    
    this.timerSubscription = interval(1000).subscribe(() => {
      timeRemaining--;
      
      const currentOrder = this.currentOrderSubject.value;
      if (currentOrder) {
        const updatedOrder: CurrentOrder = {
          ...currentOrder,
          timeRemaining
        };
        this.currentOrderSubject.next(updatedOrder);
        localStorage.setItem('currentOrder', JSON.stringify(updatedOrder));
        
        // Cuando el tiempo llega a 0, marcar como entregado
        if (timeRemaining <= 0) {
          const deliveredOrder: CurrentOrder = {
            ...currentOrder,
            isDelivered: true,
            timeRemaining: 0
          };
          this.currentOrderSubject.next(deliveredOrder);
          localStorage.setItem('currentOrder', JSON.stringify(deliveredOrder));
          
          if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
            this.timerSubscription = null;
          }
        }
      }
    });
  }

  clearCurrentOrder() {
    this.currentOrderSubject.next(null);
    localStorage.removeItem('currentOrder');
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  private loadCurrentOrder() {
    const stored = localStorage.getItem('currentOrder');
    if (stored) {
      try {
        const order: CurrentOrder = JSON.parse(stored);
        this.currentOrderSubject.next(order);
        
        // Si el pedido no está entregado, reanudar el countdown
        if (!order.isDelivered && order.timeRemaining && order.timeRemaining > 0) {
          this.startDeliveryCountdown(order.timeRemaining);
        }
      } catch (e) {
        console.error('Error loading current order:', e);
      }
    }
  }
}
