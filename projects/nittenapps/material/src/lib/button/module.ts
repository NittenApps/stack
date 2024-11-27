import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StackFormsModule } from '@nittenapps/forms';
import { StackMatButton } from './button.type';
import { FaDuotoneIconComponent, FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [StackMatButton],
  imports: [
    CommonModule,
    FaDuotoneIconComponent,
    FaIconComponent,
    MatButtonModule,
    MatIconModule,
    StackFormsModule.forChild({
      types: [{ name: 'button', component: StackMatButton }],
    }),
  ],
})
export class StackMatButtonModule {}
