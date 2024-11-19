import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { StackFormsModule } from '@nittenapps/forms';
import { StackFieldTabs } from './tabs.type';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [StackFieldTabs],
  imports: [
    FaIconComponent,
    MatTabsModule,
    StackFormsModule.forChild({ types: [{ name: 'tabs', component: StackFieldTabs }] }),
  ],
})
export class StackMatTabsModule {}
