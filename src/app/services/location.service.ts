import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Location {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  isDefault?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locations = new BehaviorSubject<Location[]>(this.loadLocations());
  public locations$ = this.locations.asObservable();

  constructor() {}

  private loadLocations(): Location[] {
    const saved = localStorage.getItem('locations');
    return saved ? JSON.parse(saved) : [];
  }

  private saveLocations(locations: Location[]): void {
    localStorage.setItem('locations', JSON.stringify(locations));
    this.locations.next(locations);
  }

  addLocation(location: Omit<Location, 'id'>): void {
    const currentLocations = this.locations.value;
    const newLocation: Location = {
      ...location,
      id: Date.now().toString(),
      isDefault: currentLocations.length === 0 // Primera ubicación por defecto
    };
    
    currentLocations.push(newLocation);
    this.saveLocations(currentLocations);
  }

  updateLocation(id: string, location: Omit<Location, 'id'>): void {
    const currentLocations = this.locations.value;
    const index = currentLocations.findIndex(loc => loc.id === id);
    
    if (index !== -1) {
      currentLocations[index] = {
        ...location,
        id
      };
      this.saveLocations(currentLocations);
    }
  }

  removeLocation(id: string): void {
    const currentLocations = this.locations.value.filter(loc => loc.id !== id);
    
    // Si era la ubicación por defecto, marcar la primera como defecto
    if (currentLocations.length > 0) {
      currentLocations[0].isDefault = true;
    }
    
    this.saveLocations(currentLocations);
  }

  setDefaultLocation(id: string): void {
    const currentLocations = this.locations.value;
    currentLocations.forEach(loc => loc.isDefault = loc.id === id);
    this.saveLocations(currentLocations);
  }

  getDefaultLocation(): Location | undefined {
    return this.locations.value.find(loc => loc.isDefault);
  }

  getAllLocations(): Location[] {
    return this.locations.value;
  }
}
