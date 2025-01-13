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
import { Activity } from '../../../types/activity';
import { FieldGroup } from '../../../types/field-group';

@Component({
  selector: 'nas-activities-detail',
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
export class DetailComponent extends BaseDetailComponent<Activity> {
  definitionFields: StackFieldConfig[];
  sourceFieldGroups: FieldGroup[] = [];
  targetFieldGroups: FieldGroup[] = [];

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

    combineLatest([this.route.data, this.activityService.get('getFieldGroups', {})])
      .pipe(tap(console.log))
      .subscribe({
        next: ([data, fieldGroups]) => {
          this.model = data['activity'];
          this.targetFieldGroups = this.model.fieldGroups || [];

          const ids = this.targetFieldGroups.map((fieldGroup) => fieldGroup.id);
          this.sourceFieldGroups = (fieldGroups.body as ListBody<FieldGroup>).items.filter(
            (item) => !ids.includes(item.id)
          );
        },
      });
  }

  trackBy(_index: number, item: FieldGroup): any {
    return item.id;
  }

  protected override getActivity(): string {
    return 'configActivities';
  }

  protected override initFields(): StackFieldConfig[] {
    return [
      {
        fieldGroupClassName: 'row row-cols-1 row-cols-md-4',
        fieldGroup: [
          {
            key: 'code',
            type: 'input',
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
    value.fieldGroups = this.targetFieldGroups;
    return value;
  }
}
