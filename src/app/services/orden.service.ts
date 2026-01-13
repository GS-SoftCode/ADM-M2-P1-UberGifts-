import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { Orden, OrdenItem } from '../models/orden.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private collectionName = 'ordenes';

  constructor(private firestoreService: FirestoreService) {}

  /**
   * Crear una nueva orden en Firestore
   */
  crearOrden(orden: Orden): Observable<any> {
    return this.firestoreService.addDocument(this.collectionName, orden);
  }

  /**
   * Obtener una orden específica por ID
   */
  obtenerOrden(ordenId: string): Observable<Orden | null> {
    return this.firestoreService.getDocument(this.collectionName, ordenId);
  }

  /**
   * Obtener todas las órdenes de un usuario
   */
  obtenerOrdenesPorUsuario(userId: string): Observable<Orden[]> {
    return this.firestoreService.getDocumentsWhere(
      this.collectionName,
      'userId',
      '==',
      userId
    );
  }

  /**
   * Obtener órdenes activas (en preparación o en camino)
   */
  obtenerOrdenesActivas(userId: string): Observable<Orden[]> {
    return new Observable((observer) => {
      this.firestoreService.getDocumentsWhere(
        this.collectionName,
        'userId',
        '==',
        userId
      ).subscribe((ordenes) => {
        const activas = ordenes.filter((orden: Orden) =>
          ['pendiente', 'confirmada', 'preparando', 'en_camino'].includes(orden.estado)
        );
        observer.next(activas);
        observer.complete();
      });
    });
  }

  /**
   * Obtener órdenes completadas
   */
  obtenerOrdenesCompletadas(userId: string): Observable<Orden[]> {
    return new Observable((observer) => {
      this.firestoreService.getDocumentsWhere(
        this.collectionName,
        'userId',
        '==',
        userId
      ).subscribe((ordenes) => {
        const completadas = ordenes.filter((orden: Orden) =>
          ['entregada', 'cancelada'].includes(orden.estado)
        );
        observer.next(completadas);
        observer.complete();
      });
    });
  }

  /**
   * Actualizar el estado de una orden
   */
  actualizarEstadoOrden(ordenId: string, nuevoEstado: string): Observable<void> {
    return this.firestoreService.updateDocument(this.collectionName, ordenId, {
      estado: nuevoEstado,
      updatedAt: new Date()
    });
  }

  /**
   * Actualizar tiempo restante de entrega
   */
  actualizarTiempoRestante(ordenId: string, tiempoRestante: number): Observable<void> {
    return this.firestoreService.updateDocument(this.collectionName, ordenId, {
      tiempoRestante,
      updatedAt: new Date()
    });
  }

  /**
   * Marcar orden como entregada
   */
  marcarComoEntregada(ordenId: string): Observable<void> {
    return this.firestoreService.updateDocument(this.collectionName, ordenId, {
      estado: 'entregada',
      fechaEntregaReal: new Date(),
      updatedAt: new Date()
    });
  }

  /**
   * Cancelar una orden
   */
  cancelarOrden(ordenId: string, motivo?: string): Observable<void> {
    return this.firestoreService.updateDocument(this.collectionName, ordenId, {
      estado: 'cancelada',
      motivoCancelacion: motivo,
      updatedAt: new Date()
    });
  }

  /**
   * Actualizar ubicación de la orden (para seguimiento)
   */
  actualizarUbicacion(
    ordenId: string,
    latitud: number,
    longitud: number
  ): Observable<void> {
    return this.firestoreService.updateDocument(this.collectionName, ordenId, {
      ubicacionActual: {
        latitud,
        longitud,
        actualizado: new Date()
      },
      updatedAt: new Date()
    });
  }

  /**
   * Escuchar cambios en tiempo real de una orden
   */
  escucharOrden(ordenId: string): Observable<Orden | null> {
    return this.firestoreService.listenToDocument(this.collectionName, ordenId);
  }

  /**
   * Obtener todas las órdenes (admin)
   */
  obtenerTodasLasOrdenes(): Observable<Orden[]> {
    return this.firestoreService.getCollection(this.collectionName);
  }

  /**
   * Eliminar una orden
   */
  eliminarOrden(ordenId: string): Observable<void> {
    return this.firestoreService.deleteDocument(this.collectionName, ordenId);
  }

  /**
   * Obtener órdenes por estado
   */
  obtenerOrdenesPorEstado(estado: string): Observable<Orden[]> {
    return this.firestoreService.getDocumentsWhere(
      this.collectionName,
      'estado',
      '==',
      estado
    );
  }
}
