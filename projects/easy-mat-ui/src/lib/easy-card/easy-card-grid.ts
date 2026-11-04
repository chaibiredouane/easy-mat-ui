import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EasyCardActionEvent, EasyCardConfig } from '../model/easy-card.model';
import { EasyCard } from './easy-card';

/**
 * Cards in a responsive grid: as many columns as fit, each at least `minWidth` wide. Pass `columns` instead to get a
 * fixed number of columns on wide screens (the grid still falls back to fewer columns when the screen is narrow).
 */
@Component({
  selector: 'lib-easy-card-grid',
  standalone: true,
  imports: [EasyCard],
  template: `
    <div class="grid" [style.--min]="minWidth + 'px'" [style.--columns]="columns || null" [class.fixed]="!!columns">
      @for (item of items; track item.id ?? item.title) {
        <lib-easy-card [config]="item" (cardClick)="cardClick.emit($event)" (actionClick)="actionClick.emit($event)" />
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(var(--min, 240px), 100%), 1fr));
      gap: 14px;
    }

    @media (min-width: 900px) {
      .grid.fixed {
        grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EasyCardGrid {
  @Input() items: EasyCardConfig[] = [];
  /** Narrowest a card may become, in pixels (default 240). */
  @Input() minWidth = 240;
  /** Fixed number of columns from 900px of width. */
  @Input() columns: number | null = null;

  @Output() cardClick = new EventEmitter<EasyCardConfig>();
  @Output() actionClick = new EventEmitter<EasyCardActionEvent>();
}
