import {formatDate} from '@angular/common';


export class Utils {
  public static slice_size: number;
  public static screen_size: number;


  static isNullOrEmpty(value: string): boolean {
    return !value || value?.toString()?.trim() == '';
  }


  public static areValuesEqual(val1: any, val2: any): boolean {
    if (val1 === null || val1 === undefined || val1 === '') {
      return val2 === null || val2 === undefined || val2 === '';
    }
    if (val2 === null || val2 === undefined || val2 === '') {
      return val1 === null || val1 === undefined || val1 === '';
    }

    const num1 = Number(val1);
    const num2 = Number(val2);

    if (!isNaN(num1) && !isNaN(num2)) {
      return num1 === num2;
    }

    return val1 === val2;
  }

  static identifyDuplicates(
    data: Record<string, any>[],
    key: string,
    getUnique: boolean = true
  ): Record<string, any>[] {
    const uniqueMap = new Map<any, Record<string, any>>();
    const duplicates: Record<string, any>[] = [];

    data?.forEach(item => {
      const keyValue = item[key];
      if (uniqueMap.has(keyValue)) {
        duplicates.push(item);
      } else {
        uniqueMap.set(keyValue, item);
      }
    });

    return getUnique ? Array.from(uniqueMap.values()) : duplicates;
  }


  public static getUnique(data: Object[], key: string) {
    return this.identifyDuplicates(data, key);
  }

  public static getDuplicate(data: Object[], key: string) {
    return this.identifyDuplicates(data, key, false);
  }


  static safeCompare(a: any, b: any): number {
    const aStr = a != null ? String(a) : '';
    const bStr = b != null ? String(b) : '';
    return aStr.localeCompare(bStr);
  }

}
