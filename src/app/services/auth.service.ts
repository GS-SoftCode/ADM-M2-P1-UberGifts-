import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword as firebaseUpdatePassword,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth) {
    // Monitorear cambios en el estado de autenticación
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  /**
   * Iniciar sesión con email y contraseña
   */
  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  /**
   * Registrar nuevo usuario
   */
  register(email: string, password: string, displayName?: string): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(async (result) => {
        if (displayName) {
          await updateProfile(result.user, { displayName });
        }
        return result;
      })
    );
  }

  /**
   * Cerrar sesión
   */
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Obtener email del usuario actual
   */
  getCurrentUserEmail(): string | null {
    return this.auth.currentUser?.email || null;
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => !!user)
    );
  }

  /**
   * Actualizar perfil de usuario
   */
  updateUserProfile(displayName: string, photoURL?: string): Observable<void> {
    if (this.auth.currentUser) {
      return from(updateProfile(this.auth.currentUser, { displayName, photoURL }));
    }
    throw new Error('No hay usuario autenticado');
  }

  /**
   * Cambiar contraseña
   */
  updatePassword(currentPassword: string, newPassword: string): Observable<void> {
    if (this.auth.currentUser) {
      return from(
        reauthenticateWithCredential(
          this.auth.currentUser,
          EmailAuthProvider.credential(this.auth.currentUser.email!, currentPassword)
        ).then(() => {
          return firebaseUpdatePassword(this.auth.currentUser!, newPassword);
        })
      );
    }
    throw new Error('No hay usuario autenticado');
  }

  /**
   * Enviar email de recuperación de contraseña
   */
  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  /**
   * Obtener ID token del usuario actual (para llamadas API)
   */
  async getIdToken(): Promise<string | null> {
    if (this.auth.currentUser) {
      return await this.auth.currentUser.getIdToken();
    }
    return null;
  }
}
