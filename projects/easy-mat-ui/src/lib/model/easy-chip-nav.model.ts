/** One button of a `lib-easy-chip-nav`. */
export interface EasyChipNavItem {
  /** Value emitted when the button is chosen. */
  id: string;
  label: string;
  /** Material icon name. */
  icon?: string;
  /** Any CSS colour (`#b45309`, `var(--my-color)`...). Without it the button is neutral. */
  color?: string;
  /** Small number shown at the end of the button, for example how many elements it leads to. */
  count?: number;
  /** Tooltip. */
  hint?: string;
  disabled?: boolean;
}
