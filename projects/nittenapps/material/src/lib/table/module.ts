import { DatePipe, DecimalPipe, JsonPipe, NgClass } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FaDuotoneIconComponent, FaIconComponent } from '@fortawesome/angular-fontawesome';
import { StackFormsModule } from '@nittenapps/forms';
import { StackMatButtonModule } from '../button';
import { StackMatTable } from './table.type';

@NgModule({
  declarations: [StackMatTable],
  imports: [
    DatePipe,
    DecimalPipe,
    FaDuotoneIconComponent,
    FaIconComponent,
    MatButtonModule,
    MatTableModule,
    NgClass,
    StackMatButtonModule,
    StackFormsModule.forChild({
      types: [{ name: 'table', component: StackMatTable }],
    }),
  ],
})
export class StackMatTableModule {}
