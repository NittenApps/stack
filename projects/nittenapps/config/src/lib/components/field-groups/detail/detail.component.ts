import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { ListBody } from '@nittenapps/api';
import { BaseDetailComponent, DetailToolbarComponent } from '@nittenapps/components';
import { StackFieldConfig, StackFormsModule } from '@nittenapps/forms';
import {
  StackMatInputModule,
  StackMatSelectModule,
  StackMatTabsModule,
  StackMatToggleModule,
} from '@nittenapps/material';
import { PickListModule } from 'primeng/picklist';
import { combineLatest, tap } from 'rxjs';
import { Field } from '../../../types/field';
import { FieldGroup } from '../../../types/field-group';

@Component({
  selector: 'nas-field-groups-detail',
  standalone: true,
  imports: [
    CommonModule,
    DetailToolbarComponent,
    MatTabsModule,
    PickListModule,
    ReactiveFormsModule,
    StackFormsModule,
    StackMatInputModule,
    StackMatSelectModule,
    StackMatTabsModule,
    StackMatToggleModule,
  ],
  templateUrl: './detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent extends BaseDetailComponent<FieldGroup> {
  definitionFields: StackFieldConfig[];
  sourceFields: Field[] = [];
  targetFields: Field[] = [];

  constructor() {
    super();

    this.definitionFields = [
      {
        fieldGroupClassName: 'row row-cols-1 row-cols-md-4',
        fieldGroup: [
          {
            key: 'definition.hide',
            type: 'input',
            props: {
              label: 'Oculto',
            },
          },
        ],
      },
    ];
  }

  override ngOnInit(): void {
    super.ngOnInit();

    combineLatest([this.route.data, this.activityService.get('getFields', {})])
      .pipe(tap(console.log))
      .subscribe({
        next: ([data, fields]) => {
          console.log(data, fields);
          this.model = data['fieldGroup'];
          this.targetFields = this.model.fields || [];

          const ids = this.targetFields.map((field) => field.id);
          this.sourceFields = (fields.body as ListBody<Field>).items.filter((item) => !ids.includes(item.id));
        },
      });
  }

  markDirty(): void {
    this.form.markAsDirty();
  }

  trackBy(_index: number, item: Field): any {
    console.log(_index, item);
    return item.id;
  }

  protected override getActivity(): string {
    return 'configFieldGroups';
  }

  protected override initFields(): StackFieldConfig[] {
    return [
      {
        fieldGroupClassName: 'row row-cols-1 row-cols-md-4',
        fieldGroup: [
          {
            key: 'code',
            type: 'uppercase',
            props: {
              label: 'Código',
              required: true,
            },
            expressions: {
              'props.readonly': 'model.id',
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
          {
            key: 'active',
            type: 'toggle',
            props: {
              label: 'Activo',
            },
          },
        ],
      },
    ];
  }

  protected override prepareValue(): any {
    const value = super.prepareValue();
    value.fields = this.targetFields;
    return value;
  }
}
