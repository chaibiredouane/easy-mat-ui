import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EasyCardActionEvent, EasyCardConfig } from '../model/easy-card.model';
import { EasyCard } from './easy-card';

/**
 * Cards in a responsive grid: as many columns as fit, each at least `minWidth` wide, and never more than `columns`.
 * The grid adapts to its own width, so it behaves the same in a narrow panel and in a wide page.
 */
@Component({
  selector: 'lib-easy-card-grid',
  standalone: true,
  imports: [EasyCard],
  template: `
    <div class="grid" [style.--min]="minWidth + 'px'" [style.--columns]="columns">
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
      --gap: 14px;

      display: grid;
      gap: var(--gap);
      /* At least --min wide, and wide enough that there are never more than --columns of them in a row. */
      grid-template-columns: repeat(
        auto-fit,
        minmax(max(min(var(--min, 240px), 100%), calc((100% - (var(--columns, 12) - 1) * var(--gap)) / var(--columns, 12))), 1fr)
      );
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EasyCardGrid {
  @Input() items: EasyCardConfig[] = [];
  /** Narrowest a card may become, in pixels (default 240). */
  @Input() minWidth = 240;
  /** Most columns in a row (default 12, in practice "as many as fit"). */
  @Input() columns = 12;

  @Output() cardClick = new EventEmitter<EasyCardConfig>();
  @Output() actionClick = new EventEmitter<EasyCardActionEvent>();
}
