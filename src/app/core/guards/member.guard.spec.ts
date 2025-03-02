import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { MemberGuard } from './member.guard';

describe('MemberGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => MemberGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
