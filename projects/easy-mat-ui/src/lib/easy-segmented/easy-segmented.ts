import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EasySegmentedOption, EasySegmentedSemantics, EasySegmentedSize } from '../model/easy-segmented.model';

/**
 * A small group of buttons of which exactly one is chosen: a setting (units, theme) or the pages of an application.
 * Use `[(selected)]` to bind the chosen `id`. Arrow keys, Home and End move the choice, as in any radio group or tab list.
 */
@Component({
  selector: 'lib-easy-segmented',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './easy-segmented.html',
  styleUrls: ['./easy-segmented.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EasySegmented {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly direction = inject(Directionality, { optional: true });

  @Input() options: EasySegmentedOption[] = [];
  /** `id` of the chosen option. */
  @Input() selected: string | null = null;
  /** Accessible name of the group. */
  @Input() ariaLabel = '';
  @Input() size: EasySegmentedSize = 'md';
  /** Show only the icons. The `hint` (or the label) stays as tooltip and accessible name. */
  @Input() iconOnly = false;
  /** Below 600px only the chosen option keeps its text: the others become icons. */
  @Input() collapseInactive = false;
  /** The group takes the whole width of its container. */
  @Input() stretch = false;
  /** `tab` for pages (the group then needs `panelId`), `radio` for a setting. */
  @Input() semantics: EasySegmentedSemantics = 'radio';
  /** With `semantics="tab"`: id of the element that shows the chosen page. */
  @Input() panelId = '';
  /** With `semantics="tab"`: prefix of the id of each button (`idPrefix + option.id`), so a panel can point to its tab. */
  @Input() idPrefix = '';

  @Output() selectedChange = new EventEmitter<string>();

  /** Only one button is reachable with the Tab key: the chosen one, or the first one when nothing is chosen. */
  get tabStopId(): string | null {
    const enabled = this.options.filter((option) => !option.disabled);
    return enabled.find((option) => option.id === this.selected)?.id ?? enabled[0]?.id ?? null;
  }

  select(option: EasySegmentedOption): void {
    if (option.disabled || option.id === this.selected) return;
    this.selected = option.id;
    this.selectedChange.emit(option.id);
  }

  onKeydown(event: KeyboardEvent): void {
    const enabled = this.options.filter((option) => !option.disabled);
    if (!enabled.length) return;

    const rtl = this.direction?.value === 'rtl';
    const current = Math.max(0, enabled.findIndex((option) => option.id === this.selected));
    let target: number;
    switch (event.key) {
      case 'ArrowRight':
        target = current + (rtl ? -1 : 1);
        break;
      case 'ArrowLeft':
        target = current + (rtl ? 1 : -1);
        break;
      case 'ArrowDown':
        target = current + 1;
        break;
      case 'ArrowUp':
        target = current - 1;
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = enabled.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    target = (target + enabled.length) % enabled.length;
    this.select(enabled[target]);
    this.host.nativeElement.querySelectorAll<HTMLButtonElement>('button:not([disabled])')[target]?.focus();
  }
}
