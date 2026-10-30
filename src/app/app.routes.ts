import { Routes } from '@angular/router';
import { Identify } from './identify/identify';
import { Profile } from './profile/profile';

export const routes: Routes = [
  { path: 'perfil', component: Profile },
  { path: 'o-que-e', component: Identify },
  { path: '', redirectTo: 'perfil', pathMatch: 'full' },
];
