import { Component, signal } from '@angular/core';
import { Toolbox } from './toolbox';
import { Users } from './users-table';

/** Two examples of easy-mat-ui-ng20, one at a time: open users-table.ts or toolbox.ts to read the code. */
@Component({
  selector: 'app-root',
  imports: [Users, Toolbox],
  template: `
    <main>
      <h1>Easy Mat UI starter</h1>
      <p>
        Angular 20 and <a href="https://github.com/chaibiredouane/easy-mat-ui" target="_blank" rel="noopener">easy-mat-ui-ng20</a>.
        Edit <code>src/app/users-table.ts</code> and watch the table change.
      </p>
      <nav aria-label="Examples">
        <button type="button" [class.active]="view() === 'table'" (click)="view.set('table')">Data table</button>
        <button type="button" [class.active]="view() === 'toolbox'" (click)="view.set('toolbox')">Reusable components</button>
      </nav>
      @if (view() === 'table') {
        <app-users />
      } @else {
        <app-toolbox />
      }
    </main>
  `,
  styles: `
    main { max-width: 1100px; margin: 0 auto; padding: 16px; }
    nav { display: flex; gap: 8px; margin: 16px 0; }
    button { font: inherit; padding: 8px 16px; border: 1px solid currentColor; border-radius: 999px; background: none; color: inherit; cursor: pointer; }
    button.active { background: CanvasText; color: Canvas; }
  `
})
export class App {
  readonly view = signal<'table' | 'toolbox'>('table');
}
