import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
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
    IonInput,
    IonButton,
    IonIcon,
  ],
  selector: 'app-profile',
  styleUrl: './profile.scss',
  templateUrl: './profile.html',
})
export class Profile {
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastController);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    address: [''],
    postalCode: ['', Validators.pattern(/^\d{4}-\d{3}$/)],
    locality: [''],
    homePhone: ['', Validators.pattern(PHONE_PATTERN)],
    mobilePhone: ['', Validators.pattern(PHONE_PATTERN)],
    hobbies: this.fb.nonNullable.array([this.fb.nonNullable.control('')]),
  });

  constructor() {
    addIcons({ addOutline, trashOutline });
  }

  protected get hobbies(): FormArray {
    return this.form.controls.hobbies;
  }

  protected addHobby(): void {
    this.hobbies.push(this.fb.nonNullable.control(''));
  }

  protected removeHobby(index: number): void {
    this.hobbies.removeAt(index);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    console.log('Perfil guardado', {
      ...value,
      hobbies: value.hobbies.map((h) => h.trim()).filter(Boolean),
    });
    const toast = await this.toast.create({
      message: 'Perfil guardado com sucesso.',
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    await toast.present();
  }
}
