/** A button or a link at the bottom of a `lib-easy-card`. */
export interface EasyCardAction {
  /** Identifies the action in the `actionClick` event. */
  id: string;
  label: string;
  /** Material icon name. */
  icon?: string;
  /** With an address the action is a link, without it a button. */
  href?: string;
  /** Where a link opens, `_blank` for a new tab. */
  target?: string;
  /** Filled with the accent colour instead of outlined. */
  primary?: boolean;
  disabled?: boolean;
}

/** Content of a `lib-easy-card`. */
export interface EasyCardConfig {
  /** Identifies the card in the events. */
  id?: string;
  /** Material icon name. */
  icon?: string;
  title: string;
  description?: string;
  /** Any CSS colour for the icon. Default: the accent colour of the theme. */
  color?: string;
  actions?: EasyCardAction[];
  /** The whole card is a button (it emits `cardClick`). Ignored when the card has actions. */
  clickable?: boolean;
  /** For a clickable card: a short invitation at the bottom, shown with an arrow ("Try it"). */
  cta?: string;
}

/** Emitted when an action of a card is used. */
export interface EasyCardActionEvent {
  card: EasyCardConfig;
  action: EasyCardAction;
}
