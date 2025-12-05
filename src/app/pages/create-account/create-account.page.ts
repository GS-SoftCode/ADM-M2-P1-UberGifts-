import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonLabel, IonInput, IonButton, CommonModule, FormsModule, ReactiveFormsModule]
})
export class CreateAccountPage implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private navCtrl: NavController, private router: Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  gotoLogin() {
    this.navCtrl.back();
  }

  onSubmit() {
    if (this.form.invalid) return;
    // Navegación absoluta al árbol de Tabs
    this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
  }

}
