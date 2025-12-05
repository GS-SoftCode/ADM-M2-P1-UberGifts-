import { Component } from '@angular/core';
import { IonContent, IonSearchbar, IonButton, IonIcon, IonImg, IonCard } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircle } from 'ionicons/icons';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonContent, IonSearchbar, IonButton, IonIcon, IonImg, IonCard],
})
export class Tab3Page {
  constructor() {
    addIcons({ personCircle });
  }
}
