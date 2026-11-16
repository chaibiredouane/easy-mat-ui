import {detectCsvDelimiter, parseCsv} from './csv-parser';

describe('csv-parser', () => {
  it('detects semicolon and ignores delimiters inside quotes', () => {
    const result = parseCsv('﻿name;age;city\r\nAnn;30;"Paris; FR"\r\nBob;25;Rome\r\n');
    expect(result.delimiter).toBe(';');
    expect(result.hasHeader).toBeTrue();
    expect(result.headers).toEqual(['name', 'age', 'city']);
    expect(result.rows[0]).toEqual(['Ann', '30', 'Paris; FR']);
  });

  it('handles escaped quotes, empty cells and multiline values', () => {
    const result = parseCsv('id,note\n1,"He said ""hi"", ok"\n2,\n3,"a\nb"');
    expect(result.records).toEqual([
      {id: '1', note: 'He said "hi", ok'},
      {id: '2', note: ''},
      {id: '3', note: 'a\nb'}
    ]);
  });

  it('detects tab and pipe delimiters and keeps decimal commas intact', () => {
    expect(detectCsvDelimiter('a\tb\n1\t2')).toBe('\t');
    expect(detectCsvDelimiter('a|b\n1|2')).toBe('|');
    expect(parseCsv('x;y\n1,5;2,5\n3,5;4,5').rows[0]).toEqual(['1,5', '2,5']);
  });

  it('detects a missing header and generates column names', () => {
    const result = parseCsv('1,2,3\n4,5,6');
    expect(result.hasHeader).toBeFalse();
    expect(result.headers).toEqual(['column_1', 'column_2', 'column_3']);
    expect(result.rowCount).toBe(2);
  });

  it('lets the caller override header detection and delimiter', () => {
    const result = parseCsv('1;2\n3;4', {withHeader: true, delimiter: ';'});
    expect(result.headerDetected).toBeFalse();
    expect(result.delimiterDetected).toBeFalse();
    expect(result.headers).toEqual(['1', '2']);
  });

  it('reports unterminated quotes and empty content', () => {
    expect(parseCsv('a,b\n"oops,1').errors.length).toBe(1);
    expect(parseCsv('').errors.length).toBe(1);
  });

  it('supports every line ending', () => {
    expect(parseCsv('a;b\r1;2\r3;4').rowCount).toBe(2);
    expect(parseCsv('a;b\n1;2\n3;4').rowCount).toBe(2);
  });
});
