import { Component } from '@angular/core';
import { faCaretLeft, faCaretRight, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FieldArrayType, StackFieldConfig } from '@nittenapps/forms';
import { StackFieldProps } from '../form-field';

interface LogbookProps extends StackFieldProps {}

export interface LogbookConfig extends StackFieldConfig<LogbookProps> {}

@Component({
  selector: 'nas-mat-logbook',
  templateUrl: './logbook.type.html',
})
export class StackMatLogbook extends FieldArrayType<LogbookConfig> {
  current: number = 0;
  faCaretLeft = faCaretLeft;
  faCaretRight = faCaretRight;
  faPlus = faPlus;

  get length(): number {
    return this.model?.length || 0;
  }

  get readonly(): boolean {
    return !!this.props.readonly || !this.model || this.field.model.length < 1;
  }

  override add(): void {
    super.add(undefined, {});
  }

  next(): void {
    this.current++;
  }

  prev(): void {
    this.current--;
  }
}
