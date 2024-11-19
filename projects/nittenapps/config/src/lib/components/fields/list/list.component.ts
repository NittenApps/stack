import { Component } from '@angular/core';
import { FaDuotoneIconComponent } from '@fortawesome/angular-fontawesome';
import { faQuestion } from '@fortawesome/pro-duotone-svg-icons';
import { Column, ListComponent, ListToolbarComponent } from '@nittenapps/components';

@Component({
  selector: 'nas-fields-list',
  standalone: true,
  imports: [FaDuotoneIconComponent, ListComponent, ListToolbarComponent],
  templateUrl: './list.component.html',
})
export class FieldsListComponent {
  faQuestion = faQuestion;

  columns: Column[] = [
    {
      id: 'code',
      title: 'Código',
    },
    {
      id: 'name',
      title: 'Nombre',
    },
    {
      id: 'description',
      title: 'Descripción',
    },
  ];
}
