import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';

export interface Producto {
  id?: string;
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: string;
  imagen?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private collectionName = 'productos';

  constructor(private firestoreService: FirestoreService) {}

  /**
   * Crear un nuevo producto
   */
  crearProducto(producto: Producto): Observable<any> {
    return this.firestoreService.addDocument(this.collectionName, producto);
  }

  /**
   * Obtener todos los productos
   */
  obtenerProductos(): Observable<Producto[]> {
    return this.firestoreService.getCollection(this.collectionName);
  }

  /**
   * Obtener productos por categoría
   */
  obtenerProductosPorCategoria(categoria: string): Observable<Producto[]> {
    return this.firestoreService.getDocumentsWhere(
      this.collectionName,
      'categoria',
      '==',
      categoria
    );
  }

  /**
   * Obtener un producto específico
   */
  obtenerProducto(id: string): Observable<Producto> {
    return this.firestoreService.getDocument(this.collectionName, id);
  }

  /**
   * Actualizar producto
   */
  actualizarProducto(id: string, producto: Partial<Producto>): Observable<void> {
    return this.firestoreService.updateDocument(this.collectionName, id, producto);
  }

  /**
   * Eliminar producto
   */
  eliminarProducto(id: string): Observable<void> {
    return this.firestoreService.deleteDocument(this.collectionName, id);
  }

  /**
   * Escuchar cambios de productos en tiempo real
   */
  escucharProductos(): Observable<Producto[]> {
    return this.firestoreService.listenToCollection(this.collectionName);
  }

  /**
   * Escuchar cambios de un producto específico
   */
  escucharProducto(id: string): Observable<Producto | null> {
    return this.firestoreService.listenToDocument(this.collectionName, id);
  }

  /**
   * Buscar productos por nombre
   */
  buscarProductos(nombre: string): Observable<Producto[]> {
    // Nota: Para búsqueda full-text más avanzada, considera usar Algolia o similar
    return this.firestoreService.queryDocuments(this.collectionName, [
      ['nombre', '>=', nombre],
      ['nombre', '<=', nombre + '\uf8ff']
    ]);
  }
}
