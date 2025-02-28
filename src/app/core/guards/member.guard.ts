import { CanActivateFn } from '@angular/router';

export const MemberGuard: CanActivateFn = (route, state) => {
  return true;
};
