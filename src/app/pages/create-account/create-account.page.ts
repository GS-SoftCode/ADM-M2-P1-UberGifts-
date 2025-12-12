import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss']
})
export class CreateAccountPage implements OnInit {

  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';
  passwordVisible = false;
  loading = false;
  passwordMatchError = '';

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Auto-focus en el campo de nombre después de que la vista se cargue
    setTimeout(() => {
      const nombreInput = document.querySelector('ion-input[name="nombre"]');
      if (nombreInput) {
        (nombreInput as any).setFocus();
      }
    }, 300);
  }

  get canSubmit(): boolean {
    return (
      this.nombre.length > 0 &&
      this.email.length > 0 &&
      this.password.length >= 6 &&
      this.password === this.confirmPassword
    );
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  validatePasswordMatch() {
    if (this.confirmPassword && this.password !== this.confirmPassword) {
      this.passwordMatchError = 'Las contraseñas no coinciden';
    } else {
      this.passwordMatchError = '';
    }
  }

  async registrarse() {
    // Validar campos vacíos
    if (!this.nombre || !this.email || !this.password || !this.confirmPassword) {
      await this.showToast('Por favor completa todos los campos', 'warning');
      return;
    }

    // Validar que las contraseñas coincidan
    if (this.password !== this.confirmPassword) {
      await this.showToast('Las contraseñas no coinciden', 'danger');
      return;
    }

    // Validar longitud mínima de contraseña
    if (this.password.length < 6) {
      await this.showToast('La contraseña debe tener al menos 6 caracteres', 'danger');
      return;
    }

    this.loading = true;

    // Llamar al servicio de autenticación de Firebase
    this.authService.register(this.email, this.password, this.nombre).subscribe({
      next: async (response) => {
        this.loading = false;
        await this.showToast('¡Cuenta creada exitosamente! Iniciando sesión...', 'success');
        
        // Navegar a tabs después de 1 segundo
        setTimeout(() => {
          this.navCtrl.navigateRoot('/tabs', { replaceUrl: true });
        }, 1000);
      },
      error: async (error) => {
        this.loading = false;
        
        // Manejo de errores específicos de Firebase
        let message = 'Error al crear la cuenta. Intenta de nuevo.';
        
        if (error.code === 'auth/email-already-in-use') {
          message = 'Este email ya está registrado.';
        } else if (error.code === 'auth/invalid-email') {
          message = 'Email inválido.';
        } else if (error.code === 'auth/weak-password') {
          message = 'La contraseña es demasiado débil.';
        } else if (error.code === 'auth/operation-not-allowed') {
          message = 'El registro no está habilitado. Contacta al administrador.';
        }
        
        await this.showToast(message, 'danger');
      }
    });
  }

  goLogin() {
    this.navCtrl.back();
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}
