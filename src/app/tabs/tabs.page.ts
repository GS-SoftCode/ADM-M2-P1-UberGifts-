// tabs.page.ts
import { Component, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  home, 
  locationOutline, 
  location, 
  cartOutline, 
  cart 
} from 'ionicons/icons';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon
],
})
export class TabsPage implements OnInit {
  public environmentInjector = inject(EnvironmentInjector);
  cartCount: number = 0;

  constructor(private cartService: CartService) {
    // Registrar todos los iconos necesarios
    addIcons({ 
      homeOutline, 
      home, 
      locationOutline, 
      location, 
      cartOutline, 
      cart 
    });
  }

  ngOnInit() {
    // Suscribirse a los cambios del carrito
    this.cartService.cartItems$.subscribe((items) => {
      // Contar solo los productos diferentes (contenedores), no la cantidad total
      this.cartCount = items.length;
    });
  }
}