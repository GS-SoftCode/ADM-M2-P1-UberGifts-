import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonItem, IonLabel, IonInput, IonIcon, IonButton } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonLabel, IonInput, IonButton, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, public navCtrl: NavController, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onCreateAccount() {
    this.navCtrl.navigateForward('/create-account');
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    // Navegación absoluta al árbol de Tabs
    this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
  }

  onForgot() {
    // Navigate to forgot page if exists or show toast
  }

  onBack() {
    this.navCtrl.back();
  }
}
