import { NgModule } from '@angular/core';
import { StackFormsWrapperFormField } from './form-field.wrapper';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StackFormsModule } from '@nittenapps/forms';

@NgModule({
  declarations: [StackFormsWrapperFormField],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    StackFormsModule.forChild({ wrappers: [{ name: 'form-field', component: StackFormsWrapperFormField }] }),
  ],
})
export class StackMatFormFieldModule {}
