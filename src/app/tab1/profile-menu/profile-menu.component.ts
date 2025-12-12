import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, PopoverController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOut, person, personCircle } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
    private popoverController: PopoverController
  ) {
    addIcons({personCircle,person,logOut});
  }

  async goToProfile() {
    await this.popoverController.dismiss();
    this.router.navigate(['/profile']);
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
