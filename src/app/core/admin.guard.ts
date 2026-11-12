import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ConfirmService } from './confirm.service';
import { Admin } from '../admin/admin';

/** Pide confirmacion antes de abandonar el panel ( atras del navegador, links, etc ). */
export const adminGuard: CanDeactivateFn<Admin> = (component) => {
  if (component.salirPermitido || !component.user()) return true;
  return inject(ConfirmService).ask(
    '¿Seguro que querés salir del panel?',
    'Los cambios que no hayas guardado se perderán.',
  );
};