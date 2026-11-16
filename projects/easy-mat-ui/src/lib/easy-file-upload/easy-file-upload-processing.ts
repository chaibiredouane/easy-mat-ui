import {MatTableDataSource} from '@angular/material/table';
import {EasyTableConfig} from '../model/easy-table-config.model';
import {MatColumnTyped} from '../model/mat-column-typed.model';
import {
  EasyFileItem,
  EasyFileParsedFile,
  EasyFileUploadError,
  EasyFileUploadMessages,
  EasyFileUploadOutputMode,
  EasyFileUploadTableOutput
} from '../model/easy-file-upload.model';
import {EasyCsvParseResult, parseCsv} from '../utils/csv-parser';

export interface EasyFileProcessingOptions {
  outputMode: EasyFileUploadOutputMode;
  delimiter: string | 'auto';
  withHeader: boolean | 'auto';
  encoding: string | 'auto';
  parentColumn: string | null;
  tableConfig: Partial<EasyTableConfig>;
  messages: EasyFileUploadMessages;
}

export const DEFAULT_FILE_UPLOAD_MESSAGES: Required<EasyFileUploadMessages> = {
  type: 'File type not accepted',
  size: 'File exceeds the maximum size',
  'max-files': 'Maximum number of files reached',
  duplicate: 'File already selected',
  empty: 'The file is empty',
  parse: 'The file could not be parsed',
  read: 'The file could not be read',
  required: 'Please select a file'
};

const CSV_EXTENSIONS = ['csv', 'tsv'];
const JSON_EXTENSIONS = ['json'];
const TEXT_EXTENSIONS = ['txt', 'xml', 'md', 'log', 'yml', 'yaml', 'html'];
const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

export function getFileExtension(fileName: string): string {
  const separatorIndex = fileName.lastIndexOf('.');
  return separatorIndex > 0 ? fileName.slice(separatorIndex + 1).toLowerCase() : '';
}

export function formatFileSize(sizeInBytes: number): string {
  let value = sizeInBytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < BYTE_UNITS.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${unitIndex === 0 ? value : value.toFixed(value < 10 ? 1 : 0)} ${BYTE_UNITS[unitIndex]}`;
}

export function matchesAccept(file: File, accept: string): boolean {
  const acceptedTokens = accept.split(',').map(token => token.trim().toLowerCase()).filter(Boolean);
  if (acceptedTokens.length === 0) {
    return true;
  }
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  return acceptedTokens.some(token => {
    if (token.startsWith('.')) {
      return fileName.endsWith(token);
    }
    if (token.endsWith('/*')) {
      return fileType.startsWith(token.slice(0, -1));
    }
    return fileType === token;
  });
}

export function resolveFileIcon(item: EasyFileItem): string {
  const {extension, type} = item;
  if (CSV_EXTENSIONS.includes(extension) || ['xls', 'xlsx', 'ods'].includes(extension)) {
    return 'table_chart';
  }
  if (type.startsWith('image/')) {
    return 'image';
  }
  if (extension === 'pdf') {
    return 'picture_as_pdf';
  }
  if (['json', 'xml', 'yml', 'yaml', 'html'].includes(extension)) {
    return 'data_object';
  }
  if (['zip', 'rar', '7z', 'gz', 'tar'].includes(extension)) {
    return 'folder_zip';
  }
  if (type.startsWith('video/')) {
    return 'movie';
  }
  if (type.startsWith('audio/')) {
    return 'audio_file';
  }
  if (['doc', 'docx', 'odt', 'rtf', 'txt', 'md'].includes(extension)) {
    return 'description';
  }
  return 'draft';
}

async function decodeFileText(file: File, encoding: string): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  if (encoding !== 'auto') {
    return new TextDecoder(encoding).decode(buffer);
  }
  if (bytes[0] === 0xff && bytes[1] === 0xfe) {
    return new TextDecoder('utf-16le').decode(buffer);
  }
  if (bytes[0] === 0xfe && bytes[1] === 0xff) {
    return new TextDecoder('utf-16be').decode(buffer);
  }
  try {
    return new TextDecoder('utf-8', {fatal: true}).decode(buffer);
  } catch {
    return new TextDecoder('windows-1252').decode(buffer);
  }
}

function buildTableOutput(
  records: Record<string, any>[],
  headers: string[],
  fileName: string,
  options: EasyFileProcessingOptions
): EasyFileUploadTableOutput {
  const parentColumn = options.parentColumn && headers.includes(options.parentColumn) ? options.parentColumn : null;
  const toColumns = (names: string[]) => names.map(name => new MatColumnTyped({name, value: name}));
  const buildConfig = (columns: MatColumnTyped[], data: any[], source: string) => {
    const dataSource = new MatTableDataSource<any>(data);
    const config = new EasyTableConfig<any>({
      source,
      sortedBy: '',
      withHeader: true,
      ...options.tableConfig,
      data,
      dataSource,
      displayedColumns: columns
    });
    return {config, dataSource};
  };

  if (!parentColumn || options.outputMode !== 'easy-table') {
    const displayedColumns = toColumns(headers);
    const {config, dataSource} = buildConfig(displayedColumns, records, fileName);
    return {config, dataSource, displayedColumns};
  }

  const childrenByParent = new Map<string, Record<string, any>[]>();
  records.forEach(record => {
    const parentValue = String(record[parentColumn] ?? '');
    childrenByParent.set(parentValue, [...(childrenByParent.get(parentValue) ?? []), record]);
  });
  const parentRows = [...childrenByParent.entries()].map(([parentValue, children]) => ({
    [parentColumn]: parentValue,
    childCount: children.length,
    children
  }));
  const parentColumns = toColumns([parentColumn, 'childCount']);
  const childColumns = toColumns(headers.filter(header => header !== parentColumn));
  const parent = buildConfig(parentColumns, parentRows, fileName);
  parent.config.isExpanded = options.tableConfig.isExpanded ?? true;
  const child = buildConfig(childColumns, records, `${fileName} (${parentColumn})`);
  return {
    config: parent.config,
    dataSource: parent.dataSource,
    displayedColumns: parentColumns,
    childConfig: child.config
  };
}

function extractJsonRecords(parsedJson: unknown): {records: Record<string, any>[]; headers: string[]} | null {
  const candidateRows = Array.isArray(parsedJson) ? parsedJson : null;
  if (!candidateRows || !candidateRows.every(row => row !== null && typeof row === 'object' && !Array.isArray(row))) {
    return null;
  }
  const headers = [...new Set(candidateRows.flatMap(row => Object.keys(row)))];
  return {records: candidateRows, headers};
}

export async function processFile(
  item: EasyFileItem,
  options: EasyFileProcessingOptions
): Promise<EasyFileParsedFile> {
  const messages = {...DEFAULT_FILE_UPLOAD_MESSAGES, ...options.messages};
  const parsedFile: EasyFileParsedFile = {
    item,
    output: null,
    csv: null,
    delimiter: null,
    hasHeader: null,
    warnings: [],
    errors: []
  };
  const failWith = (code: EasyFileUploadError['code'], detail?: string): EasyFileParsedFile => {
    parsedFile.errors.push({
      code,
      fileName: item.name,
      message: detail ? `${messages[code]}: ${detail}` : messages[code]
    });
    return parsedFile;
  };

  if (item.size === 0) {
    return failWith('empty');
  }

  const isCsv = CSV_EXTENSIONS.includes(item.extension) || item.type === 'text/csv';
  const isJson = JSON_EXTENSIONS.includes(item.extension) || item.type === 'application/json';
  const isText = isCsv || isJson || TEXT_EXTENSIONS.includes(item.extension) || item.type.startsWith('text/');
  const isTableMode = options.outputMode !== 'raw';

  if (!isText) {
    if (isTableMode) {
      return failWith('parse', `.${item.extension || 'unknown'} cannot be converted to a table`);
    }
    try {
      parsedFile.output = await item.file.arrayBuffer();
      return parsedFile;
    } catch {
      return failWith('read');
    }
  }

  let text: string;
  try {
    text = await decodeFileText(item.file, options.encoding);
  } catch {
    return failWith('read');
  }

  if (isCsv) {
    const delimiter = item.extension === 'tsv' && options.delimiter === 'auto' ? '\t' : options.delimiter;
    const csv: EasyCsvParseResult = parseCsv(text, {delimiter, withHeader: options.withHeader});
    parsedFile.csv = csv;
    parsedFile.delimiter = csv.delimiter;
    parsedFile.hasHeader = csv.hasHeader;
    parsedFile.warnings = csv.warnings;
    csv.errors.forEach(detail => failWith('parse', detail));
    if (csv.errors.length > 0) {
      return parsedFile;
    }
    parsedFile.output = isTableMode ? buildTableOutput(csv.records, csv.headers, item.name, options) : csv;
    return parsedFile;
  }

  if (isJson) {
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(text);
    } catch (error) {
      return failWith('parse', (error as Error).message);
    }
    if (!isTableMode) {
      parsedFile.output = parsedJson;
      return parsedFile;
    }
    const tableData = extractJsonRecords(parsedJson);
    if (!tableData) {
      return failWith('parse', 'expected a JSON array of objects');
    }
    parsedFile.output = buildTableOutput(tableData.records, tableData.headers, item.name, options);
    return parsedFile;
  }

  if (isTableMode) {
    return failWith('parse', `.${item.extension || 'unknown'} cannot be converted to a table`);
  }
  parsedFile.output = text;
  return parsedFile;
}
