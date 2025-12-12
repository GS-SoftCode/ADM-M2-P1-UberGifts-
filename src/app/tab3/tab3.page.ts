import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSearchbar, IonButton, IonIcon, IonImg, IonCard, PopoverController } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { personCircle, close, addCircle, arrowForward } from 'ionicons/icons';
import { CartService, CartItem } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

interface SearchResult {
  type: 'item' | 'category' | 'product';
  id: string | number;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
}

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

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonSearchbar, IonButton, IonIcon, IonImg, IonCard],
})
export class Tab3Page implements OnInit, OnDestroy {
  cartItems$!: Observable<CartItem[]>;
  filteredItems$!: Observable<CartItem[]>;
  searchText: string = '';
  searchResults: SearchResult[] = [];
  showResults: boolean = false;
  private allCartItems: CartItem[] = [];
  private destroy$ = new Subject<void>();

  categories: Category[] = [
    { id: 'dulces', name: 'Dulces', count: 12, popular: true, icon: 'ice-cream' },
    { id: 'flores', name: 'Flores', count: 8, popular: false, icon: 'flower' },
    { id: 'peluches', name: 'Peluches', count: 15, popular: false, icon: 'paw' },
    { id: 'chocolates', name: 'Chocolates', count: 10, popular: false, icon: 'cafe' },
  ];

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
    private cartService: CartService, 
    private router: Router,
    private authService: AuthService,
    private popoverController: PopoverController
  ) {
    addIcons({ personCircle, close, addCircle, arrowForward });
  }

  ngOnInit() {
    this.cartItems$ = this.cartService.cartItems$;
    this.filteredItems$ = this.cartItems$;
    
    // Mantener una copia local de los items del carrito para búsqueda
    this.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.allCartItems = items;
        console.log('Cart items updated:', this.allCartItems);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(event: any) {
    const value = event.detail.value?.toLowerCase().trim() || '';
    this.searchText = value;

    if (value === '') {
      this.searchResults = [];
      this.showResults = false;
      this.filteredItems$ = this.cartItems$;
    } else {
      this.searchResults = this.getSearchResults(value);
      this.showResults = this.searchResults.length > 0;
      
      // Filtrar items del carrito
      this.filteredItems$ = this.cartItems$.pipe(
        map(items =>
          items.filter(item =>
            item.name.toLowerCase().includes(value) ||
            item.description.toLowerCase().includes(value)
          )
        )
      );
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

    // Buscar en productos del catálogo
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

    return results.slice(0, 10); // Limitar a 10 resultados
  }

  onSelectResult(result: SearchResult) {
    if (result.type === 'category') {
      // Navegar a la categoría
      this.router.navigate(['/tabs/category', result.id]);
    } else if (result.type === 'product') {
      const product = this.products.find(p => p.id === result.id);
      if (product) {
        // Navegar a la página de detalle del producto
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
    
    // Limpiar búsqueda
    this.searchText = '';
    this.searchResults = [];
    this.showResults = false;
  }

  removeItem(itemId: string, event: Event) {
    event.stopPropagation();
    this.cartService.removeFromCart(itemId);
  }

  openProductDetail(product: CartItem) {
    this.router.navigate(['/product', product.id], {
      queryParams: {
        name: product.name,
        image: product.image,
        rating: product.rating,
        price: product.price,
        description: product.description,
        category: product.category,
        fromCart: 'true',
        currentQuantity: product.quantity
      }
    });
  }

  addMoreProducts() {
    this.router.navigate(['/tabs/tab2']);
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  async openProfileMenu(event: any) {
    // Importar el componente dinámicamente
    const { ProfileMenuComponent } = await import('../tab1/profile-menu/profile-menu.component');
    
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
}
