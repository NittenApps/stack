import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth: AuthService = inject(AuthService);

  const isAuthenticated = auth.isLoggedIn();

  if (!isAuthenticated) {
    await auth.login(state.url);
  }

  const roles = auth.getUserRoles();
  var requiredRoles: string | string[] = route.data['roles'];

  if (typeof requiredRoles === 'string' && requiredRoles.length > 0) {
    requiredRoles = [requiredRoles];
  }
  if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
    return true;
  }

  return requiredRoles.some((role) => roles.includes(role));
};
