import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  Query,
  DocumentSnapshot,
  onSnapshot,
  Unsubscribe
} from '@angular/fire/firestore';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  /**
   * Agregar documento a una colección
   */
  addDocument(collectionName: string, data: any): Observable<any> {
    const collectionRef = collection(this.firestore, collectionName);
    return from(addDoc(collectionRef, { ...data, createdAt: new Date() }));
  }

  /**
   * Actualizar documento
   */
  updateDocument(collectionName: string, docId: string, data: any): Observable<void> {
    const docRef = doc(this.firestore, collectionName, docId);
    return from(updateDoc(docRef, { ...data, updatedAt: new Date() }));
  }

  /**
   * Eliminar documento
   */
  deleteDocument(collectionName: string, docId: string): Observable<void> {
    const docRef = doc(this.firestore, collectionName, docId);
    return from(deleteDoc(docRef));
  }

  /**
   * Obtener documento por ID
   */
  getDocument(collectionName: string, docId: string): Observable<any> {
    const docRef = doc(this.firestore, collectionName, docId);
    return from(getDoc(docRef)).pipe(
      map((snapshot) => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() };
        }
        return null;
      })
    );
  }

  /**
   * Obtener todos los documentos de una colección
   */
  getCollection(collectionName: string): Observable<any[]> {
    const collectionRef = collection(this.firestore, collectionName);
    return from(getDocs(collectionRef)).pipe(
      map((snapshot) => {
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
      })
    );
  }

  /**
   * Obtener documentos con filtro
   */
  getDocumentsWhere(
    collectionName: string,
    field: string,
    operator: any,
    value: any
  ): Observable<any[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, where(field, operator, value));
    return from(getDocs(q)).pipe(
      map((snapshot) => {
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
      })
    );
  }

  /**
   * Escuchar cambios en tiempo real de una colección
   */
  listenToCollection(collectionName: string): Observable<any[]> {
    return new Observable((observer) => {
      const collectionRef = collection(this.firestore, collectionName);
      const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        observer.next(data);
      });

      return () => unsubscribe();
    });
  }

  /**
   * Escuchar cambios en tiempo real de un documento específico
   */
  listenToDocument(collectionName: string, docId: string): Observable<any> {
    return new Observable((observer) => {
      const docRef = doc(this.firestore, collectionName, docId);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          observer.next({ id: snapshot.id, ...snapshot.data() });
        } else {
          observer.next(null);
        }
      });

      return () => unsubscribe();
    });
  }

  /**
   * Realizar consulta personalizada
   */
  queryDocuments(collectionName: string, conditions: Array<[string, any, any]>): Observable<any[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const q = query(
      collectionRef,
      ...conditions.map(([field, operator, value]) => where(field, operator, value))
    );
    return from(getDocs(q)).pipe(
      map((snapshot) => {
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
      })
    );
  }
}
