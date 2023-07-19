import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const directAccessGuard: CanActivateFn = (): boolean => {
  const router = inject(Router);
  if (router.url === '/') {
    router.navigate(['']); // Navigate to dashboard
    return false;
  }
  return true;
};
