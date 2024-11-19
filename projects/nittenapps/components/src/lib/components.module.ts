import { NgModule } from '@angular/core';
import { COMPONENTS_COMPONENTS } from './components/index';

@NgModule({
  imports: [COMPONENTS_COMPONENTS],
  exports: [COMPONENTS_COMPONENTS],
})
export class ComponentsModule {}
