import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { addIcons } from 'ionicons';
import { 
  mailOutline, 
  lockClosedOutline, 
  logoGoogle, 
  eyeOutline, 
  eyeOffOutline,
  homeOutline,
  home,
  locationOutline,
  location,
  cartOutline,
  cart,
  personCircle,
  arrowForward,
  close,
  addCircle,
  chevronForward,
  gift,
  cube,
  search,
  rocket,
  heart
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { firebaseConfig } from './environments/firebase.config';

// Registrar iconos de Ionicons
addIcons({
  'mail-outline': mailOutline,
  'lock-closed-outline': lockClosedOutline,
  'logo-google': logoGoogle,
  'eye-outline': eyeOutline,
  'eye-off-outline': eyeOffOutline,
  'home-outline': homeOutline,
  'home': home,
  'location-outline': locationOutline,
  'location': location,
  'cart-outline': cartOutline,
  'cart': cart,
  'person-circle': personCircle,
  'arrow-forward': arrowForward,
  'close': close,
  'add-circle': addCircle,
  'chevron-forward': chevronForward,
  'gift': gift,
  'cube': cube,
  'search': search,
  'rocket': rocket,
  'heart': heart
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => {
      try {
        console.log('🔥 Inicializando Firebase...');
        return initializeApp(firebaseConfig);
      } catch (error) {
        console.error('❌ Error inicializando Firebase:', error);
        throw error;
      }
    }),
    provideAuth(() => {
      try {
        return getAuth();
      } catch (error) {
        console.error('❌ Error inicializando Auth:', error);
        throw error;
      }
    }),
    provideFirestore(() => {
      try {
        return getFirestore();
      } catch (error) {
        console.error('❌ Error inicializando Firestore:', error);
        throw error;
      }
    }),
    provideStorage(() => {
      try {
        return getStorage();
      } catch (error) {
        console.error('❌ Error inicializando Storage:', error);
        throw error;
      }
    }),
  ],
}).catch(err => {
  console.error('❌ Error fatal inicializando la aplicación:', err);
});
