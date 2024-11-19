import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StackFieldAutocomplete } from './autocomplete.type';
import { ReactiveFormsModule } from '@angular/forms';
import { StackFormsModule } from '@nittenapps/forms';
import { StackFormsSelectModule } from '@nittenapps/forms/select';
import { StackMatFormFieldModule } from '../form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [StackFieldAutocomplete],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    StackFormsSelectModule,
    StackMatFormFieldModule,
    StackFormsModule.forChild({
      types: [{ name: 'autocomplete', component: StackFieldAutocomplete, wrappers: ['form-field'] }],
    }),
  ],
})
export class StackMatAutocompleteModule {}
