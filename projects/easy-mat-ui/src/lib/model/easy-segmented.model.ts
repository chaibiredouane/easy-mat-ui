/** One choice of a `lib-easy-segmented`. */
export interface EasySegmentedOption {
  /** Value emitted when the option is chosen. */
  id: string;
  /** Text of the option. Optional when `iconOnly` is used, but then give a `hint`: it is the accessible name. */
  label?: string;
  /** Material icon name. */
  icon?: string;
  /** Tooltip. */
  hint?: string;
  disabled?: boolean;
}

/** `md` is 34px high, `lg` is 38px high. */
export type EasySegmentedSize = 'md' | 'lg';

/**
 * How assistive technologies see the control: `radio` for a choice among values (a setting),
 * `tab` for a list of pages (pair it with `panelId` and `idPrefix`).
 */
export type EasySegmentedSemantics = 'radio' | 'tab';
