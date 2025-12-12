# ✅ Firebase Configuración - Checklist Completado

## 🎯 Configuración de Credenciales - ✅ COMPLETADO

Tu proyecto está conectado con las siguientes credenciales:

```
Proyecto Firebase: ubergifts-90016
API Key: AIzaSyATr1ARNTAvh0jgwabrD0kMiQLlRyKCYwA
Auth Domain: ubergifts-90016.firebaseapp.com
Project ID: ubergifts-90016
Storage Bucket: ubergifts-90016.appspot.com
Messaging Sender ID: 1021124985438
App ID: 1:1021124985438:web:ff019f4fc84d2b95192acf
```

**Archivos Actualizados:**
- ✅ `src/environments/firebase.config.ts` - Configuración con credenciales reales
- ✅ `src/main.ts` - Providers de Firebase configurados

---

## 🔐 Próximos Pasos en Firebase Console

### ✅ PASO 1: Habilitar Autenticación por Email/Contraseña

**En Firebase Console (https://console.firebase.google.com):**

1. Selecciona el proyecto **"ubergifts-90016"**
2. En el menú izquierdo, ve a **"Authentication"**
3. Haz clic en la pestaña **"Sign-in method"**
4. Haz clic en **"Email/Password"**
5. Activa el toggle de **"Email/Password"**
6. Si pide segundo factor, desactívalo por ahora (opcional)
7. Haz clic en **"Save"**

✅ **Resultado:** Los usuarios pueden registrarse e iniciar sesión con email y contraseña

---

### ✅ PASO 2: Crear la Base de Datos Firestore

**En Firebase Console:**

1. En el menú izquierdo, ve a **"Firestore Database"**
2. Haz clic en **"Create database"**
3. Selecciona **"Start in test mode"** (para desarrollo)
4. Haz clic en **"Next"**
5. Selecciona una región cercana (recomendado: `us-central1` o tu región más cercana)
6. Haz clic en **"Create"**

⏳ Espera 1-2 minutos a que se cree la base de datos.

✅ **Resultado:** Tendrás una base de datos Firestore lista para almacenar datos

---

### ✅ PASO 3: Configurar Reglas de Seguridad de Firestore

**En Firebase Console:**

1. En **"Firestore Database"**, ve a la pestaña **"Rules"**
2. Reemplaza el contenido actual con estas reglas de desarrollo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura si está autenticado
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Permitir a usuarios actualizar solo su propio documento
    match /usuarios/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

3. Haz clic en **"Publish"**

✅ **Resultado:** Solo usuarios autenticados pueden acceder a la base de datos

---

### 📦 PASO 4 (Opcional): Habilitar Cloud Storage

Si necesitas subir imágenes de productos:

1. En el menú izquierdo, ve a **"Storage"**
2. Haz clic en **"Get Started"**
3. Lee el mensaje y haz clic en **"Next"**
4. Selecciona **"Start in test mode"**
5. Selecciona la misma región que Firestore
6. Haz clic en **"Done"**

📸 **Luego actualiza las reglas de Storage:**

Ve a **Storage > Rules** y usa:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🧪 Prueba Tu Configuración

### 1. **Registra un Usuario de Prueba**

En Firebase Console → **Authentication**:

1. Ve a la pestaña **"Users"**
2. Haz clic en **"Create user"**
3. Ingresa:
   - Email: `test@example.com`
   - Contraseña: `123456789`
4. Haz clic en **"Create user"**

### 2. **Prueba el Login en tu App**

1. Ejecuta `npm start` en tu terminal
2. Abre `http://localhost:4200` en el navegador
3. Usa las credenciales del usuario de prueba:
   - Email: `test@example.com`
   - Contraseña: `123456789`
4. Deberías ver el mensaje de bienvenida y navegar a `/tabs`

✅ **Si funciona:** ¡Firebase Authentication está configurado correctamente!

---

## 📊 Crear Estructura de Colecciones en Firestore

Ahora crea la estructura de base de datos. Ve a **Firestore Database > Data**:

### 1. **Crear Colección "usuarios"**

1. Haz clic en **"+ Create collection"**
2. Escribe: `usuarios`
3. Haz clic en **"Next"**
4. Haz clic en **"Auto ID"** para crear un documento de prueba
5. Agrega estos campos:
   ```
   nombre: "Usuario Prueba"
   email: "test@example.com"
   telefono: "+56912345678"
   createdAt: (timestamp - actual)
   ```
6. Guarda

### 2. **Crear Colección "productos"**

1. Haz clic en **"+ Create collection"**
2. Escribe: `productos`
3. Haz clic en **"Next"**
4. Haz clic en **"Auto ID"**
5. Agrega campos de ejemplo:
   ```
   nombre: "Ramo de Rosas"
   precio: 25000
   descripcion: "Hermoso ramo de rosas rojas"
   categoria: "Flores"
   imagen: "url-de-imagen"
   stock: 50
   createdAt: (timestamp)
   ```
6. Guarda

### 3. **Crear Colección "categorias"**

1. Haz clic en **"+ Create collection"**
2. Escribe: `categorias`
3. Crea documentos para cada categoría:
   ```
   - Flores
   - Chocolates
   - Peluches
   - Dulces
   ```

---

## 🔗 Integración en tu App

Tu app ya tiene todo listo para usar. Ejemplos:

### **Usar AuthService en componentes:**

```typescript
constructor(private authService: AuthService) {}

entrar() {
  this.authService.login(email, password).subscribe({
    next: (result) => {
      console.log('Login exitoso:', result.user.email);
      // Navegar a otra página
    },
    error: (error) => {
      console.log('Error de login:', error.message);
    }
  });
}
```

### **Usar FirestoreService en componentes:**

```typescript
constructor(private firestoreService: FirestoreService) {}

ngOnInit() {
  // Escuchar productos en tiempo real
  this.firestoreService.listenToCollection('productos').subscribe({
    next: (productos) => {
      console.log('Productos:', productos);
      this.productos = productos;
    }
  });
}
```

### **Usar ProductoService:**

```typescript
constructor(private productoService: ProductoService) {}

ngOnInit() {
  // Obtener productos por categoría
  this.productoService.obtenerProductosPorCategoria('Flores').subscribe({
    next: (productos) => {
      this.flores = productos;
    }
  });
}
```

---

## 🚨 Notas Importantes

### ⚠️ Para Producción (IMPORTANTE)

Las reglas de acceso que configuramos son solo para **DESARROLLO**. Antes de ir a producción:

1. **Cambia las reglas de Firestore** para ser más restrictivas
2. **Habilita la verificación de email** en Authentication
3. **Usa variables de entorno** para las credenciales
4. **Implementa funciones Cloud** para lógica compleja
5. **Configura límites de lectura/escritura** para evitar costos altos

### 🔒 Credenciales Públicas

Tus credenciales de Firebase están públicas en el código (esto es normal y seguro para aplicaciones web). La seguridad viene de las reglas de Firestore.

---

## ✅ Checklist Final

- [x] Credenciales actualizadas en `firebase.config.ts`
- [x] Providers de Firebase en `main.ts`
- [x] AuthService implementado
- [x] FirestoreService implementado
- [ ] Autenticación habilitada en Firebase Console
- [ ] Firestore Database creada
- [ ] Reglas de seguridad configuradas
- [ ] Usuario de prueba creado
- [ ] Login probado en la app
- [ ] Estructura de colecciones creada en Firestore

---

## 📞 Próximos Pasos

1. **Completa los pasos 1-3 en Firebase Console** (arriba ↑)
2. **Crea usuarios de prueba**
3. **Prueba el login en tu app**
4. **Comienza a desarrollar las funcionalidades**

---

¡Tu backend con Firebase está casi listo! Solo necesitas habilitar los servicios en Firebase Console. 🚀
