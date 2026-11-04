/** One language of a `lib-easy-language-switch`. */
export interface EasyLanguage {
  /** Value emitted when the language is chosen (`en`, `fr`, `ar`...). */
  code: string;
  /** Name of the language written in that language: it is what the visitor looks for. */
  name: string;
  /** Flag as a `flag-icons` suffix (`gb` gives the classes `fi fi-gb`). Needs the optional `flag-icons` stylesheet. */
  flag?: string;
  /** Flag as an image, when you do not use `flag-icons`. */
  flagUrl?: string;
  /** Short text for the `code` display. Default: the code in capital letters. */
  short?: string;
}

/** `menu` is a button that opens a list, `inline` shows every language at once. */
export type EasyLanguageLayout = 'menu' | 'inline';

/** What the button of each language shows. */
export type EasyLanguageDisplay = 'flag-name' | 'flag' | 'name' | 'code';
