import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private collectionName = 'usuarios';

  constructor(private firestoreService: FirestoreService) {}

  /**
   * Crear un nuevo usuario en Firestore
   */
  crearUsuario(usuario: Usuario): Observable<any> {
    return this.firestoreService.addDocument(this.collectionName, usuario);
  }

  /**
   * Obtener datos del usuario actual por su UID
   */
  obtenerUsuario(uid: string): Observable<Usuario | null> {
    return this.firestoreService.getDocument(this.collectionName, uid);
  }

  /**
   * Actualizar datos del usuario
   */
  actualizarUsuario(uid: string, usuario: Partial<Usuario>): Observable<void> {
    return this.firestoreService.updateDocument(this.collectionName, uid, usuario);
  }

  /**
   * Actualizar el perfil del usuario (nombre, foto)
   */
  actualizarPerfil(uid: string, displayName: string, fotoPerfil?: string): Observable<void> {
    const actualizacion: Partial<Usuario> = {
      displayName,
      updatedAt: new Date()
    };
    
    if (fotoPerfil) {
      actualizacion.fotoPerfil = fotoPerfil;
    }

    return this.firestoreService.updateDocument(this.collectionName, uid, actualizacion);
  }

  /**
   * Actualizar la dirección del usuario
   */
  actualizarDireccion(
    uid: string,
    direccion: string,
    ciudad?: string,
    codigoPostal?: string,
    pais?: string
  ): Observable<void> {
    const actualizacion: Partial<Usuario> = {
      direccion,
      ciudad,
      codigoPostal,
      pais,
      updatedAt: new Date()
    };

    return this.firestoreService.updateDocument(this.collectionName, uid, actualizacion);
  }

  /**
   * Obtener todos los usuarios
   */
  obtenerTodosUsuarios(): Observable<Usuario[]> {
    return this.firestoreService.getCollection(this.collectionName);
  }

  /**
   * Escuchar cambios en tiempo real de un usuario
   */
  escucharUsuario(uid: string): Observable<Usuario | null> {
    return this.firestoreService.listenToDocument(this.collectionName, uid);
  }

  /**
   * Eliminar usuario (cuenta)
   */
  eliminarUsuario(uid: string): Observable<void> {
    return this.firestoreService.deleteDocument(this.collectionName, uid);
  }

  /**
   * Verificar si el usuario existe en Firestore
   */
  usuarioExiste(uid: string): Observable<boolean> {
    return new Observable((observer) => {
      this.firestoreService.getDocument(this.collectionName, uid).subscribe((usuario) => {
        observer.next(usuario !== null);
        observer.complete();
      });
    });
  }
}
