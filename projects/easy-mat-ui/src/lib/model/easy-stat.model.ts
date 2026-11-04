/** Colour of the value of a `lib-easy-stat`. */
export type EasyStatTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

/** A key figure: a label and a value. */
export interface EasyStatConfig {
  label: string;
  value: string | number;
  /** Tooltip, for example the exact value when the shown one is rounded. */
  hint?: string;
  /** Material icon name. */
  icon?: string;
  /** Default: `neutral`. */
  tone?: EasyStatTone;
}
