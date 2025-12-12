import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonInput, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, personCircle, mail, call, pin } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonButton, IonIcon, IonInput],
  templateUrl: './profile-modal.html',
  styleUrls: ['./profile-modal.scss']
})
export class ProfileModalComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  isEditing: boolean = false;

  constructor(
    private authService: AuthService,
    private modalController: ModalController
  ) {
    addIcons({ close, personCircle, mail });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.displayName || 'Usuario';
      this.userEmail = user.email || '';
    }
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    // Guardar el nombre en localStorage (en una app real, sería en una API)
    localStorage.setItem('userName', this.userName);
    this.isEditing = false;
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
