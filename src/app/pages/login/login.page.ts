import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  remember = true;
  loading = false;
  emailError = '';
  passwordError = '';
  passwordVisible = false;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Auto-focus en el campo de email después de que la vista se cargue
    setTimeout(() => {
      const emailInput = document.querySelector('ion-input[name="email"]');
      if (emailInput) {
        (emailInput as any).setFocus();
      }
    }, 300);
  }

  get canSubmit(): boolean {
    return this.email.length > 0 && this.password.length > 0;
  }

  validateEmail() {
    // Sin validación por ahora
  }

  validatePassword() {
    // Sin validación por ahora
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  async entrar() {
    // Validar que haya email y contraseña
    if (!this.email || !this.password) {
      await this.showToast('Por favor completa todos los campos', 'warning');
      return;
    }

    this.loading = true;

    // Llamar al servicio de autenticación de Firebase
    this.authService.login(this.email, this.password).subscribe({
      next: async (response) => {
        this.loading = false;
        await this.showToast('¡Bienvenido! Iniciando sesión...', 'success');
        
        // Navegar a tabs después de 500ms
        setTimeout(() => {
          this.navCtrl.navigateRoot('/tabs', { replaceUrl: true });
        }, 500);
      },
      error: async (error) => {
        this.loading = false;
        
        // Manejo de errores específicos de Firebase
        let message = 'Error al iniciar sesión. Intenta de nuevo.';
        
        if (error.code === 'auth/user-not-found') {
          message = 'Usuario no encontrado.';
        } else if (error.code === 'auth/wrong-password') {
          message = 'Contraseña incorrecta.';
        } else if (error.code === 'auth/invalid-email') {
          message = 'Email inválido.';
        } else if (error.code === 'auth/too-many-requests') {
          message = 'Demasiados intentos fallidos. Intenta más tarde.';
        }
        
        await this.showToast(message, 'danger');
      }
    });
  }

  goRegister() {
    this.navCtrl.navigateForward('/create-account');
  }

  forgotPassword() {
    // Navegar o mostrar modal de recuperación
    this.navCtrl.navigateForward('/recuperar');
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
