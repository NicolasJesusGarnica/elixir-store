import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then((m) => m.Home) },
  { path: 'perfumes', loadComponent: () => import('./perfumes/perfumes').then((m) => m.Perfumes) },
  {
    path: 'decants',
    loadComponent: () => import('./perfumes/perfumes').then((m) => m.Perfumes),
    data: { soloDecants: true },
  },
  { path: 'perfumes/:id', loadComponent: () => import('./perfumes/perfume-detalle').then((m) => m.PerfumeDetalle) },
  { path: 'novedades', loadComponent: () => import('./novedades/novedades').then((m) => m.Novedades) },
  {
    path: 'admin',
    canDeactivate: [adminGuard],
    loadComponent: () => import('./admin/admin').then((m) => m.Admin),
  },
  { path: 'terminos', loadComponent: () => import('./legal/terminos').then((m) => m.Terminos) },
  { path: 'privacidad', loadComponent: () => import('./legal/privacidad').then((m) => m.Privacidad) },
  { path: 'reembolsos', loadComponent: () => import('./legal/reembolsos').then((m) => m.Reembolsos) },
  { path: 'cookies', loadComponent: () => import('./legal/cookies').then((m) => m.Cookies) },
  // Cualquier URL desconocida cae aqui y devuelve 404 de verdad.
  {
    path: '**',
    loadComponent: () => import('./no-encontrado/no-encontrado').then((m) => m.NoEncontrado),
  },
];
