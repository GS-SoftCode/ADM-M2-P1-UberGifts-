// TS corregido - tab1.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonSearchbar, 
  IonButton, 
  IonIcon, 
  IonCard, 
  IonCardContent, 
  IonImg,
  IonBadge
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  personCircle, 
  gift, 
  close,
  iceCream,
  flower,
  paw,
  cafe,
  balloon,
  rocket,
  heart
} from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    IonContent, 
    IonSearchbar, 
    IonButton, 
    IonIcon, 
    IonCard, 
    IonCardContent, 
    IonImg,
    IonBadge
  ],
})
export class Tab1Page implements OnInit {
  showPromo: boolean = true;
  categories = [
    { id: 'dulces', name: 'Dulces', count: 12, popular: true, icon: 'ice-cream' },
    { id: 'flores', name: 'Flores', count: 8, popular: false, icon: 'flower' },
    { id: 'peluches', name: 'Peluches', count: 15, popular: false, icon: 'paw' },
    { id: 'chocolates', name: 'Chocolates', count: 10, popular: false, icon: 'cafe' },
    { id: 'globos', name: 'Globos', count: 6, popular: false, icon: 'balloon' },
  ];

  constructor() {
    // Registrar iconos necesarios (quitamos location ya que no se usa)
    addIcons({ 
      personCircle, 
      gift, 
      close,
      iceCream,
      flower,
      paw,
      cafe,
      balloon,
      rocket,
      heart
    });
  }

  ngOnInit() {
    // Ocultar promo después de 10 segundos
    setTimeout(() => {
      this.showPromo = false;
    }, 10000);
  }

  onCategory(key: string) {
    // Navegar a la ruta de categoría
    console.log('Categoría seleccionada:', key);
    // Navega al nuevo tab de categoría dentro de Tabs
    window.location.assign(`/tabs/category/${key}`);
    // Feedback táctil
    this.vibrate();
  }

  private vibrate() {
    // Vibración para feedback táctil (solo en dispositivos que lo soportan)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }
}