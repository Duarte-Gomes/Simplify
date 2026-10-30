import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { PHONE_PATTERN } from '../shared/patterns';

@Component({
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
  ],
  selector: 'app-emergency',
  styleUrl: './emergency.scss',
  templateUrl: './emergency.html',
})
export class Emergency {
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastController);

  protected readonly relationships = [
    'Pai',
    'Mãe',
    'Cônjuge',
    'Filho(a)',
    'Irmão(ã)',
    'Avô / Avó',
    'Amigo(a)',
    'Vizinho(a)',
    'Outro',
  ];

  protected readonly form = this.fb.nonNullable.group({
    contacts: this.fb.nonNullable.array([this.createContact()]),
  });

  // Parentesco de cada contacto tal como foi gravado, mostrado como título do cartão.
  protected readonly savedRelationships = signal(new Map<FormGroup, string>());

  constructor() {
    addIcons({ addOutline, trashOutline });
  }

  protected get contacts() {
    return this.form.controls.contacts;
  }

  protected addContact(): void {
    this.contacts.push(this.createContact());
  }

  protected removeContact(index: number): void {
    this.contacts.removeAt(index);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Contactos de urgência guardados', this.contacts.getRawValue());
    this.savedRelationships.set(
      new Map(this.contacts.controls.map((c) => [c, c.getRawValue().relationship])),
    );
    const toast = await this.toast.create({
      message: 'Contactos de urgência guardados.',
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    await toast.present();
  }

  private createContact() {
    return this.fb.nonNullable.group({
      relationship: ['', Validators.required],
      name: ['', Validators.required],
      mobilePhone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      phone: ['', Validators.pattern(PHONE_PATTERN)],
    });
  }
}
