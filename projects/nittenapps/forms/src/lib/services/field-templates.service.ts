import { Injectable, QueryList } from '@angular/core';
import { StackFormTemplate } from '../directives';

// workarround for https://github.com/angular/angular/issues/43227#issuecomment-904173738
@Injectable()
export class StackFieldTemplates {
  templates!: QueryList<StackFormTemplate>;
}
