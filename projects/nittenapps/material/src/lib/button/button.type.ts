import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FieldType } from '@nittenapps/forms';

@Component({
  selector: 'nas-field-mat-button',
  templateUrl: './button.type.html',
})
export class StackFieldButton extends FieldType {
  @ViewChild('icon') set icon(icon: TemplateRef<any>) {
    if (icon) {
      this.props['icon'] = icon;
    }
  }

  onClick($event: Event) {
    if (this.props['onClick']) {
      this.props['onClick']($event);
    }
  }
}
