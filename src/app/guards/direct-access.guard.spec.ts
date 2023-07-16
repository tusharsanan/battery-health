import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { directAccessGuard } from './direct-access.guard';

describe('directAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => directAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
