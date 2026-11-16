import {MatTableDataSource} from '@angular/material/table';
import {EasyTableConfig} from './easy-table-config.model';
import {MatColumnTyped} from './mat-column-typed.model';
import {EasyCsvParseResult} from '../utils/csv-parser';

export type EasyFileUploadOutputMode = 'easy-table' | 'easy-basic-table' | 'raw';
export type EasyFileUploadMode = 'button' | 'drag-drop' | 'both';
export type EasyFileUploadButtonAppearance = 'filled' | 'tonal' | 'outlined' | 'text';
export type EasyFileUploadButtonSize = 'small' | 'medium' | 'large';
export type EasyFileUploadDuplicateHandling = 'reject' | 'replace' | 'allow';
export type EasyFileUploadLayout = 'area' | 'field';
export type EasyFileUploadAppearance = 'outline' | 'filled' | 'flat';
export type EasyFileUploadStatus = 'idle' | 'processing' | 'success' | 'error';
export type EasyFileItemStatus = 'ready' | 'processing' | 'parsed' | 'error';
export type EasyFileUploadErrorCode =
  'type' | 'size' | 'max-files' | 'duplicate' | 'empty' | 'parse' | 'read' | 'required';

export interface EasyFileUploadError {
  code: EasyFileUploadErrorCode;
  message: string;
  fileName?: string;
}

export type EasyFileUploadMessages = Partial<Record<EasyFileUploadErrorCode, string>>;

export interface EasyFileItem {
  id: string;
  file: File;
  name: string;
  extension: string;
  size: number;
  type: string;
  status: EasyFileItemStatus;
  error?: string;
}

export interface EasyFileUploadTableOutput<T extends Record<string, any> = Record<string, any>> {
  config: EasyTableConfig<T>;
  dataSource: MatTableDataSource<T>;
  displayedColumns: MatColumnTyped[];
  childConfig?: EasyTableConfig<T>;
}

export interface EasyFileParsedFile<TOutput = any> {
  item: EasyFileItem;
  output: TOutput | null;
  csv: EasyCsvParseResult | null;
  delimiter: string | null;
  hasHeader: boolean | null;
  warnings: string[];
  errors: EasyFileUploadError[];
}

export interface EasyFileUploadResult<TOutput = any> {
  outputMode: EasyFileUploadOutputMode;
  status: EasyFileUploadStatus;
  files: EasyFileItem[];
  parsedFiles: EasyFileParsedFile<TOutput>[];
  outputs: TOutput[];
  output: TOutput | null;
  delimiter: string | null;
  hasHeader: boolean | null;
  errors: EasyFileUploadError[];
}
