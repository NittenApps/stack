export class NumberFormatService {
  private _specialKeys: Array<string> = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Enter',
    'Delete',
  ];

  isSpecialKey(event: KeyboardEvent): boolean {
    return (
      this._specialKeys.includes(event.key) ||
      ((event.ctrlKey || event.metaKey) && ['A', 'C', 'V', 'X'].includes(event.key.toUpperCase()))
    );
  }

  isCursorAtSamePlace(formElement: HTMLInputElement): boolean {
    return formElement.selectionStart === formElement.selectionEnd;
  }

  removeLeadingZero(value: string): string {
    if (!value) {
      return value;
    }

    return Number(value).toString();
  }

  removeComma(value: string): string {
    if (!value) {
      return value;
    }

    return value.replace(/,/g, '');
  }

  removeMinusSign(value: string): string {
    if (!value) {
      return value;
    }

    return value.replace(/-/g, '');
  }

  applyCommaFormat(value: string): string {
    if (!value) {
      return value;
    }

    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  autoFillDecimal(value: string, decimal: number, format: boolean): string {
    if (!value) {
      return value;
    }

    value = Number(this.removeComma(value)).toFixed(decimal).toString();
    if (format) {
      value = this.applyCommaFormat(value);
    }
    if (decimal > 0) {
      const values = value.split('.');
      value = values[0] + '.' + this.removeComma(values[1]);
    }
    return value;
  }

  getDecimalPart(value: string): string {
    if (!value) {
      return value;
    }

    let values = value.split('.');
    if (values.length > 1) {
      return `.${values[1]}`;
    }
    return '';
  }

  getNumericPart(value: string): string {
    if (!value) {
      return value;
    }

    return value.split('.')[0];
  }

  getRawValue(value: string): string {
    if (!value) {
      return value;
    }

    let rawValue: string;
    if (value === null || value.trim() === '') {
      rawValue = '';
    } else {
      rawValue = this.removeLeadingZero(this.removeComma(this.getNumericPart(value))) + this.getDecimalPart(value);
    }
    return rawValue;
  }

  getLastCharacterFromCursorAtFrontDirection(formElement: HTMLInputElement): string | null {
    if (formElement.selectionStart) {
      return formElement.value.substring(formElement.selectionStart - 1, formElement.selectionStart);
    }
    return null;
  }

  getLastCharacterFromCursorAtBackDirection(formElement: HTMLInputElement): string | null {
    if (formElement.selectionEnd) {
      return formElement.value.substring(formElement.selectionEnd, formElement.selectionEnd + 1);
    }
    return null;
  }

  detectComma(value: string): boolean {
    if (!value) {
      return false;
    }

    return value.indexOf(',') !== -1;
  }

  detectDecimalPoint(value: string): boolean {
    if (!value) {
      return false;
    }

    return value.indexOf('.') !== -1;
  }

  detectMinusSignOnFirst(value: string): boolean {
    if (!value) {
      return false;
    }

    return value.indexOf('-') == 0;
  }
}
