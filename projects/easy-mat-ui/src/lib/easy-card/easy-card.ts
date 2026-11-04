import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EasyCardAction, EasyCardActionEvent, EasyCardConfig } from '../model/easy-card.model';

/**
 * A card with an icon, a title, a description and optional actions. Anything placed inside the tag is shown under the
 * description. A card without actions can be `clickable`: the whole card is then one button.
 */
@Component({
  selector: 'lib-easy-card',
  standalone: true,
  imports: [NgTemplateOutlet, MatIconModule],
  templateUrl: './easy-card.html',
  styleUrls: ['./easy-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EasyCard {
  @Input({ required: true }) config!: EasyCardConfig;

  /** The whole card was used (only for a `clickable` card without actions). */
  @Output() cardClick = new EventEmitter<EasyCardConfig>();
  /** A button of the card was used. Links with an `href` are followed by the browser and do not emit. */
  @Output() actionClick = new EventEmitter<EasyCardActionEvent>();

  get isButton(): boolean {
    return !!this.config.clickable && !this.config.actions?.length;
  }

  use(action: EasyCardAction): void {
    if (!action.disabled) this.actionClick.emit({ card: this.config, action });
  }
}
