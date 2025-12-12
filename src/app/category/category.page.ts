import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSearchbar, IonIcon, IonImg, IonCard, IonButton, PopoverController } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { personCircle, search, logOut, person } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

interface Product {
  id: number;
  name: string;
  image: string;
  storeIcon: string;
  rating: number;
  price: number;
  description: string;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonSearchbar, IonIcon, IonImg, IonCard]
})
export class CategoryPage implements OnInit {
  categoryId: string = '';
  searchText: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService,
    private popoverController: PopoverController
  ) {
    addIcons({ personCircle, search, logOut, person });
  }

  ngOnInit() {
    this.categoryId = (this.route.snapshot.paramMap.get('id') || '').toLowerCase();
    this.products = this.getProductsForCategory(this.categoryId);
    this.filteredProducts = [...this.products];
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

  onSearchChange(event: any) {
    const value = event.detail.value?.toLowerCase() || '';
    this.searchText = value;
    
    if (value === '') {
      // Si la búsqueda está vacía, mostrar todos los productos
      this.filteredProducts = [...this.products];
    } else {
      // Filtrar productos por nombre o descripción
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(value) ||
        p.description.toLowerCase().includes(value)
      );
    }
  }

  private getProductsForCategory(id: string) {
    const storeIcon = 'assets/icon/LocalDulces.jpg';
    const datasets: Record<string, Product[]> = {
      chocolates: [
        { id: 1, name: 'Bombones mixtos', image: 'assets/icon/Chocolates/BombonesMixtos.jpg', storeIcon: storeIcon, rating: 5, price: 0.99, description: 'Selección de bombones surtidos con cacao premium.' },
        { id: 2, name: 'Caja de chocolates', image: 'assets/icon/Chocolates/CajaChocolates.jpg', storeIcon: storeIcon, rating: 4, price: 3.50, description: 'Caja elegante con variedad de chocolates artesanales.' },
        { id: 3, name: 'Trufas de cacao', image: 'assets/icon/Chocolates/TrufasCacao.jpg', storeIcon: storeIcon, rating: 4, price: 2.25, description: 'Trufas suaves cubiertas de cacao fino.' }
      ],
      dulces: [
        { id: 1, name: 'Suspiros', image: 'assets/icon/Dulces/Suspiros.jpeg', storeIcon: storeIcon, rating: 5, price: 0.75, description: 'Dulces tradicionales crujientes y ligeros.' },
        { id: 2, name: 'Pristiños', image: 'assets/icon/Dulces/Pristiños.png', storeIcon: storeIcon, rating: 4, price: 1.10, description: 'Deliciosos pristiños con miel.' },
        { id: 3, name: 'Alfajores', image: 'assets/icon/Dulces/Alfajores.jpg', storeIcon: storeIcon, rating: 3, price: 1.50, description: 'Alfajores rellenos con dulce de leche.' }
      ],
      flores: [
        { id: 1, name: 'Ramo rosas', image: 'assets/icon/Flores/RamoRosas.jpg', storeIcon: storeIcon, rating: 5, price: 8.99, description: 'Ramo de rosas frescas y fragantes.' },
        { id: 2, name: 'Tulipanes mixtos', image: 'assets/icon/Flores/Tulipanes.jpg', storeIcon: storeIcon, rating: 4, price: 7.50, description: 'Tulipanes de colores variados.' },
        { id: 3, name: 'Gerberas', image: 'assets/icon/Flores/Gerberas.jpg', storeIcon: storeIcon, rating: 4, price: 6.80, description: 'Girasoles brillantes y alegres.' }
      ],
      peluches: [
        { id: 1, name: 'Osos clásicos', image: 'assets/icon/Peluches/Osos.jpg', storeIcon: storeIcon, rating: 5, price: 4.99, description: 'Peluche de oso suave y tierno.' },
        { id: 2, name: 'Peluche de Stitch', image: 'assets/icon/Peluches/Stitch.jpeg', storeIcon: storeIcon, rating: 4, price: 6.50, description: 'Peluche de Stitch con gran detalle.' },
        { id: 3, name: 'Panda suave', image: 'assets/icon/Peluches/Panda.jpg', storeIcon: storeIcon, rating: 3, price: 5.25, description: 'Peluche de panda esponjoso.' }
      ]
    };
    return datasets[id] || [];
  }

  goToDetail(p: Product) {
    this.router.navigate(['/product', p.id], {
      queryParams: {
        name: p.name,
        image: p.image,
        rating: p.rating,
        price: p.price,
        description: p.description,
        category: this.categoryId
      }
    });
  }
}
