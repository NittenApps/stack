import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { StackFieldConfig, StackFormOptions, StackFormsModule } from '@nittenapps/forms';

@Component({
  selector: 'nas-attribute',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, ReactiveFormsModule, StackFormsModule],
  templateUrl: './attribute.component.html',
})
export class AttributeComponent {
  fields!: StackFieldConfig[];
  form: FormGroup = new FormGroup({});
  model: any = {};
  options: StackFormOptions = {};

  constructor() {
    setTimeout(() => {
      this.fields = [
        {
          fieldGroupClassName: 'row row-cols-1 row-cols-md-3',
          fieldGroup: [
            {
              key: 'type',
              type: 'select',
              props: {
                label: 'Tipo',
                required: true,
                options: [
                  { value: 'CD', label: 'Código' },
                  { value: 'CT', label: 'Catálogo' },
                  { value: 'ST', label: 'Texto' },
                ],
              },
            },
            {
              key: 'code',
              type: 'uppercase',
              props: {
                label: 'Código',
                required: true,
              },
            },
            {
              key: 'name',
              type: 'input',
              props: {
                label: 'Nombre',
                required: true,
              },
            },
            {
              key: 'description',
              type: 'input',
              props: {
                label: 'Descripción',
              },
            },
          ],
        },
      ];
    });
  }
}
