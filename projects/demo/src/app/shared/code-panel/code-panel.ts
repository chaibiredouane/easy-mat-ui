import { Component, computed, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SOURCES } from '../../generated/sources';

/** Collapsible panel showing the real source files of a page (HTML, config, TypeScript, SCSS). */
@Component({
  selector: 'app-code-panel',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './code-panel.html',
  styleUrl: './code-panel.scss'
})
export class CodePanel {
  /** Folder of the page, e.g. `pages/countries`; files are found by naming convention. */
  folder = input.required<string>();
  open = signal(false);
  active = signal(0);
  copied = signal(false);

  readonly files = computed(() => {
    const name = this.folder().split('/').pop()!;
    // `kind` selects the tooltip in the dictionary (`code.config`, `code.html`, ...).
    return [
      { label: `${name}.config.ts`, kind: 'config', key: `${this.folder()}/${name}.config.ts` },
      { label: `${name}.html`, kind: 'html', key: `${this.folder()}/${name}.html` },
      { label: `${name}.ts`, kind: 'ts', key: `${this.folder()}/${name}.ts` },
      { label: `${name}.scss`, kind: 'scss', key: `${this.folder()}/${name}.scss` }
    ].filter((f) => SOURCES[f.key] !== undefined);
  });

  readonly code = computed(() => SOURCES[this.files()[this.active()]?.key] ?? '');
  readonly lines = computed(() => this.code().split('\n').length);

  async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      /* clipboard unavailable (insecure context): the text remains selectable */
    }
  }
}
