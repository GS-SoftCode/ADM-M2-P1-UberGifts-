// tab2.page.ts - Mejorado
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonSearchbar, 
  IonButton, 
  IonIcon, 
  IonImg, 
  IonCard,
  IonChip,
  IonLabel,
  IonBadge
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  personCircle, 
  star, 
  time, 
  location, 
  arrowForward,
  navigate,
  locate,
  flower,
  iceCream
} from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonImg
],
})
export class Tab2Page implements OnInit {
  selectedStore: number = 1;

  constructor() {
    addIcons({ 
      personCircle, 
      star, 
      time, 
      location, 
      arrowForward,
      navigate,
      locate,
      flower,
      iceCream
    });
  }

  ngOnInit() {
    // Puedes inicializar datos aquí si es necesario
  }

  selectStore(storeId: number) {
    this.selectedStore = storeId;
    console.log('Tienda seleccionada:', storeId);
    
    // Aquí podrías navegar a la página de detalles de la tienda
    // this.router.navigate(['/store', storeId]);
    
    // Feedback táctil
    this.vibrate();
  }

  private vibrate() {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }
}