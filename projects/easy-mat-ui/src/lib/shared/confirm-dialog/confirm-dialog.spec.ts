import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { confirmAction, confirmChoice } from './confirm-dialog';

describe('confirm dialog helpers', () => {
  const data = { title: 'title', message: 'message', confirm: 'confirm', cancel: 'cancel' };

  function injectorClosingWith(result: boolean | string | undefined): Injector {
    const dialog = { open: () => ({ afterClosed: () => of(result) }) };
    TestBed.configureTestingModule({ providers: [{ provide: MatDialog, useValue: dialog }] });
    return TestBed.inject(Injector);
  }

  it('should resolve confirmAction to true only when confirmed', () => {
    const results: boolean[] = [];
    confirmAction(injectorClosingWith(true), data).subscribe(result => results.push(result));

    expect(results).toEqual([true]);
  });

  it('should resolve confirmAction to false for a cancel or a choice', () => {
    const results: boolean[] = [];
    confirmAction(injectorClosingWith('merge'), data).subscribe(result => results.push(result));

    expect(results).toEqual([false]);
  });

  it('should resolve confirmChoice to the chosen value', () => {
    const results: (string | null)[] = [];
    confirmChoice(injectorClosingWith('overwrite'), data).subscribe(result => results.push(result));

    expect(results).toEqual(['overwrite']);
  });

  it('should resolve confirmChoice to null when cancelled', () => {
    const results: (string | null)[] = [];
    confirmChoice(injectorClosingWith(false), data).subscribe(result => results.push(result));

    expect(results).toEqual([null]);
  });
});
