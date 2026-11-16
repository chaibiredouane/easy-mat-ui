import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  inject,
  Input,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {NgTemplateOutlet} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {EasyTableConfig} from '../model/easy-table-config.model';
import {
  EasyFileItem,
  EasyFileParsedFile,
  EasyFileUploadAppearance,
  EasyFileUploadButtonAppearance,
  EasyFileUploadButtonSize,
  EasyFileUploadDuplicateHandling,
  EasyFileUploadError,
  EasyFileUploadErrorCode,
  EasyFileUploadLayout,
  EasyFileUploadMessages,
  EasyFileUploadMode,
  EasyFileUploadOutputMode,
  EasyFileUploadResult,
  EasyFileUploadStatus
} from '../model/easy-file-upload.model';
import {
  DEFAULT_FILE_UPLOAD_MESSAGES,
  EasyFileProcessingOptions,
  formatFileSize,
  getFileExtension,
  matchesAccept,
  processFile,
  resolveFileIcon
} from './easy-file-upload-processing';

let nextUploadId = 0;

@Component({
  selector: 'lib-easy-file-upload',
  standalone: true,
  imports: [NgTemplateOutlet, MatIconModule, MatProgressBarModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class]': 'hostClasses'},
  templateUrl: './easy-file-upload.html',
  styleUrl: './easy-file-upload.scss',
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => EasyFileUpload), multi: true},
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => EasyFileUpload), multi: true}
  ]
})
export class EasyFileUpload<TOutput = any> implements ControlValueAccessor, Validator {
  @Input() accept = '';
  @Input() multiple = false;
  @Input() maxFileSize: number | null = null;
  @Input() maxFiles: number | null = null;
  @Input() required = false;
  @Input() allowDragAndDrop = true;
  @Input() showFilePreview = true;
  @Input() showFileSize = true;
  @Input() showRemoveButton = true;
  @Input() showParseInfo = true;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() icon = 'cloud_upload';
  @Input() mode: EasyFileUploadMode | null = null;
  @Input() browseLabel = '';
  @Input() buttonIcon = '';
  @Input() buttonAppearance: EasyFileUploadButtonAppearance = 'tonal';
  @Input() buttonSize: EasyFileUploadButtonSize = 'medium';
  @Input() showDropArea = true;
  @Input() showButton = true;
  @Input() dropTitle = '';
  @Input() dropDescription = '';
  @Input() expanded = false;
  @Input() inline = false;
  @Input() showProgress = true;
  @Input() duplicates: EasyFileUploadDuplicateHandling = 'reject';
  @Input() customClass = '';
  @Input() appearance: EasyFileUploadAppearance = 'outline';
  @Input() layout: EasyFileUploadLayout = 'area';
  @Input() compact = false;
  @Input() inputHeight = '';
  @Input() minHeight = '';
  @Input() maxHeight = '';
  @Input() outputMode: EasyFileUploadOutputMode = 'raw';
  @Input() delimiter: string | 'auto' = 'auto';
  @Input() withHeader: boolean | 'auto' = 'auto';
  @Input() encoding: string | 'auto' = 'auto';
  @Input() parentColumn: string | null = null;
  @Input() tableConfig: Partial<EasyTableConfig> = {};
  @Input() parse = true;
  @Input() autoProcess = true;
  @Input() loading = false;
  @Input() messages: EasyFileUploadMessages = {};

  @Input() set disabled(value: boolean) {
    this.isDisabled = value;
  }

  @HostBinding('style.width') @Input() inputWidth = '';

  @Output() filesChange = new EventEmitter<EasyFileItem[]>();
  @Output() resultChange = new EventEmitter<EasyFileUploadResult<TOutput>>();
  @Output() fileRejected = new EventEmitter<EasyFileUploadError[]>();
  @Output() fileRemoved = new EventEmitter<EasyFileItem>();

  @ViewChild('fileInput', {static: true}) private fileInput!: ElementRef<HTMLInputElement>;

  readonly inputId = `easy-file-upload-${nextUploadId++}`;
  readonly hintId = `${this.inputId}-hint`;
  readonly errorsId = `${this.inputId}-errors`;
  readonly items = signal<EasyFileItem[]>([]);
  readonly parsedFiles = signal<EasyFileParsedFile<TOutput>[]>([]);
  readonly errors = signal<EasyFileUploadError[]>([]);
  readonly status = signal<EasyFileUploadStatus>('idle');
  readonly dragActive = signal(false);
  readonly touched = signal(false);

  isDisabled = false;

  private readonly changeDetector = inject(ChangeDetectorRef);
  private rejections: EasyFileUploadError[] = [];
  private fileSequence = 0;
  private processingRun = 0;
  private onChange: (value: File | File[] | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private onValidatorChange: () => void = () => undefined;

  get isBusy(): boolean {
    return this.loading || this.status() === 'processing';
  }

  get isInteractive(): boolean {
    return !this.isDisabled && !this.loading;
  }

  get hasRequiredError(): boolean {
    return this.required && this.touched() && this.items().length === 0;
  }

  get hasError(): boolean {
    return this.errors().length > 0 || this.hasRequiredError || this.status() === 'error';
  }

  get visibleErrors(): EasyFileUploadError[] {
    if (this.errors().length > 0) {
      return this.errors();
    }
    return this.hasRequiredError ? [{code: 'required', message: this.resolveMessage('required')}] : [];
  }

  get resolvedMode(): EasyFileUploadMode {
    const requestedMode = this.mode ?? (this.layout === 'field' ? 'both' : 'drag-drop');
    const hasDropArea = requestedMode !== 'button' && this.showDropArea;
    const hasButton = requestedMode !== 'drag-drop' && this.showButton;
    if (hasDropArea && hasButton) {
      return 'both';
    }
    return hasButton ? 'button' : 'drag-drop';
  }

  get showsDropArea(): boolean {
    return this.resolvedMode !== 'button';
  }

  get showsButton(): boolean {
    return this.resolvedMode !== 'drag-drop';
  }

  get acceptsDrops(): boolean {
    return this.showsDropArea && this.allowDragAndDrop;
  }

  get resolvedButtonLabel(): string {
    return this.browseLabel || (this.resolvedMode === 'button' ? (this.multiple ? 'Choose files' : 'Choose file') : 'Browse');
  }

  get resolvedButtonIcon(): string {
    return this.buttonIcon || (this.resolvedMode === 'button' ? 'upload_file' : '');
  }

  get resolvedDropTitle(): string {
    return this.dropTitle || this.resolvedPlaceholder;
  }

  get resolvedPlaceholder(): string {
    if (this.placeholder) {
      return this.placeholder;
    }
    if (this.acceptsDrops) {
      return this.multiple ? 'Drag & drop files here, or browse' : 'Drag & drop a file here, or browse';
    }
    return this.multiple ? 'Select files' : 'Select a file';
  }

  get constraintsSummary(): string {
    const parts: string[] = [];
    if (this.accept) {
      parts.push(this.accept.split(',').map(token => token.trim()).filter(Boolean).join(', '));
    }
    if (this.maxFileSize) {
      parts.push(`max ${formatFileSize(this.maxFileSize)}`);
    }
    if (this.multiple && this.maxFiles) {
      parts.push(`up to ${this.maxFiles} files`);
    }
    return parts.join(' · ');
  }

  get surfaceHeight(): string | null {
    return this.layout === 'area' ? this.inputHeight || null : null;
  }

  get surfaceMinHeight(): string | null {
    return this.minHeight || (this.layout === 'field' ? this.inputHeight || null : null);
  }

  get surfaceMaxHeight(): string | null {
    return this.maxHeight || null;
  }

  get hostClasses(): string {
    return [
      `layout-${this.layout}`,
      `mode-${this.resolvedMode}`,
      this.expanded && !this.compact ? 'expanded' : '',
      this.inline ? 'is-inline' : '',
      this.customClass,
      `appearance-${this.appearance}`,
      this.compact ? 'compact' : '',
      this.dragActive() ? 'drag-active' : '',
      this.hasError ? 'has-error' : '',
      this.status() === 'success' ? 'is-success' : '',
      this.isDisabled ? 'is-disabled' : '',
      this.isBusy ? 'is-busy' : ''
    ].filter(Boolean).join(' ');
  }

  open(): void {
    if (this.isInteractive) {
      this.fileInput.nativeElement.click();
    }
  }

  clear(): void {
    this.processingRun++;
    this.items.set([]);
    this.parsedFiles.set([]);
    this.rejections = [];
    this.errors.set([]);
    this.status.set('idle');
    this.fileInput.nativeElement.value = '';
    this.emitFiles();
    this.emitResult();
  }

  async process(): Promise<EasyFileUploadResult<TOutput>> {
    const run = ++this.processingRun;
    const itemsToProcess = this.items();
    if (itemsToProcess.length === 0) {
      this.status.set('idle');
      this.parsedFiles.set([]);
      return this.buildResult();
    }
    this.status.set('processing');
    this.updateItems(item => ({...item, status: 'processing', error: undefined}));
    const processingOptions = this.buildProcessingOptions();
    const parsedFiles = (await Promise.all(
      itemsToProcess.map(item => processFile(item, processingOptions))
    )) as EasyFileParsedFile<TOutput>[];
    if (run !== this.processingRun) {
      return this.buildResult();
    }
    this.updateItems(item => {
      const parsedFile = parsedFiles.find(candidate => candidate.item.id === item.id);
      const failure = parsedFile?.errors[0];
      return {...item, status: failure ? 'error' : 'parsed', error: failure?.message};
    });
    this.parsedFiles.set(parsedFiles.map(parsedFile => ({
      ...parsedFile,
      item: this.items().find(item => item.id === parsedFile.item.id) ?? parsedFile.item
    })));
    this.errors.set([...this.rejections, ...parsedFiles.flatMap(parsedFile => parsedFile.errors)]);
    this.status.set(parsedFiles.some(parsedFile => parsedFile.errors.length > 0) ? 'error' : 'success');
    const result = this.buildResult();
    this.emitResult(result);
    return result;
  }

  onZoneKey(event: Event): void {
    if (!this.showsButton) {
      event.preventDefault();
      this.open();
    }
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedFiles = Array.from(input.files ?? []);
    input.value = '';
    this.addFiles(selectedFiles);
  }

  onDragOver(event: DragEvent): void {
    if (!this.acceptsDrops || !this.isInteractive) {
      return;
    }
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    this.dragActive.set(true);
  }

  onDragLeave(event: DragEvent): void {
    const surface = event.currentTarget as HTMLElement;
    if (!surface.contains(event.relatedTarget as Node | null)) {
      this.dragActive.set(false);
    }
  }

  onDrop(event: DragEvent): void {
    if (!this.acceptsDrops || !this.isInteractive) {
      return;
    }
    event.preventDefault();
    this.dragActive.set(false);
    this.addFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  removeFile(item: EasyFileItem, event?: Event): void {
    event?.stopPropagation();
    if (!this.isInteractive) {
      return;
    }
    this.items.update(items => items.filter(candidate => candidate.id !== item.id));
    this.rejections = [];
    this.errors.set([]);
    this.fileRemoved.emit(item);
    this.emitFiles();
    this.markAsTouched();
    if (this.autoProcess && this.parse && this.items().length > 0) {
      void this.process();
    } else {
      this.processingRun++;
      this.parsedFiles.set([]);
      this.status.set('idle');
      this.emitResult();
    }
  }

  markAsTouched(): void {
    if (!this.touched()) {
      this.touched.set(true);
      this.onTouched();
      this.onValidatorChange();
    }
  }

  sizeLabel(item: EasyFileItem): string {
    return formatFileSize(item.size);
  }

  fileTooltip(item: EasyFileItem): string {
    return `${item.name}\n${item.type || 'unknown type'}\n${formatFileSize(item.size)}`;
  }

  parseInfo(item: EasyFileItem): {delimiter: string; header: string} | null {
    const parsedFile = this.parsedFiles().find(candidate => candidate.item.id === item.id);
    if (!parsedFile?.csv || parsedFile.errors.length > 0) {
      return null;
    }
    const delimiterName = {',': 'comma', ';': 'semicolon', '\t': 'tab', '|': 'pipe'}[parsedFile.csv.delimiter]
      ?? parsedFile.csv.delimiter;
    return {
      delimiter: `${delimiterName}${parsedFile.csv.delimiterDetected ? ' (auto)' : ''}`,
      header: `${parsedFile.csv.hasHeader ? 'header' : 'no header'}${parsedFile.csv.headerDetected ? ' (auto)' : ''}`
    };
  }

  iconFor(item: EasyFileItem): string {
    return resolveFileIcon(item);
  }

  writeValue(value: File | File[] | null): void {
    const files = value ? (Array.isArray(value) ? value : [value]) : [];
    this.processingRun++;
    this.items.set(files.map(file => this.createItem(file)));
    this.parsedFiles.set([]);
    this.rejections = [];
    this.errors.set([]);
    this.status.set('idle');
  }

  registerOnChange(onChange: (value: File | File[] | null) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  registerOnValidatorChange(onValidatorChange: () => void): void {
    this.onValidatorChange = onValidatorChange;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.changeDetector.markForCheck();
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    if (this.required && this.items().length === 0) {
      return {required: true};
    }
    return this.errors().length > 0 ? {fileUpload: this.errors().map(error => error.code)} : null;
  }

  private addFiles(selectedFiles: File[]): void {
    this.markAsTouched();
    if (selectedFiles.length === 0 || !this.isInteractive) {
      return;
    }
    const rejections: EasyFileUploadError[] = [];
    const acceptedItems: EasyFileItem[] = [];
    const baseItems = this.multiple
      ? this.items().filter(item => this.duplicates !== 'replace' || !selectedFiles.some(file => file.name === item.name))
      : [];
    const candidates = this.multiple ? selectedFiles : selectedFiles.slice(0, 1);
    if (!this.multiple && selectedFiles.length > 1) {
      rejections.push(this.createError('max-files', selectedFiles[1].name, 'only one file is allowed'));
    }

    for (const file of candidates) {
      const rejectionCode = this.findRejectionCode(file, [...baseItems, ...acceptedItems]);
      if (rejectionCode) {
        rejections.push(this.createError(rejectionCode, file.name));
      } else {
        acceptedItems.push(this.createItem(file));
      }
    }

    this.rejections = rejections;
    this.errors.set(rejections);
    if (rejections.length > 0) {
      this.fileRejected.emit(rejections);
    }
    if (acceptedItems.length === 0) {
      this.status.set(rejections.length > 0 ? 'error' : this.status());
      this.onValidatorChange();
      return;
    }
    this.items.set([...baseItems, ...acceptedItems]);
    this.parsedFiles.set([]);
    this.status.set('idle');
    this.emitFiles();
    if (this.autoProcess && this.parse) {
      void this.process();
    } else {
      this.emitResult();
    }
  }

  private findRejectionCode(file: File, existingItems: EasyFileItem[]): EasyFileUploadErrorCode | null {
    if (this.accept && !matchesAccept(file, this.accept)) {
      return 'type';
    }
    if (this.maxFileSize && file.size > this.maxFileSize) {
      return 'size';
    }
    if (this.duplicates === 'reject' && existingItems.some(item => item.name === file.name && item.size === file.size)) {
      return 'duplicate';
    }
    if (this.maxFiles && existingItems.length >= this.maxFiles) {
      return 'max-files';
    }
    return null;
  }

  private createItem(file: File): EasyFileItem {
    return {
      id: `${this.inputId}-file-${this.fileSequence++}`,
      file,
      name: file.name,
      extension: getFileExtension(file.name),
      size: file.size,
      type: file.type,
      status: 'ready'
    };
  }

  private createError(code: EasyFileUploadErrorCode, fileName: string, detail?: string): EasyFileUploadError {
    const message = this.resolveMessage(code);
    const limit = code === 'size' && this.maxFileSize ? ` (${formatFileSize(this.maxFileSize)})`
      : code === 'max-files' && this.maxFiles && this.multiple ? ` (${this.maxFiles})`
      : code === 'type' && this.accept ? ` (${this.accept})` : '';
    return {code, fileName, message: `${fileName}: ${detail ?? message}${detail ? '' : limit}`};
  }

  private resolveMessage(code: EasyFileUploadErrorCode): string {
    return this.messages[code] ?? DEFAULT_FILE_UPLOAD_MESSAGES[code];
  }

  private updateItems(transform: (item: EasyFileItem) => EasyFileItem): void {
    this.items.update(items => items.map(transform));
  }

  private buildProcessingOptions(): EasyFileProcessingOptions {
    return {
      outputMode: this.outputMode,
      delimiter: this.delimiter,
      withHeader: this.withHeader,
      encoding: this.encoding,
      parentColumn: this.parentColumn,
      tableConfig: this.tableConfig,
      messages: this.messages
    };
  }

  private buildResult(): EasyFileUploadResult<TOutput> {
    const parsedFiles = this.parsedFiles();
    const firstCsvFile = parsedFiles.find(parsedFile => parsedFile.csv);
    const outputs = parsedFiles
      .filter(parsedFile => parsedFile.errors.length === 0 && parsedFile.output !== null)
      .map(parsedFile => parsedFile.output as TOutput);
    return {
      outputMode: this.outputMode,
      status: this.status(),
      files: this.items(),
      parsedFiles,
      outputs,
      output: outputs[0] ?? null,
      delimiter: firstCsvFile?.delimiter ?? null,
      hasHeader: firstCsvFile?.hasHeader ?? null,
      errors: this.errors()
    };
  }

  private emitFiles(): void {
    this.filesChange.emit(this.items());
    const files = this.items().map(item => item.file);
    this.onChange(this.multiple ? files : files[0] ?? null);
    this.onValidatorChange();
  }

  private emitResult(result: EasyFileUploadResult<TOutput> = this.buildResult()): void {
    this.resultChange.emit(result);
  }
}
