import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../shared/services/auth/auth.service';

export const adminAuthGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);

  await authService.waitForState();
  const user = authService.getUser();
  if (user) {
    return true;
  }

  await router.navigate(['admin/login']);
  return false;
};

export const loginAuthGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);

  await authService.waitForState();

  const user = authService.getUser();
  if (user) {
    await router.navigate(['admin/dashboard']);
  }

  return true;
};
