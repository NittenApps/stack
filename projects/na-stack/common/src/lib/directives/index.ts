import { Provider } from '@angular/core';
import { NumberFormatDirective } from './number-format/number-format.directive';
import { LowercaseDirective } from './lowercase/lowercase.directive';
import { NormalizeValueDirective } from './normalize-value/normalize-value.directive';
import { UppercaseDirective } from './uppercase/uppercase.directive';

export { LowercaseDirective, NormalizeValueDirective, NumberFormatDirective, UppercaseDirective };

export const COMMON_DIRECTIVES: Provider[] = [
  LowercaseDirective,
  NormalizeValueDirective,
  NumberFormatDirective,
  UppercaseDirective,
];
