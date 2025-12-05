// tabs.page.ts - Simplificado
import { Component, EnvironmentInjector, inject } from '@angular/core';
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
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  cartCount: number = 3; // Puedes conectar esto con un servicio real

  constructor() {
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
}