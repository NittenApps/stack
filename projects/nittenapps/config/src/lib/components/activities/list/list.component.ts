import { Component } from '@angular/core';
import { ListComponent as StackListComponent, ListToolbarComponent, Column } from '@nittenapps/components';

@Component({
  selector: 'nas-activities-list',
  standalone: true,
  imports: [ListToolbarComponent, StackListComponent],
  templateUrl: './list.component.html',
})
export class ListComponent {
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
