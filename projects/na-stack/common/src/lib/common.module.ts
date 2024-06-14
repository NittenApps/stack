import { NgModule } from '@angular/core';
import { COMMON_COMPONENTS } from './components';
import { COMMON_DIALOGS } from './dialogs';
import { COMMON_DIRECTIVES } from './directives';
import { COMMON_PIPES } from './pipes';

@NgModule({
  imports: [COMMON_COMPONENTS, COMMON_DIALOGS, COMMON_DIRECTIVES, COMMON_PIPES],
  exports: [COMMON_COMPONENTS, COMMON_DIALOGS, COMMON_DIRECTIVES, COMMON_PIPES],
})
export class CommonModule {}
