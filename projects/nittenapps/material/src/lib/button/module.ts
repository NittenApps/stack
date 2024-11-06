import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StackFormsModule } from '@nittenapps/forms';
import { StackFieldButton } from './button.type';

@NgModule({
  declarations: [StackFieldButton],
  imports: [
    CommonModule,
    MatButtonModule,
    StackFormsModule.forChild({
      types: [{ name: 'button', component: StackFieldButton }],
    }),
  ],
})
export class StackMatButtonModule {}
