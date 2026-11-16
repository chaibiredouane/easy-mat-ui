import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { EasyFileUpload, EasyFileUploadError, EasyFileUploadResult, EasyFileUploadTableOutput, EasyPageHeader, EasyTableBasicComponent, EasyTableConfig } from 'easy-mat-ui';
import { CodePanel } from '../../shared/code-panel/code-panel';

const SAMPLE_CSV = 'country,capital,population\nAlgeria,Algiers,45000000\nFrance,Paris,68000000\nLuxembourg,Luxembourg,660000\n';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-upload',
  imports: [EasyFileUpload, EasyTableBasicComponent, EasyPageHeader, CodePanel, TranslatePipe],
  templateUrl: './upload.html',
  styleUrl: './upload.scss'
})
export class Upload {
  readonly parsedTable = signal<EasyTableConfig | null>(null);
  readonly rejected = signal<string[]>([]);
  readonly rawFileNames = signal<string[]>([]);
  readonly sampleUrl = URL.createObjectURL(new Blob([SAMPLE_CSV], { type: 'text/csv' }));

  onParsed(result: EasyFileUploadResult<EasyFileUploadTableOutput>): void {
    this.parsedTable.set(result.output?.config ?? null);
  }

  onRejected(errors: EasyFileUploadError[]): void {
    this.rejected.set(errors.map((error) => error.message));
  }

  onRaw(result: EasyFileUploadResult): void {
    this.rawFileNames.set(result.files.map((file) => file.name));
  }
}
