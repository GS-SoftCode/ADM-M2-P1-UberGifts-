import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, home, chevronBack } from 'ionicons/icons';
import { OrderService, CurrentOrder } from '../../services/order.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon],
  templateUrl: './order-confirmation.page.html',
  styleUrls: ['./order-confirmation.page.scss']
})
export class OrderConfirmationPage implements OnInit, OnDestroy {
  orderTotal: number = 0;
  orderNumber: string = '';
  estimatedTime: number = 25; // segundos
  deliveryAddress: string = '';
  orderDate: string = '';
  currentOrder$!: Observable<CurrentOrder | null>;
  timeRemaining: number = 0;
  private orderSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {
    addIcons({chevronBack,checkmarkCircle,home});
  }

  ngOnInit() {
    // Obtener la orden actual que fue creada en checkout
    const currentOrder = this.orderService.getCurrentOrder();
    
    if (currentOrder) {
      this.orderNumber = currentOrder.orderNumber;
      this.estimatedTime = currentOrder.estimatedTime;
      this.deliveryAddress = currentOrder.deliveryAddress;
      this.orderDate = currentOrder.orderDate;
      this.orderTotal = currentOrder.total;
    }

    // Suscribirse a los cambios del pedido para actualizar el countdown en tiempo real
    this.currentOrder$ = this.orderService.currentOrder$;
    this.orderSubscription = this.currentOrder$.subscribe(order => {
      if (order) {
        this.timeRemaining = order.timeRemaining || order.estimatedTime;
        
        // Si el pedido se entregó, redirigir a tab1 después de 2 segundos
        if (order.isDelivered) {
          setTimeout(() => {
            this.router.navigate(['/tabs/tab1']);
          }, 2000);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

  back() {
    this.router.navigate(['/tabs/tab1']);
  }

  continueShoppping() {
    this.router.navigate(['/tabs/tab1']);
  }
}
