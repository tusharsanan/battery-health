import { Subject, takeUntil } from 'rxjs';
import { DestroyRef, inject } from '@angular/core';

// Reusable function that performs necessary cleanup tasks when a scope is destroyed.
export function untilDestroyed() {
  const subject = new Subject();

  inject(DestroyRef).onDestroy(() => {
    subject.next(true);
    subject.complete();
  });

  return <T>() => takeUntil<T>(subject.asObservable());
}
