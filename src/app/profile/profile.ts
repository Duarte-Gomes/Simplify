import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

const PHONE_PATTERN = /^\+?[0-9 ]{9,15}$/;

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-profile',
  styleUrl: './profile.scss',
  templateUrl: './profile.html',
})
export class Profile {
  private readonly fb = inject(FormBuilder);

  protected readonly saved = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    address: [''],
    postalCode: ['', Validators.pattern(/^\d{4}-\d{3}$/)],
    locality: [''],
    homePhone: ['', Validators.pattern(PHONE_PATTERN)],
    mobilePhone: ['', Validators.pattern(PHONE_PATTERN)],
    hobbies: this.fb.nonNullable.array([this.fb.nonNullable.control('')]),
  });

  protected get hobbies(): FormArray {
    return this.form.controls.hobbies;
  }

  protected addHobby(): void {
    this.hobbies.push(this.fb.nonNullable.control(''));
  }

  protected removeHobby(index: number): void {
    this.hobbies.removeAt(index);
  }

  protected isInvalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    console.log('Perfil guardado', {
      ...value,
      hobbies: value.hobbies.map((h) => h.trim()).filter(Boolean),
    });
    this.saved.set(true);
  }
}
