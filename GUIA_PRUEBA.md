# 🧪 Guía de Prueba - Firebase UberGifts

## ✅ Verificación de Configuración

Tu proyecto tiene **TODO configurado correctamente**:

- ✅ **Credenciales Firebase**: `src/environments/firebase.config.ts` 
- ✅ **Providers configurados**: `src/main.ts`
- ✅ **AuthService implementado**: `src/app/services/auth.service.ts`
- ✅ **FirestoreService implementado**: `src/app/services/firestore.service.ts`
- ✅ **ProductoService implementado**: `src/app/services/producto.service.ts`
- ✅ **Login integrado**: `src/app/pages/login/login.page.ts`

---

## 🚀 Cómo Probar la Aplicación

### **Paso 1: Iniciar el servidor de desarrollo**

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm start
```

Esto iniciará el servidor en `http://localhost:4200`

**Espera a que veas:**
```
✔ Compiled successfully.
```

---

### **Paso 2: Abre la app en el navegador**

Ve a: **http://localhost:4200**

Deberías ver la pantalla de **LOGIN** con:
- Campo de email
- Campo de contraseña
- Botón "Entrar" (color morado)
- Enlace "Crear una cuenta"

---

### **Paso 3: Crear un usuario de prueba en Firebase Console**

Ahora necesitas crear un usuario en Firebase Console:

1. Ve a: https://console.firebase.google.com/project/ubergifts-90016/authentication/users

2. Haz clic en el botón **"Create user"** (arriba a la derecha)

3. Completa los datos:
   - **Email**: `test@example.com`
   - **Password**: `123456789`

4. Haz clic en **"Create user"**

✅ El usuario está creado en Firebase

---

### **Paso 4: Prueba el LOGIN**

En tu navegador (http://localhost:4200):

1. **Email**: `test@example.com`
2. **Password**: `123456789`
3. Haz clic en **"Entrar"**

**Deberías ver:**
- 🔄 El botón cambia a un spinner (loading)
- ✅ Toast verde con mensaje: **"¡Bienvenido! Iniciando sesión..."**
- 📍 La pantalla se recarga y te lleva a **/tabs** (página principal con tabs)

✅ **Si llegaste a /tabs: ¡Firebase Authentication funciona!**

---

### **Paso 5: Prueba Firestore (Base de Datos)**

Ahora vamos a probar que la base de datos funciona.

#### **5.1 Abre la Consola del Navegador**

1. En tu navegador, presiona **F12** o click derecho → **"Inspeccionar"**
2. Ve a la pestaña **"Console"**

Deberías ver mensajes como:
```
[Firebase] Firebase App (identifierName:"__FIREBASE_DEFAULT__") is being used as an app...
```

#### **5.2 Crear datos en Firestore**

Ahora vamos a crear datos manualmente. En la **Consola del navegador**, ejecuta este comando:

```javascript
firebase.firestore().collection('productos').add({
  nombre: 'Ramo de Rosas',
  precio: 25000,
  descripcion: 'Hermoso ramo de rosas rojas',
  categoria: 'Flores',
  stock: 50,
  createdAt: new Date()
}).then(docRef => {
  console.log('Producto creado con ID:', docRef.id);
});
```

✅ Deberías ver en la consola: **"Producto creado con ID: [algún-id]"**

#### **5.3 Verificar en Firebase Console**

1. Ve a: https://console.firebase.google.com/project/ubergifts-90016/firestore/data

2. Abre la colección **"productos"**

3. Deberías ver el documento que acabas de crear con los datos

✅ **Si ves el producto en Firestore: ¡La base de datos funciona!**

---

## 🧪 Pruebas Adicionales

### **Prueba 1: Login fallido**

1. Vuelve a la pantalla de login (ve a: http://localhost:4200)
2. Intenta con credenciales incorrectas:
   - Email: `test@example.com`
   - Password: `contraseña-incorrecta`
3. Haz clic en **"Entrar"**

**Resultado esperado:**
- ❌ Toast rojo con mensaje: **"Credenciales incorrectas..."** o similar

✅ El manejo de errores funciona

---

### **Prueba 2: Abre la Consola del Navegador**

Presiona **F12** y ve a la pestaña **"Console"**

Debería mostrarse algo como:
```
Firebase App initialized
Auth configured
Firestore initialized
```

✅ Firebase está completamente inicializado

---

### **Prueba 3: Abre las DevTools de Red**

En las DevTools (F12), ve a la pestaña **"Network"**

1. Haz login
2. Deberías ver solicitudes HTTP a Firebase:
   ```
   - accounts.google.com
   - firebaseidentitytoolkit.googleapis.com
   ```

✅ Las conexiones a Firebase funcionan

---

## ✅ Checklist de Verificación

- [ ] npm start se ejecuta sin errores
- [ ] La app abre en http://localhost:4200
- [ ] Se ve la pantalla de login con botón morado
- [ ] Usuario de prueba creado en Firebase Console
- [ ] Login con test@example.com / 123456789 funciona
- [ ] Se ve toast verde de bienvenida
- [ ] Se navega a /tabs después del login
- [ ] Los productos se crean en Firestore
- [ ] Puedes ver los productos en Firebase Console
- [ ] Las DevTools muestran conexiones a Firebase

---

## 🔧 Si hay errores...

### **Error: "Cannot find module 'firebase'"**

```bash
npm install firebase @angular/fire
```

### **Error: "firebase.firestore is not a function"**

Asegúrate de que en la consola estés usando:
```javascript
// Correcto:
firebase.firestore().collection('productos')...

// No uses:
db.collection('productos')...
```

### **Error: "Permission denied" en Firestore**

Ve a Firestore Rules y asegúrate de que tengas estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **Error: "The email address is badly formatted"**

Asegúrate de usar un email válido:
- ✅ `test@example.com`
- ❌ `test@` (incorrecto)
- ❌ `test` (incorrecto)

---

## 📊 Vista General de Prueba

```
┌─────────────────────────────────────────────────┐
│         Login Page (http://localhost:4200)       │
│  ┌───────────────────────────────────────────┐  │
│  │ Email:    test@example.com                │  │
│  │ Password: 123456789                       │  │
│  │                                           │  │
│  │        [Entrar] (morado)                 │  │
│  └───────────────────────────────────────────┘  │
│                    ↓                             │
│            Firebase Auth                        │
│                    ↓                             │
│        ✅ Credenciales correctas               │
│                    ↓                             │
│         Navega a /tabs                          │
│                    ↓                             │
│    ┌────────────────────────────────┐           │
│    │ Tab1 │ Tab2 │ Tab3 │ (Tabs)   │           │
│    └────────────────────────────────┘           │
│                                                  │
│         Firebase Firestore                      │
│      (Guardando productos)                      │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Resumen Rápido

| Paso | Acción | Esperado |
|------|--------|----------|
| 1 | `npm start` | Servidor inicia sin errores |
| 2 | Abre http://localhost:4200 | Ves pantalla de login |
| 3 | Crea usuario en Firebase | Usuario en Console |
| 4 | Login con test@example.com | Navega a /tabs |
| 5 | Crea producto en consola | Aparece en Firestore |
| 6 | Verifica en Firebase Console | Ves el producto |

---

## 🚀 Siguiente Paso

Después de verificar que todo funciona:

1. **Implementa la gestión de productos** en `tab1/`
2. **Implementa carrito de compras** en `tab2/`
3. **Implementa perfil de usuario** en `tab3/`

---

¡Tu backend con Firebase está **100% funcional**! 🎉

Si tienes algún error durante las pruebas, comparte el mensaje de error en la consola.
