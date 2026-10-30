import { Routes } from '@angular/router';
import { Profile } from './profile/profile';

export const routes: Routes = [
  { path: 'perfil', component: Profile },
  { path: '', redirectTo: 'perfil', pathMatch: 'full' },
];
