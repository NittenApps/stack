import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '../../directives';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/** @ignore */
@Component({
  selector: 'nas-template',
  template: '<div [innerHtml]="template"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackTemplateType extends FieldType {
  get template() {
    if (this.field && this.field.template !== this.innerHtml.template) {
      this.innerHtml = {
        template: this.field.template,
        content: this.props['safeHtml']
          ? this.sanitizer.bypassSecurityTrustHtml(this.field.template!)
          : this.field.template,
      };
    }

    return this.innerHtml.content;
  }

  private innerHtml: { content?: SafeHtml; template?: string } = {};

  constructor(private sanitizer: DomSanitizer) {
    super();
  }
}
