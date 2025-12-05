import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonImg, IonCard } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBack } from 'ionicons/icons';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, IonImg, IonCard],
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss']
})
export class ProductDetailPage {
  id = '';
  name = '';
  image = '';
  rating = 0;
  price = 0;
  description = '';
  categoryId = '';
  moreProducts: Array<{ id: number; name: string; image: string; storeIcon: string; rating: number; price: number; description: string }> = [];

  // Quantity state
  qty = signal(1);
  total = computed(() => this.qty() * this.price);

  constructor(private route: ActivatedRoute, private router: Router) {
    addIcons({ chevronBack });
  }

  ngOnInit() {
    const p = this.route.snapshot.queryParamMap;
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.name = p.get('name') || '';
    this.image = p.get('image') || '';
    this.rating = Number(p.get('rating') || 0);
    this.price = Number(p.get('price') || 0);
    this.description = p.get('description') || 'Descripción no disponible.';
    this.categoryId = (p.get('category') || '').toLowerCase();

    // Build "Más de la tienda" list excluding current product
    if (this.categoryId) {
      const all = this.getProductsForCategory(this.categoryId);
      const currentId = Number(this.id);
      this.moreProducts = all.filter(pr => pr.id !== currentId).slice(0, 2);
      // Fallback if query params were missing: hydrate from dataset
      if (!this.name || !this.image) {
        const found = all.find(pr => pr.id === currentId);
        if (found) {
          this.name = found.name;
          this.image = found.image;
          this.rating = found.rating;
          this.price = found.price;
          this.description = found.description;
        }
      }
    }
  }

  back() {
    this.router.navigate(['/tabs/category', this.route.snapshot.queryParamMap.get('category') || '']);
  }

  dec() {
    if (this.qty() > 1) this.qty.set(this.qty() - 1);
  }

  inc() {
    this.qty.set(this.qty() + 1);
  }

  addToCart() {
    console.log('Agregar (diseño) — pendiente integrar con Firebase:', {
      id: this.id,
      name: this.name,
      qty: this.qty(),
      category: this.categoryId
    });
  }

  openOther(p: { id: number; name: string; image: string; storeIcon: string; rating: number; price: number; description: string }) {
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

  private getProductsForCategory(id: string) {
    const storeIcon = 'assets/icon/LocalDulces.jpg';
    const datasets: Record<string, Array<{ id: number; name: string; image: string; storeIcon: string; rating: number; price: number; description: string }>> = {
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
        { id: 3, name: 'Girasoles', image: 'assets/icon/Flores/Gerberas.jpg', storeIcon: storeIcon, rating: 4, price: 6.80, description: 'Girasoles brillantes y alegres.' }
      ],
      peluches: [
        { id: 1, name: 'Osos clásicos', image: 'assets/icon/Peluches/Osos.jpg', storeIcon: storeIcon, rating: 5, price: 4.99, description: 'Peluche de oso suave y tierno.' },
        { id: 2, name: 'Peluche de Stitch', image: 'assets/icon/Peluches/Stitch.jpeg', storeIcon: storeIcon, rating: 4, price: 6.50, description: 'Peluche de Stitch con gran detalle.' },
        { id: 3, name: 'Panda suave', image: 'assets/icon/Peluches/Panda.jpg', storeIcon: storeIcon, rating: 3, price: 5.25, description: 'Peluche de panda esponjoso.' }
      ]
    };
    return datasets[id] || [];
  }
}
