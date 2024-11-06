import { NgModule } from '@angular/core';
import { StackFieldDatepicker } from './datepicker.type';
import { CommonModule } from '@nittenapps/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { StackFormsModule } from '@nittenapps/forms';
import { StackMatFormFieldModule } from '../form-field';

@NgModule({
  declarations: [StackFieldDatepicker],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    StackMatFormFieldModule,
    StackFormsModule.forChild({
      types: [{ name: 'datepicker', component: StackFieldDatepicker, wrappers: ['form-field'] }],
    }),
  ],
})
export class StackMatDatepickerModule {}
