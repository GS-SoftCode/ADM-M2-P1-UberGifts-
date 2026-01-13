import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { Producto } from './producto.service';

@Injectable({
  providedIn: 'root'
})
export class DataInitializerService {
  constructor(private firestoreService: FirestoreService) {}

  /**
   * Inicializar la base de datos con productos de ejemplo
   * Ejecutar esta función una sola vez al instalar la aplicación
   */
  initializeDatabase(): Observable<any> {
    const productosEjemplo = this.getProductosEjemplo();
    const observables = productosEjemplo.map((producto) =>
      this.firestoreService.addDocument('productos', producto)
    );

    return forkJoin(observables);
  }

  /**
   * Obtener productos de ejemplo para Firestore
   * Categorías: Peluches, Chocolates, Dulces, Flores
   */
  private getProductosEjemplo(): Producto[] {
    return [
      // PELUCHES
      {
        nombre: 'Osos Clásicos',
        precio: 25.99,
        descripcion: 'Peluche suave de oso clásico, perfecto para regalar',
        categoria: 'Peluches',
        imagen: 'https://via.placeholder.com/300?text=Osos'
      },
      {
        nombre: 'Peluche de Stitch',
        precio: 35.99,
        descripcion: 'Peluche de Stitch de Disney, suave y abrazable',
        categoria: 'Peluches',
        imagen: 'https://via.placeholder.com/300?text=Stitch'
      },
      {
        nombre: 'Panda Suave',
        precio: 29.99,
        descripcion: 'Adorable peluche de panda gigante',
        categoria: 'Peluches',
        imagen: 'https://via.placeholder.com/300?text=Panda'
      },

      // CHOCOLATES
      {
        nombre: 'Bombones Mixtos',
        precio: 22.99,
        descripcion: 'Variedad de bombones artesanales de chocolate',
        categoria: 'Chocolates',
        imagen: 'https://via.placeholder.com/300?text=Bombones'
      },
      {
        nombre: 'Caja de Chocolates Premium',
        precio: 49.99,
        descripcion: 'Caja elegante con 20 chocolates premium',
        categoria: 'Chocolates',
        imagen: 'https://via.placeholder.com/300?text=CajaChocolates'
      },
      {
        nombre: 'Trufas de Cacao',
        precio: 18.99,
        descripcion: 'Trufas de cacao artesanales, deliciosas y frescas',
        categoria: 'Chocolates',
        imagen: 'https://via.placeholder.com/300?text=Trufas'
      },

      // DULCES
      {
        nombre: 'Suspiros',
        precio: 12.99,
        descripcion: 'Suspiros caseros de merenguey chocolate',
        categoria: 'Dulces',
        imagen: 'https://via.placeholder.com/300?text=Suspiros'
      },
      {
        nombre: 'Pristinos',
        precio: 14.99,
        descripcion: 'Galletas pristinas rellenas de dulce de leche',
        categoria: 'Dulces',
        imagen: 'https://via.placeholder.com/300?text=Pristinos'
      },
      {
        nombre: 'Alfiladores',
        precio: 11.99,
        descripcion: 'Dulces tradicionales de almíbar y azúcar',
        categoria: 'Dulces',
        imagen: 'https://via.placeholder.com/300?text=Alfiladores'
      },

      // FLORES
      {
        nombre: 'Ramo Rosas',
        precio: 45.99,
        descripcion: 'Hermoso ramo de rosas rojas frescas',
        categoria: 'Flores',
        imagen: 'https://via.placeholder.com/300?text=RamoRosas'
      },
      {
        nombre: 'Tulipanes Mixtos',
        precio: 38.99,
        descripcion: 'Ramo colorido de tulipanes holandeses',
        categoria: 'Flores',
        imagen: 'https://via.placeholder.com/300?text=Tulipanes'
      },
      {
        nombre: 'Gerberas',
        precio: 32.99,
        descripcion: 'Ramo de gerberas multicolor, alegres y vistosas',
        categoria: 'Flores',
        imagen: 'https://via.placeholder.com/300?text=Gerberas'
      }
    ];
  }

  /**
   * Verificar si la base de datos ya tiene productos
   */
  checkIfDatabaseInitialized(): Observable<boolean> {
    return new Observable((observer) => {
      this.firestoreService.getCollection('productos').subscribe((productos) => {
        observer.next(productos.length > 0);
        observer.complete();
      });
    });
  }

  /**
   * Limpiar todos los productos de la base de datos (para resetear)
   */
  clearDatabase(): Observable<any> {
    return new Observable((observer) => {
      this.firestoreService.getCollection('productos').subscribe((productos) => {
        const observables = productos.map((producto: any) =>
          this.firestoreService.deleteDocument('productos', producto.id)
        );

        if (observables.length === 0) {
          observer.next(null);
          observer.complete();
          return;
        }

        forkJoin(observables).subscribe(
          (result) => {
            observer.next(result);
            observer.complete();
          },
          (error) => observer.error(error)
        );
      });
    });
  }
}
