import { Component } from '@angular/core';
import { FaDuotoneIconComponent } from '@fortawesome/angular-fontawesome';
import { faQuestion } from '@fortawesome/pro-duotone-svg-icons';
import { Column, ListComponent as StackListComponent, ListToolbarComponent } from '@nittenapps/components';

@Component({
  selector: 'nas-fields-list',
  standalone: true,
  imports: [FaDuotoneIconComponent, StackListComponent, ListToolbarComponent],
  templateUrl: './list.component.html',
})
export class ListComponent {
  readonly faQuestion = faQuestion;

  columns: Column[] = [
    {
      id: 'code',
      title: 'Código',
      sortable: true,
    },
    {
      id: 'name',
      title: 'Nombre',
      sortable: true,
    },
    {
      id: 'description',
      title: 'Descripción',
    },
  ];
}
