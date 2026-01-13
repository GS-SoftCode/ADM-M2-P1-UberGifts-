import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonInput, IonLabel, IonCard, ModalController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronBack } from 'ionicons/icons';
import { CartService, CartItem } from '../../services/cart.service';
import { LocationService, Location } from '../../services/location.service';
import { OrderService } from '../../services/order.service';
import { LocationModalComponent } from '../../tab1/location-modal/location-modal';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonCard],
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss']
})
export class CheckoutPage implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  selectedLocation: Location | undefined;
  
  // Datos del formulario
  fullName: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';
  city: string = '';
  zipCode: string = '';
  
  // Control de envío
  shippingMethod: 'standard' | 'express' = 'standard';
  shippingCost: number = 0;

  // Control de pago
  paymentMethod: 'credit-card' | 'paypal' | 'bank-transfer' = 'credit-card';  constructor(
    private cartService: CartService,
    private locationService: LocationService,
    private orderService: OrderService,
    private router: Router,
    private modalController: ModalController
  ) {
    addIcons({ chevronBack });
  }

  ngOnInit() {
    this.cartItems$ = this.cartService.cartItems$;
    this.updateShippingCost();
    
    // Obtener ubicación por defecto
    const defaultLocation = this.locationService.getDefaultLocation();
    if (defaultLocation) {
      this.selectedLocation = defaultLocation;
    }
  }

  back() {
    this.router.navigate(['/tabs/tab3']);
  }

  async openLocationModal() {
    const modal = await this.modalController.create({
      component: LocationModalComponent,
      cssClass: 'location-modal'
    });

    await modal.present();
    
    // Después de cerrar el modal, actualizar la ubicación seleccionada
    await modal.onDidDismiss();
    const updatedLocation = this.locationService.getDefaultLocation();
    if (updatedLocation) {
      this.selectedLocation = updatedLocation;
      this.fullName = updatedLocation.fullName;
      this.email = updatedLocation.email;
      this.phone = updatedLocation.phone;
      this.address = updatedLocation.address;
      this.city = updatedLocation.city;
      this.zipCode = updatedLocation.zipCode;
    }
  }

  updateShippingCost() {
    this.shippingCost = this.shippingMethod === 'standard' ? 0.40 : 5;
  }

  getCartTotal(): number {
    return this.cartService.getTotalPrice();
  }

  getTotal(): number {
    return this.getCartTotal() + this.shippingCost;
  }

  isFormValid(): boolean {
    // Si hay ubicación seleccionada, solo validar eso
    if (this.selectedLocation) {
      return true;
    }
    
    // Si no hay ubicación, validar que los campos estén llenos
    return (
      this.fullName.trim() !== '' &&
      this.email.trim() !== '' &&
      this.phone.trim() !== '' &&
      this.address.trim() !== '' &&
      this.city.trim() !== '' &&
      this.zipCode.trim() !== ''
    );
  }

  completeOrder() {
    if (!this.isFormValid()) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Aquí irían los datos del pedido
    const orderData = {
      customer: {
        name: this.fullName,
        email: this.email,
        phone: this.phone
      },
      shipping: {
        address: this.address,
        city: this.city,
        zipCode: this.zipCode,
        method: this.shippingMethod
      },
      items: this.cartService.getCart(),
      subtotal: this.getCartTotal(),
      shippingCost: this.shippingCost,
      total: this.getTotal()
    };

    console.log('Pedido:', orderData);

    // Generar número de orden
    const orderNumber = '#' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Obtener la fecha actual
    const now = new Date();
    const orderDate = now.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Generar tiempo estimado aleatorio entre 30-60 segundos
    const estimatedTime = Math.floor(Math.random() * 31) + 30;
    
    // Crear la orden en el servicio (esto inicia el countdown)
    this.orderService.setCurrentOrder({
      orderNumber: orderNumber,
      total: this.getTotal(),
      estimatedTime: estimatedTime,
      deliveryAddress: this.selectedLocation?.address || 'Tu dirección de envío',
      orderDate: orderDate
    });

    // Limpiar carrito y navegar a página de confirmación
    this.cartService.clearCart();
    this.router.navigate(['/order-confirmation']);
  }
}
