import { Component } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, homeOutline, medkitOutline, personOutline } from 'ionicons/icons';

@Component({
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  selector: 'app-tabs',
  templateUrl: './tabs.html',
})
export class Tabs {
  constructor() {
    addIcons({ homeOutline, personOutline, cameraOutline, medkitOutline });
  }
}
