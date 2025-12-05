import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonIcon, IonButton, IonImg, IonCheckbox, IonSpinner } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonInput, IonButton, IonIcon, IonCheckbox, IonSpinner, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  remember = true;
  loading = false;

  constructor(private fb: FormBuilder, public navCtrl: NavController, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get emailInvalid() {
    const c = this.loginForm.get('email');
    return !!c && c.touched && c.invalid;
  }

  get passwordInvalid() {
    const c = this.loginForm.get('password');
    return !!c && c.touched && c.invalid;
  }

  onCreateAccount() {
    this.navCtrl.navigateForward('/create-account');
  }

  onLogin() {
    if (this.loginForm.invalid || this.loading) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    // Simula una breve carga
    setTimeout(() => {
      this.loading = false;
      // Navegación absoluta al árbol de Tabs
      this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    }, 800);
  }

  onForgot() {
    // Navigate to forgot page if exists or show toast
  }

  onBack() {
    this.navCtrl.back();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
