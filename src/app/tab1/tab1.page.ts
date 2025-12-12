import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonSearchbar, 
  IonButton, 
  IonIcon, 
  IonCard, 
  IonCardContent, 
  IonImg,
  IonBadge,
  PopoverController
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
  heart, 
  search,
  logOut,
  person
} from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

interface Category {
  id: string;
  name: string;
  count: number;
  popular: boolean;
  icon: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
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
  searchText: string = '';
  filteredCategories: Category[] = [];
  
  categories: Category[] = [
    { id: 'dulces', name: 'Dulces', count: 12, popular: true, icon: 'ice-cream' },
    { id: 'flores', name: 'Flores', count: 8, popular: false, icon: 'flower' },
    { id: 'peluches', name: 'Peluches', count: 15, popular: false, icon: 'paw' },
    { id: 'chocolates', name: 'Chocolates', count: 10, popular: false, icon: 'cafe' },
    { id: 'globos', name: 'Globos', count: 6, popular: false, icon: 'balloon' },
  ];

  categoryImages: Record<string, string> = {
    'dulces': '../../assets/icon/Dulces.jpg',
    'flores': '../../assets/icon/Flores.jpg',
    'peluches': '../../assets/icon/Peluches.jpg',
    'chocolates': 'https://images.unsplash.com/photo-1511381939415-e44015466834?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'globos': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  constructor(
    private authService: AuthService,
    private popoverController: PopoverController,
    private router: Router
  ) {
    // Registrar iconos necesarios
    addIcons({personCircle,gift,close,search,rocket,heart,iceCream,flower,paw,cafe,balloon,logOut,person});
  }

  ngOnInit() {
    // Mostrar todas las categorías al inicio
    this.filteredCategories = [...this.categories];
    
    // Ocultar promo después de 10 segundos
    setTimeout(() => {
      this.showPromo = false;
    }, 10000);
  }

  async openProfileMenu(event: any) {
    // Importar el componente dinámicamente
    const { ProfileMenuComponent } = await import('./profile-menu/profile-menu.component');
    
    const currentUser = this.authService.getCurrentUser();
    
    const popover = await this.popoverController.create({
      component: ProfileMenuComponent,
      event: event,
      componentProps: {
        userEmail: currentUser?.email || 'usuario@example.com',
        userName: currentUser?.displayName || 'Usuario'
      },
      translucent: true,
      cssClass: 'profile-popover'
    });

    return await popover.present();
  }

  onSearchChange(event: any) {
    const value = event.detail.value?.toLowerCase() || '';
    this.searchText = value;
    
    if (value === '') {
      // Si el búsqueda está vacía, mostrar todas las categorías
      this.filteredCategories = [...this.categories];
    } else {
      // Filtrar categorías por nombre
      this.filteredCategories = this.categories.filter(cat =>
        cat.name.toLowerCase().includes(value) ||
        cat.id.toLowerCase().includes(value)
      );
    }
  }

  getCategoryImage(categoryId: string): string {
    return this.categoryImages[categoryId] || '../../assets/icon/default.jpg';
  }

  onCategory(key: string) {
    // Navegar a la ruta de categoría
    console.log('Categoría seleccionada:', key);
    // Limpiar búsqueda al seleccionar una categoría
    this.searchText = '';
    this.filteredCategories = [...this.categories];
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