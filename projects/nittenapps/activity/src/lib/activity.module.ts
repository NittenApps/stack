import { NgModule } from '@angular/core';
import { ACTIVITY_COMPONENTS } from './components';

@NgModule({
  imports: [ACTIVITY_COMPONENTS],
  exports: [ACTIVITY_COMPONENTS],
})
export class ActivityModule {}
