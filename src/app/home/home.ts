import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRouterLink,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, medkitOutline, personOutline } from 'ionicons/icons';

interface Shortcut {
  title: string;
  description: string;
  icon: string;
  link: string;
}

@Component({
  imports: [
    RouterLink,
    IonRouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
  ],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  protected readonly shortcuts: Shortcut[] = [
    {
      title: 'Perfil',
      description: 'Os teus dados pessoais e hobbies',
      icon: 'person-outline',
      link: '/perfil',
    },
    {
      title: 'O que é?',
      description: 'Tira uma foto e descobre o que é',
      icon: 'camera-outline',
      link: '/o-que-e',
    },
    {
      title: 'Urgência',
      description: 'Contactos a avisar em caso de emergência',
      icon: 'medkit-outline',
      link: '/urgencia',
    },
  ];

  constructor() {
    addIcons({ personOutline, cameraOutline, medkitOutline });
  }
}
