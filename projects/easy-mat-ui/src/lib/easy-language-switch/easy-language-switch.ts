import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { EasyLanguage, EasyLanguageDisplay, EasyLanguageLayout } from '../model/easy-language-switch.model';

/**
 * Language picker. It knows nothing about ngx-translate or any other translation system: give it the languages and
 * the chosen code with `[(selected)]`, and change your language when `selectedChange` fires.
 *
 * - `layout="menu"`: one button that opens the list (default). `layout="inline"`: every language is a button.
 * - `display`: what each language shows, `flag-name` (default), `flag`, `name` or `code`.
 */
@Component({
  selector: 'lib-easy-language-switch',
  standalone: true,
  imports: [NgTemplateOutlet, MatMenuModule, MatIconModule],
  templateUrl: './easy-language-switch.html',
  styleUrls: ['./easy-language-switch.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EasyLanguageSwitch {
  @Input() languages: EasyLanguage[] = [];
  /** `code` of the chosen language. */
  @Input() selected: string | null = null;
  @Input() layout: EasyLanguageLayout = 'menu';
  @Input() display: EasyLanguageDisplay = 'flag-name';
  /** Accessible name of the control (for example "Choose the language"). */
  @Input() ariaLabel = '';

  @Output() selectedChange = new EventEmitter<string>();

  get current(): EasyLanguage | undefined {
    return this.languages.find((language) => language.code === this.selected) ?? this.languages[0];
  }

  get showFlag(): boolean {
    return this.display === 'flag-name' || this.display === 'flag';
  }

  /** The text of a language for the current `display`; empty when only the flag is shown. */
  text(language: EasyLanguage): string {
    switch (this.display) {
      case 'flag':
        return '';
      case 'code':
        return language.short ?? language.code.toUpperCase();
      default:
        return language.name;
    }
  }

  /** The text of a language in the open list: its name, whatever `display` says (a code alone would not help). */
  listText(language: EasyLanguage): string {
    return this.display === 'code' ? `${language.short ?? language.code.toUpperCase()} · ${language.name}` : language.name;
  }

  select(language: EasyLanguage): void {
    if (language.code === this.selected) return;
    this.selected = language.code;
    this.selectedChange.emit(language.code);
  }
}
