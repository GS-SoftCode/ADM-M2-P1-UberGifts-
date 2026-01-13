/**
 * Modelo de Usuario para Firestore
 * Representa los datos de un usuario en la aplicación
 */
export interface Usuario {
  // Campos de autenticación
  uid: string;                    // ID único de Firebase Auth
  email: string;                  // Correo electrónico
  
  // Información personal
  displayName?: string;           // Nombre completo del usuario
  fotoPerfil?: string;           // URL de la foto de perfil en Storage
  
  // Información de contacto
  telefono?: string;             // Número de teléfono
  
  // Información de dirección
  direccion?: string;            // Dirección principal
  ciudad?: string;               // Ciudad
  codigoPostal?: string;         // Código postal
  pais?: string;                 // País
  
  // Información de cuenta
  rol?: 'cliente' | 'vendedor';  // Rol del usuario en la plataforma
  activo?: boolean;              // Si la cuenta está activa
  
  // Metadatos
  createdAt: Date;               // Fecha de creación de la cuenta
  updatedAt: Date;               // Fecha de última actualización
  
  // Información adicional
  calificacion?: number;         // Calificación promedio del usuario
  numeroOrdenCompletadas?: number; // Número de órdenes completadas
}
