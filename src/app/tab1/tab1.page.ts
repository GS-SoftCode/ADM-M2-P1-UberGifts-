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
  person,
  cube, chevronForward } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { OrderService, CurrentOrder } from '../services/order.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

interface Category {
  id: string;
  name: string;
  count: number;
  popular: boolean;
  icon: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  storeIcon: string;
  rating: number;
  price: number;
  description: string;
  category?: string;
}

interface SearchResult {
  type: 'category' | 'product';
  id: string | number;
  name: string;
  icon?: string;
  description?: string;
  category?: string;
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
  searchResults: SearchResult[] = [];
  showResults: boolean = false;
  currentOrder$!: Observable<CurrentOrder | null>;
  
  categories: Category[] = [
    { id: 'dulces', name: 'Dulces', count: 12, popular: true, icon: 'ice-cream' },
    { id: 'flores', name: 'Flores', count: 8, popular: false, icon: 'flower' },
    { id: 'peluches', name: 'Peluches', count: 15, popular: false, icon: 'paw' },
    { id: 'chocolates', name: 'Chocolates', count: 10, popular: false, icon: 'cafe' },
  ];

  categoryImages: Record<string, string> = {
    'dulces': '../../assets/icon/Dulces.jpg',
    'flores': '../../assets/icon/Flores.jpg',
    'peluches': '../../assets/icon/Peluches.jpg',
    'chocolates': 'https://images.unsplash.com/photo-1511381939415-e44015466834?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  products: Product[] = [
    // Dulces
    { id: 1, name: 'Suspiros', image: 'assets/icon/Dulces/Suspiros.jpeg', storeIcon: 'assets/icon/LocalDulces.jpg', rating: 5, price: 0.75, description: 'Dulces tradicionales crujientes y ligeros.', category: 'dulces' },
    { id: 2, name: 'Pristiños', image: 'assets/icon/Dulces/Pristiños.png', storeIcon: 'assets/icon/LocalDulces.jpg', rating: 4, price: 1.10, description: 'Deliciosos pristiños con miel.', category: 'dulces' },
    { id: 3, name: 'Alfajores', image: 'assets/icon/Dulces/Alfajores.jpg', storeIcon: 'assets/icon/LocalDulces.jpg', rating: 3, price: 1.50, description: 'Alfajores rellenos con dulce de leche.', category: 'dulces' },
    // Chocolates
    { id: 4, name: 'Bombones mixtos', image: 'assets/icon/Chocolates/BombonesMixtos.jpg', storeIcon: 'assets/icon/LocalDulces.jpg', rating: 5, price: 0.99, description: 'Selección de bombones surtidos con cacao premium.', category: 'chocolates' },
    { id: 5, name: 'Caja de chocolates', image: 'assets/icon/Chocolates/CajaChocolates.jpg', storeIcon: 'assets/icon/LocalDulces.jpg', rating: 4, price: 3.50, description: 'Caja elegante con variedad de chocolates artesanales.', category: 'chocolates' },
    { id: 6, name: 'Trufas de cacao', image: 'assets/icon/Chocolates/TrufasCacao.jpg', storeIcon: 'assets/icon/LocalDulces.jpg', rating: 4, price: 2.25, description: 'Trufas suaves cubiertas de cacao fino.', category: 'chocolates' },
    // Flores
    { id: 7, name: 'Ramo rosas', image: 'assets/icon/Flores/RamoRosas.jpg', storeIcon: 'assets/icon/LocalDulces.jpg', rating: 5, price: 8.99, description: 'Ramo de rosas frescas y fragantes.', category: 'flores' },
    { id: 8, name: 'Tulipanes mixtos', image: 'assets/icon/Flores/Tulipanes.jpg', storeIcon: 'assets/icon/LocalDulces.jpg', rating: 4, price: 7.50, description: 'Tulipanes de colores variados.', category: 'flores' },
    { id: 9, name: 'Gerberas', image: 'assets/icon/Flores/Gerberas.jpg', storeIcon: 'assets/icon/LocalDulces.jpg', rating: 4, price: 6.80, description: 'Girasoles brillantes y alegres.', category: 'flores' },
    // Peluches
    { id: 10, name: 'Osos clásicos', image: 'assets/icon/Peluches/Osos.jpg', storeIcon: 'assets/icon/LocalDulces.jpg', rating: 5, price: 4.99, description: 'Peluche de oso suave y tierno.', category: 'peluches' },
    { id: 11, name: 'Peluche de Stitch', image: 'assets/icon/Peluches/Stitch.jpeg', storeIcon: 'assets/icon/LocalDulces.jpg', rating: 4, price: 6.50, description: 'Peluche de Stitch con gran detalle.', category: 'peluches' },
    { id: 12, name: 'Panda suave', image: 'assets/icon/Peluches/Panda.jpg', storeIcon: 'assets/icon/LocalDulces.jpg', rating: 3, price: 5.25, description: 'Peluche de panda esponjoso.', category: 'peluches' },
  ];

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private popoverController: PopoverController,
    private router: Router
  ) {
    // Registrar iconos necesarios
    addIcons({personCircle,gift,close,search,rocket,heart,iceCream,flower,paw,cafe,balloon,logOut,person,cube,chevronForward});
  }

  ngOnInit() {
    // Mostrar todas las categorías al inicio
    this.filteredCategories = [...this.categories];
    
    // Suscribirse a los cambios del pedido actual
    this.currentOrder$ = this.orderService.currentOrder$;
    
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
      this.searchResults = [];
      this.showResults = false;
    } else {
      // Resultados combinados: categorías y productos
      this.searchResults = this.getSearchResults(value);
      this.showResults = this.searchResults.length > 0;
    }
  }

  private getSearchResults(query: string): SearchResult[] {
    const results: SearchResult[] = [];

    // Buscar en categorías
    this.categories.forEach(cat => {
      if (cat.name.toLowerCase().includes(query) || cat.id.toLowerCase().includes(query)) {
        results.push({
          type: 'category',
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          description: `${cat.count} opciones`
        });
      }
    });

    // Buscar en productos
    this.products.forEach(prod => {
      if (prod.name.toLowerCase().includes(query) || prod.description.toLowerCase().includes(query)) {
        results.push({
          type: 'product',
          id: prod.id,
          name: prod.name,
          description: prod.category,
          category: prod.category
        });
      }
    });

    return results.slice(0, 10);
  }

  onSelectResult(result: SearchResult) {
    if (result.type === 'category') {
      this.router.navigate(['/tabs/category', result.id]);
    } else if (result.type === 'product') {
      const product = this.products.find(p => p.id === result.id);
      if (product) {
        this.router.navigate(['/product', product.id], {
          queryParams: {
            name: product.name,
            image: product.image,
            rating: product.rating,
            price: product.price,
            description: product.description,
            category: product.category
          }
        });
      }
    }

    this.searchText = '';
    this.searchResults = [];
    this.showResults = false;
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

  goToOrderConfirmation() {
    this.router.navigate(['/order-confirmation']);
  }

  private vibrate() {
    // Vibración para feedback táctil (solo en dispositivos que lo soportan)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }
}