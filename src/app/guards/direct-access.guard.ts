import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const directAccessGuard: CanActivateFn = (): boolean => {
  const router = inject(Router);
  if (router.url === '/') {
    router.navigate(['']); // Navigate away to some other page
    return false;
  }
  return true;
};
