import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, PopoverController, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOut, person, personCircle, location } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LocationModalComponent } from '../location-modal/location-modal';
import { ProfileModalComponent } from '../profile-modal/profile-modal';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class ProfileMenuComponent {
  @Input() userEmail: string = '';
  @Input() userName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private popoverController: PopoverController,
    private modalController: ModalController
  ) {
    addIcons({personCircle,person,location,logOut});
  }

  async goToProfile() {
    await this.popoverController.dismiss();
    
    const modal = await this.modalController.create({
      component: ProfileModalComponent,
      cssClass: 'profile-modal'
    });

    return await modal.present();
  }

  async openLocationModal() {
    await this.popoverController.dismiss();
    
    const modal = await this.modalController.create({
      component: LocationModalComponent,
      cssClass: 'location-modal'
    });

    return await modal.present();
  }

  async logout() {
    try {
      await this.authService.logout();
      await this.popoverController.dismiss();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}

