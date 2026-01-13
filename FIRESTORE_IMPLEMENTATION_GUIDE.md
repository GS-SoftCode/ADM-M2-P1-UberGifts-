# 📖 Guía Completa: Implementación de Firestore Database en UberGifts

**Proyecto:** UberGifts - Aplicación de E-commerce  
**Módulo:** Firestore Database  
**Fecha:** Enero 2026  
**Estado:** ✅ Implementado

---

## 📌 Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Firestore Database](#firestore-database)
3. [Colecciones y Datos](#colecciones-y-datos)
4. [Servicios Angular](#servicios-angular)
5. [Integración en Componentes](#integración-en-componentes)

---

## 🔐 Autenticación

### 1. Crear Proyecto en Firebase Console

**Pasos:**
1. Entramos a [Firebase Console](https://console.firebase.google.com)
2. Hacemos clic en **"Crear un proyecto"**
3. Le asignamos el nombre: **"ubergifts"** (o similar)
4. Aceptamos los términos y creamos el proyecto

**Resultado:** Se crea automáticamente un nuevo proyecto Firebase con ID único

---

### 2. Habilitar Métodos de Autenticación

**En Firebase Console:**
1. Navegamos a **"Authentication"** en el menú izquierdo
2. Hacemos clic en la pestaña **"Sign-in method"**
3. Habilitamos:
   - ✅ **Correo electrónico / Contraseña**
   - ✅ **Google** (opcional pero recomendado)

**Configuración de Email/Password:**
- Activamos el toggle
- Guardamos cambios
- Este método es suficiente para el login básico

**Configuración de Google Sign-In (Opcional):**
- Habilitamos Google
- Agregamos un email de soporte
- Guardamos

---

### 3. Instalar Dependencias Necesarias

**En la terminal del proyecto:**

```bash
# Instalar Firebase y AngularFire
npm install firebase @angular/fire

# Si deseas autenticación con Google en dispositivos nativos (opcional)
npm install @capacitor/google-login
npx cap add android
npx cap add ios
```

**Verificar instalación:**
```bash
npm list firebase @angular/fire
```

---

### 4. Configurar Firebase en el Proyecto

**Crear archivo: `src/environments/firebase.config.ts`**

```typescript
export const firebaseConfig = {
  apiKey: "AIzaSyATr1ARNTAvh0jgwabrD0kMiQLlRyKCYwA",
  authDomain: "ubergifts-90016.firebaseapp.com",
  projectId: "ubergifts-90016",
  storageBucket: "ubergifts-90016.appspot.com",
  messagingSenderId: "1021124985438",
  appId: "1:1021124985438:web:ff019f4fc84d2b95192acf"
};
```

**Obtener valores:**
1. Firebase Console → Proyecto → ⚙️ Configuración
2. Copiar las credenciales del proyecto
3. Pegarlas en firebase.config.ts

---

### 5. Inicializar Firebase en `src/main.ts`

**Actualizar main.ts:**

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from './environments/firebase.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    // ... otros providers
  ]
});
```

**Qué hace:**
- `provideFirebaseApp()` - Inicializa Firebase
- `provideAuth()` - Habilita autenticación
- `provideFirestore()` - Habilita Firestore Database

---

### 6. Crear Servicio de Autenticación

**Crear archivo: `src/app/services/auth.service.ts`**

```typescript
import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
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
    // Monitorear cambios en autenticación
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
   * Verificar si está autenticado
   */
  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => !!user)
    );
  }

  /**
   * Resetear contraseña
   */
  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }
}
```

**Métodos disponibles:**
- `login()` - Iniciar sesión
- `register()` - Crear cuenta
- `logout()` - Cerrar sesión
- `getCurrentUser()` - Usuario actual
- `isAuthenticated()` - Verificar autenticación

---

### 7. Usar AuthService en Componentes

**Ejemplo en `src/app/pages/login/login.component.ts`:**

```typescript
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password).subscribe(
      (result) => {
        console.log('✅ Login exitoso:', result.user.email);
        // Redirigir a página principal
      },
      (error) => {
        this.error = error.message;
        console.error('❌ Error en login:', error);
      }
    );
  }
}
```

**Ejemplo en `src/app/pages/register/register.component.ts`:**

```typescript
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  displayName: string = '';
  error: string = '';

  constructor(private authService: AuthService) {}

  register() {
    this.authService.register(this.email, this.password, this.displayName).subscribe(
      (result) => {
        console.log('✅ Registro exitoso:', result.user.email);
        // Redirigir a página principal
      },
      (error) => {
        this.error = error.message;
        console.error('❌ Error en registro:', error);
      }
    );
  }
}
```

---

## 🔥 Firestore Database

### 1. Crear Base de Datos en Firebase Console

**Pasos:**
1. En Firebase Console, navegamos a **"Firestore Database"** en el menú izquierdo
2. Hacemos clic en **"Create database"**
3. Seleccionamos **"Start in test mode"** (para desarrollo)
4. Elegimos una región geográfica: **us-central1** o la más cercana
5. Hacemos clic en **"Create"**

**Resultado:** Se crea una base de datos NoSQL completamente funcional

---

### 2. Configurar Reglas de Seguridad

**Para Desarrollo (Test Mode):**

En Firestore → pestaña **"Rules"**, copiamos:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Hacemos clic en **"Publish"**

**Para Producción:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Usuarios - cada uno ve solo su documento
    match /usuarios/{userId} {
      allow read, write: if isAuthenticated() && isOwner(userId);
    }
    
    // Productos - todos leen, solo admin escribe
    match /productos/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.token.admin == true;
    }
    
    // Órdenes - cada usuario ve sus propias órdenes
    match /ordenes/{ordenId} {
      allow read: if isAuthenticated() && 
                     (isOwner(resource.data.userId) || request.auth.token.admin == true);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      allow update: if isAuthenticated() && 
                       (isOwner(resource.data.userId) || request.auth.token.admin == true);
    }
  }
}
```

---

## 📦 Colecciones y Datos

### 1. Crear Colecciones Manualmente

**En Firebase Console → Firestore:**

1. Hacemos clic en **"Start collection"**
2. Asignamos nombres a las colecciones:
   - `usuarios` - Perfil de usuarios
   - `productos` - Catálogo de productos
   - `ordenes` - Historial de compras
   - `carritos` - Carrito de compra

---

### 2. Estructura de Colecciones

#### Colección: `usuarios`

```
usuarios/
├── {uid} (ID de usuario)
│   ├── uid: string
│   ├── email: string
│   ├── displayName: string
│   ├── telefono: string
│   ├── direccion: string
│   ├── ciudad: string
│   ├── rol: string ('cliente' | 'vendedor')
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

#### Colección: `productos`

```
productos/
├── {id}
│   ├── nombre: string
│   ├── precio: number
│   ├── descripcion: string
│   ├── categoria: string (Peluches, Chocolates, Dulces, Flores)
│   ├── imagen: string (URL)
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

#### Colección: `ordenes`

```
ordenes/
├── {id}
│   ├── userId: string (FK a usuarios)
│   ├── numeroOrden: string
│   ├── items: array
│   │   ├── productoId: string
│   │   ├── nombre: string
│   │   ├── precio: number
│   │   └── cantidad: number
│   ├── total: number
│   ├── estado: string ('pendiente'|'entregada'|'cancelada')
│   ├── direccionEntrega: string
│   ├── fechaOrden: timestamp
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

#### Colección: `carritos`

```
carritos/
├── {id}
│   ├── userId: string (FK a usuarios)
│   ├── items: array
│   │   ├── id: string
│   │   ├── name: string
│   │   ├── price: number
│   │   └── quantity: number
│   ├── subtotal: number
│   └── lastUpdated: timestamp
```

---

### 3. Agregar Datos Iniciales

**Crear archivo: `src/app/services/data-initializer.service.ts`**

```typescript
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
   * Inicializar base de datos con productos
   */
  initializeDatabase(): Observable<any> {
    const productos = this.getProductos();
    const observables = productos.map((producto) =>
      this.firestoreService.addDocument('productos', producto)
    );
    return forkJoin(observables);
  }

  /**
   * Verificar si DB ya tiene datos
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
   * Productos: Peluches, Chocolates, Dulces, Flores
   */
  private getProductos(): Producto[] {
    return [
      // PELUCHES
      {
        nombre: 'Osos Clásicos',
        precio: 25.99,
        descripcion: 'Peluche suave de oso clásico',
        categoria: 'Peluches'
      },
      {
        nombre: 'Peluche de Stitch',
        precio: 35.99,
        descripcion: 'Adorable peluche de Stitch de Disney',
        categoria: 'Peluches'
      },
      {
        nombre: 'Panda Suave',
        precio: 29.99,
        descripcion: 'Peluche de panda gigante y suave',
        categoria: 'Peluches'
      },
      // CHOCOLATES
      {
        nombre: 'Bombones Mixtos',
        precio: 22.99,
        descripcion: 'Variedad de bombones artesanales',
        categoria: 'Chocolates'
      },
      {
        nombre: 'Caja de Chocolates Premium',
        precio: 49.99,
        descripcion: 'Caja elegante con 20 chocolates premium',
        categoria: 'Chocolates'
      },
      {
        nombre: 'Trufas de Cacao',
        precio: 18.99,
        descripcion: 'Trufas artesanales deliciosas',
        categoria: 'Chocolates'
      },
      // DULCES
      {
        nombre: 'Suspiros',
        precio: 12.99,
        descripcion: 'Suspiros de merengue y chocolate',
        categoria: 'Dulces'
      },
      {
        nombre: 'Pristinos',
        precio: 14.99,
        descripcion: 'Galletas rellenas de dulce de leche',
        categoria: 'Dulces'
      },
      {
        nombre: 'Alfiladores',
        precio: 11.99,
        descripcion: 'Dulces tradicionales',
        categoria: 'Dulces'
      },
      // FLORES
      {
        nombre: 'Ramo Rosas',
        precio: 45.99,
        descripcion: 'Hermoso ramo de rosas rojas frescas',
        categoria: 'Flores'
      },
      {
        nombre: 'Tulipanes Mixtos',
        precio: 38.99,
        descripcion: 'Ramo colorido de tulipanes holandeses',
        categoria: 'Flores'
      },
      {
        nombre: 'Gerberas',
        precio: 32.99,
        descripcion: 'Ramo de gerberas multicolor',
        categoria: 'Flores'
      }
    ];
  }
}
```

---

## 🔧 Servicios Angular

### 1. FirestoreService - Base para Operaciones

**Crear archivo: `src/app/services/firestore.service.ts`**

```typescript
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
  onSnapshot
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  /**
   * Agregar documento
   */
  addDocument(collectionName: string, data: any): Observable<any> {
    const collectionRef = collection(this.firestore, collectionName);
    return from(addDoc(collectionRef, { ...data, createdAt: new Date() }));
  }

  /**
   * Obtener todos los documentos
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
   * Obtener un documento
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
   * Consulta con filtro
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
   * Escuchar cambios en tiempo real
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
   * Escuchar un documento
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
}
```

---

### 2. ProductoService - Gestión de Productos

**Crear archivo: `src/app/services/producto.service.ts`**

```typescript
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
   * Obtener un producto
   */
  obtenerProducto(id: string): Observable<Producto> {
    return this.firestoreService.getDocument(this.collectionName, id);
  }

  /**
   * Crear producto
   */
  crearProducto(producto: Producto): Observable<any> {
    return this.firestoreService.addDocument(this.collectionName, producto);
  }

  /**
   * Actualizar producto
   */
  actualizarProducto(id: string, producto: Partial<Producto>): Observable<void> {
    return this.firestoreService.updateDocument(this.collectionName, id, producto);
  }

  /**
   * Escuchar cambios en tiempo real
   */
  escucharProductos(): Observable<Producto[]> {
    return this.firestoreService.listenToCollection(this.collectionName);
  }

  /**
   * Escuchar un producto
   */
  escucharProducto(id: string): Observable<Producto | null> {
    return this.firestoreService.listenToDocument(this.collectionName, id);
  }
}
```

---

### 3. UsuarioService - Gestión de Perfil

**Crear archivo: `src/app/services/usuario.service.ts`**

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';

export interface Usuario {
  uid: string;
  email: string;
  displayName?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  rol?: 'cliente' | 'vendedor';
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private collectionName = 'usuarios';

  constructor(private firestoreService: FirestoreService) {}

  /**
   * Crear usuario
   */
  crearUsuario(usuario: Usuario): Observable<any> {
    return this.firestoreService.addDocument(this.collectionName, usuario);
  }

  /**
   * Obtener usuario por UID
   */
  obtenerUsuario(uid: string): Observable<Usuario | null> {
    return this.firestoreService.getDocument(this.collectionName, uid);
  }

  /**
   * Actualizar usuario
   */
  actualizarUsuario(uid: string, usuario: Partial<Usuario>): Observable<void> {
    return this.firestoreService.updateDocument(this.collectionName, uid, usuario);
  }

  /**
   * Escuchar cambios del usuario
   */
  escucharUsuario(uid: string): Observable<Usuario | null> {
    return this.firestoreService.listenToDocument(this.collectionName, uid);
  }
}
```

---

### 4. OrdenService - Gestión de Órdenes

**Crear archivo: `src/app/services/orden.service.ts`**

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';

export interface Orden {
  id?: string;
  userId: string;
  numeroOrden: string;
  items: any[];
  total: number;
  estado: 'pendiente' | 'entregada' | 'cancelada';
  direccionEntrega: string;
  fechaOrden: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private collectionName = 'ordenes';

  constructor(private firestoreService: FirestoreService) {}

  /**
   * Crear orden
   */
  crearOrden(orden: Orden): Observable<any> {
    return this.firestoreService.addDocument(this.collectionName, orden);
  }

  /**
   * Obtener órdenes del usuario
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
   * Obtener una orden
   */
  obtenerOrden(id: string): Observable<Orden | null> {
    return this.firestoreService.getDocument(this.collectionName, id);
  }

  /**
   * Actualizar estado
   */
  actualizarEstado(id: string, estado: string): Observable<void> {
    return this.firestoreService.updateDocument(this.collectionName, id, { estado });
  }

  /**
   * Escuchar orden en tiempo real
   */
  escucharOrden(id: string): Observable<Orden | null> {
    return this.firestoreService.listenToDocument(this.collectionName, id);
  }
}
```

---

## 🎨 Integración en Componentes

### 1. Página Principal - Mostrar Productos

**`src/app/pages/home/home.component.ts`:**

```typescript
import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  productos: Producto[] = [];
  loading = true;

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe(
      (data) => {
        this.productos = data;
        this.loading = false;
        console.log('✅ Productos cargados:', this.productos.length);
      },
      (error) => {
        console.error('❌ Error cargando productos:', error);
        this.loading = false;
      }
    );
  }

  filtrarPorCategoria(categoria: string) {
    this.productoService.obtenerProductosPorCategoria(categoria).subscribe(
      (data) => {
        this.productos = data;
      }
    );
  }
}
```

---

### 2. Página de Carrito - Guardar Orden

**`src/app/pages/checkout/checkout.component.ts`:**

```typescript
import { Component } from '@angular/core';
import { OrdenService } from '../../services/orden.service';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  direccion: string = '';
  loading = false;

  constructor(
    private ordenService: OrdenService,
    private authService: AuthService,
    private carritoService: CarritoService
  ) {}

  completarCompra() {
    const usuario = this.authService.getCurrentUser();
    const items = this.carritoService.getCart();
    const total = this.carritoService.getCartTotal();

    if (!usuario || items.length === 0) {
      console.error('❌ Usuario o carrito vacío');
      return;
    }

    this.loading = true;

    const orden = {
      userId: usuario.uid,
      numeroOrden: `ORD-${Date.now()}`,
      items: items,
      total: total,
      estado: 'pendiente',
      direccionEntrega: this.direccion,
      fechaOrden: new Date()
    };

    this.ordenService.crearOrden(orden).subscribe(
      (result) => {
        console.log('✅ Orden creada:', result.id);
        this.carritoService.clearCart();
        this.loading = false;
        // Redirigir a confirmación
      },
      (error) => {
        console.error('❌ Error creando orden:', error);
        this.loading = false;
      }
    );
  }
}
```

---

### 3. Página de Mis Órdenes - Seguimiento

**`src/app/pages/mis-ordenes/mis-ordenes.component.ts`:**

```typescript
import { Component, OnInit } from '@angular/core';
import { OrdenService, Orden } from '../../services/orden.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mis-ordenes',
  templateUrl: './mis-ordenes.component.html'
})
export class MisOrdenesComponent implements OnInit {
  ordenes: Orden[] = [];
  loading = true;

  constructor(
    private ordenService: OrdenService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.ordenService.obtenerOrdenesPorUsuario(usuario.uid).subscribe(
      (data) => {
        this.ordenes = data;
        this.loading = false;
        console.log('✅ Órdenes cargadas:', this.ordenes.length);
      },
      (error) => {
        console.error('❌ Error cargando órdenes:', error);
        this.loading = false;
      }
    );
  }

  escucharOrden(ordenId: string) {
    this.ordenService.escucharOrden(ordenId).subscribe(
      (orden) => {
        console.log('📦 Orden actualizada:', orden);
        // Actualizar UI
      }
    );
  }
}
```

---

### 4. Componente de Perfil

**`src/app/pages/perfil/perfil.component.ts`:**

```typescript
import { Component, OnInit } from '@angular/core';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  loading = true;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const authUser = this.authService.getCurrentUser();
    if (authUser) {
      this.usuarioService.obtenerUsuario(authUser.uid).subscribe(
        (usuario) => {
          this.usuario = usuario;
          this.loading = false;
        }
      );
    }
  }

  actualizarPerfil(nombre: string, telefono: string, direccion: string) {
    const authUser = this.authService.getCurrentUser();
    if (!authUser) return;

    const datosActualizados: Partial<Usuario> = {
      displayName: nombre,
      telefono,
      direccion,
      updatedAt: new Date()
    };

    this.usuarioService.actualizarUsuario(authUser.uid, datosActualizados).subscribe(
      () => {
        console.log('✅ Perfil actualizado');
      }
    );
  }
}
```

---

## ✅ Resumen

### Pasos Completados:

1. ✅ **Crear proyecto Firebase** - Se creó proyecto "ubergifts-90016"
2. ✅ **Habilitar autenticación** - Email/Password y Google
3. ✅ **Instalar dependencias** - firebase y @angular/fire
4. ✅ **Configurar Firebase** - firebase.config.ts y main.ts
5. ✅ **Crear Firestore Database** - Base de datos creada
6. ✅ **Configurar reglas de seguridad** - Para desarrollo y producción
7. ✅ **Crear servicios** - FirestoreService, AuthService, ProductoService, etc.
8. ✅ **Integrar en componentes** - Home, Checkout, Mis Órdenes, Perfil

### Colecciones Disponibles:

- **usuarios** - Perfil de usuarios
- **productos** - Catálogo (Peluches, Chocolates, Dulces, Flores)
- **ordenes** - Historial de compras
- **carritos** - Carrito de compra

### Funcionalidades:

✅ Login/Registro  
✅ Ver productos por categoría  
✅ Crear órdenes  
✅ Ver mis órdenes  
✅ Actualizar perfil  
✅ Sincronización en tiempo real  

---

**¡Firestore está completamente implementado en UberGifts!** 🎉
