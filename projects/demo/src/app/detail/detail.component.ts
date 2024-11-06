import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FaDuotoneIconComponent, FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/pro-duotone-svg-icons';
import { faQuestion } from '@fortawesome/pro-solid-svg-icons';
import { DetailToolbarComponent } from '@nittenapps/components';
import { StackFieldConfig, StackFormOptions, StackFormsModule } from '@nittenapps/forms';
import { StackMatInputModule, StackMatTabsModule } from '@nittenapps/material';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule,
    DetailToolbarComponent,
    FaDuotoneIconComponent,
    FaIconComponent,
    MatBadgeModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    StackFormsModule,
    StackMatInputModule,
    StackMatTabsModule,
  ],
  templateUrl: './detail.component.html',
})
export class DetailComponent {
  faBell = faBell;
  faQuestion = faQuestion;
  form = new FormGroup({});
  model: any = {};
  options: StackFormOptions = {};
  fields: StackFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'input_1',
          type: 'input',
          className: 'col-12 col-lg',
          props: {
            label: 'Input',
            placeholder: 'Placeholder',
            description: 'Description',
            required: true,
          },
        },
        {
          key: 'input_2',
          type: 'input',
          className: 'col-12 col-lg',
          props: {
            label: 'Input',
            placeholder: 'Placeholder',
            description: 'Description',
            required: true,
          },
        },
      ],
    },
    {
      type: 'tabs',
      fieldGroup: [
        {
          fieldGroupClassName: 'row',
          props: { label: 'Group 1' },
          expressions: { hide: 'model.input_1 === "2"' },
          fieldGroup: [
            {
              key: 'input_1_1',
              type: 'input',
              className: 'col-12 col-lg',
              props: { label: 'Input', required: true },
              expressions: { 'props.readonly': '!model.input_1' },
            },
            { key: 'input_1_2', type: 'input', className: 'col-12 col-lg', props: { label: 'Input', type: 'number' } },
            { template: '<div class="w-100"></div>' },
            { key: 'input_1_3', type: 'input', className: 'col-12 col-lg', props: { label: 'Input', required: true } },
            { key: 'input_1_4', type: 'input', className: 'col-12 col-lg', props: { label: 'Input', type: 'number' } },
          ],
        },
      ],
    },
  ];

  help(): void {}
}
