import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { ActivityService, NAS_API_CONFIG } from '@nittenapps/api';
import { CommonModule } from '@nittenapps/common';
import { DetailToolbarComponent } from '@nittenapps/components';
import { Field } from '../../../types/field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'nas-field-detail',
  standalone: true,
  imports: [
    CommonModule,
    DetailToolbarComponent,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsDetailComponent implements OnInit {
  form: FormGroup;
  model!: Field;

  private activityService: ActivityService<Field>;

  constructor(private location: Location, private route: ActivatedRoute, http: HttpClient) {
    this.activityService = new ActivityService(inject(NAS_API_CONFIG), http, 'configFields');

    this.form = new FormGroup({
      code: new FormControl(null, { validators: Validators.required }),
      name: new FormControl(null, { validators: Validators.required }),
      type: new FormControl(null, { validators: Validators.required }),
      description: new FormControl(null),
      definition: new FormControl(null),
      active: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.model = data['field'];

      this.form.patchValue(this.model);
    });
  }

  save(): void {
    const value = { ...this.form.getRawValue(), ...this.model };
    this.activityService.save(value).subscribe((response) => {
      if (response.success) {
        this.location.back();
      }
    });
  }
}
