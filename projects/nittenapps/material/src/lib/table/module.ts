import { DatePipe, DecimalPipe, JsonPipe, NgClass } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { StackFormsModule } from '@nittenapps/forms';
import { StackTable } from './table.type';

@NgModule({
  declarations: [StackTable],
  imports: [
    DatePipe,
    DecimalPipe,
    JsonPipe,
    MatTableModule,
    NgClass,
    StackFormsModule.forChild({
      types: [{ name: 'table', component: StackTable }],
    }),
  ],
})
export class StackMatTableModule {}
