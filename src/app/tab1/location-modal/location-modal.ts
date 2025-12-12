import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonInput, IonLabel, IonCard, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, trash, checkmarkCircle } from 'ionicons/icons';
import { LocationService, Location } from '../../services/location.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-location-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonButton, IonIcon, IonInput, IonLabel, IonCard],
  templateUrl: './location-modal.html',
  styleUrls: ['./location-modal.scss']
})
export class LocationModalComponent implements OnInit {
  locations$!: Observable<Location[]>;
  showForm: boolean = false;
  editingId: string | null = null;

  // Datos del formulario
  fullName: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';
  city: string = '';
  zipCode: string = '';

  constructor(
    private locationService: LocationService,
    private modalController: ModalController
  ) {
    addIcons({ close, trash, checkmarkCircle });
  }

  ngOnInit() {
    this.locations$ = this.locationService.locations$;
  }

  openForm(location?: Location) {
    if (location) {
      this.editingId = location.id;
      this.fullName = location.fullName;
      this.email = location.email;
      this.phone = location.phone;
      this.address = location.address;
      this.city = location.city;
      this.zipCode = location.zipCode;
    } else {
      this.resetForm();
    }
    this.showForm = true;
  }

  resetForm() {
    this.fullName = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.city = '';
    this.zipCode = '';
    this.editingId = null;
  }

  closeForm() {
    this.showForm = false;
    this.resetForm();
  }

  isFormValid(): boolean {
    return (
      this.fullName.trim() !== '' &&
      this.email.trim() !== '' &&
      this.phone.trim() !== '' &&
      this.address.trim() !== '' &&
      this.city.trim() !== '' &&
      this.zipCode.trim() !== ''
    );
  }

  saveLocation() {
    if (!this.isFormValid()) {
      alert('Por favor completa todos los campos');
      return;
    }

    const locationData = {
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      city: this.city,
      zipCode: this.zipCode
    };

    if (this.editingId) {
      this.locationService.updateLocation(this.editingId, locationData);
    } else {
      this.locationService.addLocation(locationData);
    }

    this.closeForm();
  }

  deleteLocation(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta ubicación?')) {
      this.locationService.removeLocation(id);
    }
  }

  setDefault(id: string) {
    this.locationService.setDefaultLocation(id);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
