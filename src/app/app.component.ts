import { Component, OnInit, Inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ProductoService } from './services/producto.service';
import { DataInitializerService } from './services/data-initializer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private productoService: ProductoService,
    private dataInitializer: DataInitializerService
  ) {}

  ngOnInit() {
    console.log('🧪 Iniciando aplicación...');

    // Envolver en try-catch para evitar crashes
    try {
      // Primero verificar si la BD está vacía
      this.dataInitializer.checkIfDatabaseInitialized().subscribe(
        (initialized) => {
          if (!initialized) {
            console.log('📥 Base de datos vacía. Inicializando con 15 productos...');
            this.dataInitializer.initializeDatabase().subscribe(
              () => {
                console.log('✅ Base de datos inicializada correctamente');
                this.pruebaFirestore();
              },
              (error) => {
                console.error('❌ Error inicializando BD:', error);
                // No lanzar el error, solo loguearlo
              }
            );
          } else {
            console.log('✅ Base de datos ya tiene datos');
            this.pruebaFirestore();
          }
        },
        (error) => {
          console.error('❌ Error verificando BD:', error);
          // No lanzar el error, solo loguearlo
        }
      );
    } catch (error) {
      console.error('❌ Error crítico en ngOnInit:', error);
      // Continuar sin inicializar la BD
    }
  }

  pruebaFirestore() {
    try {
      this.productoService.obtenerProductos().subscribe(
        (productos) => {
          console.log('✅ SUCCESS! Productos obtenidos:', productos.length);
          if (productos.length > 0) {
            console.log('Primer producto:', productos[0]);
          }
        },
        (error) => {
          console.error('❌ ERROR obteniendo productos:', error);
          // No lanzar el error, la app puede seguir funcionando
        }
      );
    } catch (error) {
      console.error('❌ Error en pruebaFirestore:', error);
    }
  }
}
