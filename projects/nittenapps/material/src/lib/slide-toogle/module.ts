import { NgModule } from '@angular/core';
import { StackFieldToggle } from './slide-toggle.type';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StackMatFormFieldModule } from '../form-field';
import { StackFormsModule } from '@nittenapps/forms';

@NgModule({
  declarations: [StackFieldToggle],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    StackMatFormFieldModule,
    StackFormsModule.forChild({ types: [{ name: 'toggle', component: StackFieldToggle, wrappers: ['form-field'] }] }),
  ],
})
export class StackMatToggleModule {}
