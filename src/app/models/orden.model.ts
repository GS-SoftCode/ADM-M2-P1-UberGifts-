/**
 * Modelo de Orden para Firestore
 * Representa una orden de compra en la aplicación
 */
export interface OrdenItem {
  productoId: string;            // ID del producto
  nombre: string;                // Nombre del producto
  precio: number;                // Precio unitario del producto
  cantidad: number;              // Cantidad de productos
  imagen?: string;               // URL de la imagen del producto
  subtotal: number;              // Precio * cantidad
}

export interface Orden {
  id?: string;                   // ID de la orden (generado por Firestore)
  userId: string;                // ID del usuario que realiza la orden
  numeroOrden: string;           // Número de orden único
  
  // Items en la orden
  items: OrdenItem[];            // Array de productos en la orden
  
  // Precios
  subtotal: number;              // Subtotal de la orden
  impuesto?: number;             // Impuesto (si aplica)
  costoEnvio?: number;           // Costo de envío
  total: number;                 // Total de la orden
  
  // Información de envío
  direccionEntrega: string;      // Dirección de entrega
  ciudadEntrega: string;         // Ciudad de entrega
  codigoPostalEntrega: string;   // Código postal de entrega
  paisEntrega?: string;          // País de entrega
  
  // Información de contacto para entrega
  nombreReceptor: string;        // Nombre de quién recibe
  telefonoReceptor: string;      // Teléfono del receptor
  
  // Estado de la orden
  estado: 'pendiente' | 'confirmada' | 'preparando' | 'en_camino' | 'entregada' | 'cancelada';
  
  // Estimaciones de tiempo
  fechaOrden: Date;              // Fecha en que se realizó la orden
  tiempoEstimadoEntrega: number; // Tiempo estimado de entrega en minutos
  tiempoRestante?: number;       // Tiempo restante para la entrega (en minutos)
  fechaEntregaEstimada?: Date;   // Fecha estimada de entrega
  fechaEntregaReal?: Date;       // Fecha real de entrega (cuando se entrega)
  
  // Seguimiento
  ubicacionActual?: {
    latitud: number;
    longitud: number;
    actualizado: Date;
  };
  
  // Observaciones y notas
  notas?: string;                // Notas especiales de la orden
  motivoCancelacion?: string;    // Si fue cancelada, razón de cancelación
  
  // Metadatos
  createdAt: Date;               // Fecha de creación del registro
  updatedAt: Date;               // Fecha de última actualización
}
