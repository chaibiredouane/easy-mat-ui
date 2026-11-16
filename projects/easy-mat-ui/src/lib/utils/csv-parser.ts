export interface EasyCsvParseOptions {
  delimiter?: string | 'auto';
  withHeader?: boolean | 'auto';
}

export interface EasyCsvParseResult {
  delimiter: string;
  hasHeader: boolean;
  headerDetected: boolean;
  delimiterDetected: boolean;
  headers: string[];
  rows: string[][];
  records: Record<string, string>[];
  rowCount: number;
  columnCount: number;
  warnings: string[];
  errors: string[];
}

const CANDIDATE_DELIMITERS = [';', ',', '\t', '|'];
const DETECTION_SAMPLE_LENGTH = 65536;
const NUMERIC_PATTERN = /^[-+]?(\d+([.,]\d+)?|[.,]\d+)([eE][-+]?\d+)?%?$/;

interface RowsParsing {
  rows: string[][];
  errors: string[];
}

export function stripByteOrderMark(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

export function parseCsvRows(text: string, delimiter: string): RowsParsing {
  const rows: string[][] = [];
  const errors: string[] = [];
  let currentRow: string[] = [];
  let currentValue = '';
  let insideQuotes = false;
  let quoteStartLine = 0;
  let currentLine = 1;
  let valueWasQuoted = false;

  const endValue = (): void => {
    currentRow.push(currentValue);
    currentValue = '';
    valueWasQuoted = false;
  };
  const endRow = (): void => {
    const lastValueWasQuoted = valueWasQuoted;
    endValue();
    const isBlankLine = currentRow.length === 1 && currentRow[0].trim() === '' && !lastValueWasQuoted;
    if (!isBlankLine) {
      rows.push(currentRow);
    }
    currentRow = [];
  };

  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (insideQuotes) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          currentValue += '"';
          index++;
        } else {
          insideQuotes = false;
        }
      } else {
        if (character === '\n') {
          currentLine++;
        }
        currentValue += character;
      }
      continue;
    }
    if (character === '"' && currentValue === '' && !valueWasQuoted) {
      insideQuotes = true;
      valueWasQuoted = true;
      quoteStartLine = currentLine;
    } else if (character === delimiter) {
      endValue();
    } else if (character === '\r' || character === '\n') {
      if (character === '\r' && text[index + 1] === '\n') {
        index++;
      }
      endRow();
      currentLine++;
    } else {
      currentValue += character;
    }
  }

  if (insideQuotes) {
    errors.push(`Unterminated quoted value starting on line ${quoteStartLine}`);
  }
  if (currentValue !== '' || currentRow.length > 0 || valueWasQuoted) {
    endRow();
  }
  return {rows, errors};
}

export function detectCsvDelimiter(text: string): string | null {
  const sample = text.slice(0, DETECTION_SAMPLE_LENGTH);
  let bestDelimiter: string | null = null;
  let bestConsistency = 0;
  let bestColumnCount = 0;

  for (const candidate of CANDIDATE_DELIMITERS) {
    const {rows} = parseCsvRows(sample, candidate);
    const sampledRows = rows.slice(0, 50);
    if (sampledRows.length === 0) {
      continue;
    }
    const occurrences = new Map<number, number>();
    sampledRows.forEach(row => occurrences.set(row.length, (occurrences.get(row.length) ?? 0) + 1));
    const [modalColumnCount, modalOccurrences] = [...occurrences.entries()].reduce(
      (best, entry) => (entry[1] > best[1] || (entry[1] === best[1] && entry[0] > best[0]) ? entry : best)
    );
    if (modalColumnCount < 2) {
      continue;
    }
    const consistency = modalOccurrences / sampledRows.length;
    if (consistency > bestConsistency || (consistency === bestConsistency && modalColumnCount > bestColumnCount)) {
      bestDelimiter = candidate;
      bestConsistency = consistency;
      bestColumnCount = modalColumnCount;
    }
  }
  return bestDelimiter;
}

function isNumericValue(value: string): boolean {
  return NUMERIC_PATTERN.test(value.trim());
}

export function detectCsvHeader(rows: string[][]): boolean {
  if (rows.length < 2) {
    return false;
  }
  const firstRow = rows[0].map(value => value.trim());
  if (firstRow.some(value => value === '' || isNumericValue(value))) {
    return false;
  }
  const bodyRows = rows.slice(1, 51);
  const hasNumericColumnUnderHeader = firstRow.some((_, columnIndex) => {
    const values = bodyRows.map(row => (row[columnIndex] ?? '').trim()).filter(value => value !== '');
    return values.length > 0 && values.every(isNumericValue);
  });
  if (hasNumericColumnUnderHeader) {
    return true;
  }
  const firstRowRepeatedInBody = bodyRows.some(
    row => row.length === firstRow.length && row.every((value, index) => value.trim() === firstRow[index])
  );
  return !firstRowRepeatedInBody && new Set(firstRow.map(value => value.toLowerCase())).size === firstRow.length;
}

function buildUniqueHeaders(rawHeaders: string[], columnCount: number): string[] {
  const usedHeaders = new Set<string>();
  return Array.from({length: columnCount}, (_, columnIndex) => {
    const baseHeader = (rawHeaders[columnIndex] ?? '').trim() || `column_${columnIndex + 1}`;
    let header = baseHeader;
    for (let suffix = 2; usedHeaders.has(header); suffix++) {
      header = `${baseHeader}_${suffix}`;
    }
    usedHeaders.add(header);
    return header;
  });
}

export function parseCsv(content: string, options: EasyCsvParseOptions = {}): EasyCsvParseResult {
  const text = stripByteOrderMark(content);
  const requestedDelimiter = options.delimiter ?? 'auto';
  const delimiterDetected = requestedDelimiter === 'auto';
  const delimiter = delimiterDetected ? detectCsvDelimiter(text) ?? ',' : requestedDelimiter;
  const {rows: parsedRows, errors} = parseCsvRows(text, delimiter);
  const warnings: string[] = [];

  if (parsedRows.length === 0 && errors.length === 0) {
    errors.push('The file does not contain any data');
  }

  const columnCount = parsedRows.reduce((maximum, row) => Math.max(maximum, row.length), 0);
  const rows = parsedRows.map((row, rowIndex) => {
    if (row.length !== columnCount) {
      warnings.push(`Row ${rowIndex + 1} has ${row.length} columns instead of ${columnCount}`);
    }
    return Array.from({length: columnCount}, (_, columnIndex) => row[columnIndex] ?? '');
  });

  const headerDetected = options.withHeader === undefined || options.withHeader === 'auto';
  const hasHeader = headerDetected ? detectCsvHeader(rows) : options.withHeader === true;
  const headers = buildUniqueHeaders(hasHeader ? rows[0] ?? [] : [], columnCount);
  const bodyRows = hasHeader ? rows.slice(1) : rows;
  const records = bodyRows.map(row =>
    headers.reduce<Record<string, string>>((record, header, columnIndex) => {
      record[header] = row[columnIndex];
      return record;
    }, {})
  );

  return {
    delimiter,
    hasHeader,
    headerDetected,
    delimiterDetected,
    headers,
    rows: bodyRows,
    records,
    rowCount: bodyRows.length,
    columnCount,
    warnings,
    errors
  };
}
