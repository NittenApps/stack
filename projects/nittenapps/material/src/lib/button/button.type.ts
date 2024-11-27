import { Component, Type } from '@angular/core';
import { FieldType, StackFieldConfig } from '@nittenapps/forms';
import { StackFieldProps } from '../form-field';
import { IconDefinition } from '@fortawesome/angular-fontawesome';

interface ButtonProps extends StackFieldProps {
  icon?: string | IconDefinition;
  duotone?: boolean;
  onClick?: (field: StackFieldConfig, $event: Event) => void;
}

export interface StackButtonConfig extends StackFieldConfig<ButtonProps> {
  type: 'button' | Type<StackMatButton>;
}

@Component({
  selector: 'nas-field-mat-button',
  templateUrl: './button.type.html',
})
export class StackMatButton extends FieldType<StackButtonConfig> {
  get type(): string {
    if (typeof this.props.icon === 'string') {
      return 'string';
    }
    if (this.props.duotone) {
      return 'fad';
    }
    return 'fa';
  }

  onClick($event: Event) {
    this.props.onClick?.(this.field, $event);
  }
}
