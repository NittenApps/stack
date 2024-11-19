import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@nittenapps/common';
import { StackMatFormFieldModule } from '../form-field';
import { StackFormsModule } from '@nittenapps/forms';
import { StackFieldInput } from './input.type';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [StackFieldInput],
  imports: [
    CommonModule,
    DatePipe,
    MatInputModule,
    ReactiveFormsModule,
    StackMatFormFieldModule,
    StackFormsModule.forChild({
      types: [
        {
          name: 'input',
          component: StackFieldInput,
          wrappers: ['form-field'],
        },
        { name: 'string', extends: 'input' },
        {
          name: 'number',
          extends: 'input',
          defaultOptions: {
            props: {
              type: 'number',
            },
          },
        },
        {
          name: 'integer',
          extends: 'input',
          defaultOptions: {
            props: {
              type: 'number',
            },
          },
        },
      ],
    }),
  ],
})
export class StackMatInputModule {}
