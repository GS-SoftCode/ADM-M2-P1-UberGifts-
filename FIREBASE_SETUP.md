# Guía de Configuración de Firebase para UberGifts

## 📋 Pasos para configurar Firebase

### 1. Crear Proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en "Crear proyecto" o "Agregar proyecto"
3. Ingresa un nombre para el proyecto (ej: "UberGifts")
4. Acepta los términos y crea el proyecto

### 2. Registrar una Aplicación Web

1. En la página principal del proyecto, haz clic en el ícono web (</>) para registrar una nueva aplicación
2. Dale un nombre a la aplicación (ej: "UberGifts Web")
3. No necesitas marcar "Firebase Hosting"
4. Haz clic en "Registrar aplicación"
5. **COPIA la configuración que aparece**

### 3. Actualizar el archivo de configuración

1. Abre `src/environments/firebase.config.ts`
2. Reemplaza los valores con los que copiaste de Firebase Console:

```typescript
export const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### 4. Habilitar Autenticación

1. En Firebase Console, ve a **Autenticación** (en el menú izquierdo)
2. Haz clic en "Comenzar"
3. Habilita el proveedor **"Correo electrónico/Contraseña"**
4. Guarda los cambios

### 5. Habilitar Firestore Database

1. En Firebase Console, ve a **Firestore Database** (en el menú izquierdo)
2. Haz clic en "Crear base de datos"
3. Selecciona la ubicación geográfica más cercana
4. Para desarrollo inicial, selecciona **"Modo prueba"** (luego cambiaremos las reglas)
5. Crea la base de datos

### 6. Configurar Reglas de Seguridad (Firestore)

Para desarrollo, en la sección **Firestore Database**, ve a la pestaña **Reglas** y reemplaza el contenido con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura si está autenticado
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 7. Habilitar Storage (Opcional, para fotos de productos)

1. Ve a **Storage** en el menú izquierdo
2. Haz clic en "Comenzar"
3. Selecciona la misma región que Firestore
4. Usa las reglas por defecto (modo prueba)

## 🔧 Servicios Disponibles

### AuthService (`src/app/services/auth.service.ts`)

Métodos disponibles:
- `login(email: string, password: string)` - Iniciar sesión
- `register(email: string, password: string, displayName?: string)` - Registrar nuevo usuario
- `logout()` - Cerrar sesión
- `getCurrentUser()` - Obtener usuario actual
- `getCurrentUserEmail()` - Obtener email del usuario
- `isAuthenticated()` - Verificar si está autenticado
- `updateUserProfile(displayName, photoURL?)` - Actualizar perfil
- `updatePassword(currentPassword, newPassword)` - Cambiar contraseña
- `resetPassword(email)` - Enviar email de recuperación
- `getIdToken()` - Obtener token para APIs

### FirestoreService (`src/app/services/firestore.service.ts`)

Métodos disponibles:
- `addDocument(collectionName, data)` - Agregar documento
- `updateDocument(collectionName, docId, data)` - Actualizar documento
- `deleteDocument(collectionName, docId)` - Eliminar documento
- `getDocument(collectionName, docId)` - Obtener un documento
- `getCollection(collectionName)` - Obtener todos los documentos de una colección
- `getDocumentsWhere(collectionName, field, operator, value)` - Obtener documentos con filtro
- `listenToCollection(collectionName)` - Escuchar cambios en tiempo real (colección)
- `listenToDocument(collectionName, docId)` - Escuchar cambios en tiempo real (documento)
- `queryDocuments(collectionName, conditions)` - Realizar consulta personalizada

## 📝 Ejemplo de Uso

### Login
```typescript
constructor(private authService: AuthService) {}

entrar() {
  this.authService.login(this.email, this.password).subscribe({
    next: (response) => {
      console.log('Login exitoso');
      // Navegar a otra página
    },
    error: (error) => {
      console.log('Error:', error.message);
    }
  });
}
```

### Guardar Producto en Firestore
```typescript
constructor(private firestoreService: FirestoreService) {}

guardarProducto() {
  const producto = {
    nombre: 'Rosas',
    precio: 25000,
    descripcion: 'Ramo de rosas rojas'
  };
  
  this.firestoreService.addDocument('productos', producto).subscribe({
    next: (docRef) => {
      console.log('Producto guardado con ID:', docRef.id);
    },
    error: (error) => {
      console.log('Error:', error);
    }
  });
}
```

### Obtener Productos en Tiempo Real
```typescript
constructor(private firestoreService: FirestoreService) {}

ngOnInit() {
  this.firestoreService.listenToCollection('productos').subscribe({
    next: (productos) => {
      console.log('Productos:', productos);
      this.productos = productos;
    }
  });
}
```

## 🚨 Estructura de Firestore (Recomendada)

```
firestore/
├── usuarios/
│   └── {uid}/
│       ├── nombre: string
│       ├── email: string
│       ├── telefono: string
│       └── createdAt: timestamp
│
├── productos/
│   └── {productId}/
│       ├── nombre: string
│       ├── precio: number
│       ├── descripcion: string
│       ├── categoria: string
│       ├── imagen: string (URL)
│       └── createdAt: timestamp
│
├── pedidos/
│   └── {orderId}/
│       ├── usuario_id: string (referencia a usuarios)
│       ├── productos: array
│       ├── total: number
│       ├── estado: string
│       └── createdAt: timestamp
│
└── categorias/
    └── {categoryId}/
        ├── nombre: string
        └── icono: string
```

## 🔐 Variables de Entorno (Seguridad)

Para producción, es recomendable usar variables de entorno en lugar de hardcodear las credenciales. Crea un archivo `.env`:

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

Luego carga desde `firebase.config.ts`:

```typescript
export const firebaseConfig = {
  apiKey: process.env['FIREBASE_API_KEY'],
  authDomain: process.env['FIREBASE_AUTH_DOMAIN'],
  // ... etc
};
```

## 🆘 Solución de Problemas

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
- Esto generalmente significa que Firebase no está configurado correctamente
- Verifica que el `authDomain` sea exacto (incluye .firebaseapp.com)

### Error: "auth/invalid-api-key"
- Verifica que el `apiKey` sea correcto
- Asegúrate de que la aplicación web está registrada en Firebase Console

### Los datos no se guardan en Firestore
- Verifica que Firestore esté habilitado
- Revisa las reglas de seguridad de Firestore
- En desarrollo, usa modo prueba para permitir lectura/escritura

## 📚 Recursos Adicionales

- [Documentación oficial de Firebase](https://firebase.google.com/docs)
- [Angular Fire Documentation](https://github.com/angular/angularfire)
- [Firestore Rules Reference](https://firebase.google.com/docs/firestore/security/get-started)

---

¡Firebase está listo para usar! Ahora puedes enfocarte en desarrollar la lógica de tu aplicación. 🚀
