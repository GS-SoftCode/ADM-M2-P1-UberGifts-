import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { IonContent, IonImg, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonIcon, IonButton } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonImg, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonIcon, IonButton, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private navCtrl: NavController) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login', email, password);
      this.navCtrl.navigateRoot('/tabs');
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onForgotPassword() { console.log('Forgot password'); }
  onSignup() { console.log('Signup'); }

}
