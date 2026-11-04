import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EasyChipNavItem } from '../model/easy-chip-nav.model';

/**
 * A row of buttons with an icon, a colour and a count, to browse by category (continents, departments, statuses...).
 * Use `[(selected)]` to bind the chosen `id`. On a phone the row scrolls sideways instead of taking several lines.
 */
@Component({
  selector: 'lib-easy-chip-nav',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './easy-chip-nav.html',
  styleUrls: ['./easy-chip-nav.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EasyChipNav {
  @Input() items: EasyChipNavItem[] = [];
  /** `id` of the chosen item. */
  @Input() selected: string | null = null;
  /** Accessible name of the navigation. */
  @Input() ariaLabel = '';

  @Output() selectedChange = new EventEmitter<string>();

  select(item: EasyChipNavItem): void {
    if (item.disabled || item.id === this.selected) return;
    this.selected = item.id;
    this.selectedChange.emit(item.id);
  }
}
