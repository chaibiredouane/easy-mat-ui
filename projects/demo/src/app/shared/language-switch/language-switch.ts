import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageCode } from '../../i18n/languages';
import { LanguageService } from '../../services/language.service';

/** Language menu: the flag and the name of each language, written in that language. */
@Component({
  selector: 'app-language-switch',
  imports: [MatMenuModule, MatIconModule, TranslatePipe],
  templateUrl: './language-switch.html',
  styleUrl: './language-switch.scss'
})
export class LanguageSwitch {
  readonly lang = inject(LanguageService);

  choose(code: LanguageCode): void {
    this.lang.set(code);
  }
}
