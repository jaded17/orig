import { CanActivateFn } from '@angular/router';

export const pmGuard: CanActivateFn = (route, state) => {
  return true;
};
