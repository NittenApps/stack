import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService, ApiConfig, NAS_API_CONFIG } from '@nittenapps/api';
import { DirtyAware } from '@nittenapps/common';
import { StackFieldConfig, StackFormOptions } from '@nittenapps/forms';

@Component({
  template: '',
})
export abstract class BaseDetailComponent<T = any> implements DirtyAware, OnInit {
  fields: StackFieldConfig[];
  form: FormGroup = new FormGroup({});
  model: T;
  options: StackFormOptions;

  protected activityService!: ActivityService<T>;
  protected apiConfig: ApiConfig;
  protected http: HttpClient;
  protected route: ActivatedRoute;
  protected router: Router;
  protected saved = false;

  setModel(model: T): void {
    this.model = model;
  }

  constructor() {
    this.apiConfig = inject(NAS_API_CONFIG);
    this.http = inject(HttpClient);
    this.route = inject(ActivatedRoute);
    this.router = inject(Router);

    this.model = this.initModel();
    this.fields = this.initFields();
    this.options = this.initFormOptions();

    this.activityService = new ActivityService(this.apiConfig, this.http, this.getActivity());
  }

  ngOnInit(): void {}

  isDirty(): boolean {
    return !this.saved && this.form.dirty;
  }

  save(): void {
    this.activityService.save(this.prepareValue()).subscribe((response) => {
      if (response.success) {
        this.saved = true;
        this.back();
      }
    });
  }

  protected back(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  protected abstract getActivity(): string;

  protected abstract initFields(): StackFieldConfig[];

  protected initFormOptions(): StackFormOptions {
    return { formState: { activity: this.getActivity() } };
  }

  protected initModel(): T {
    return {} as T;
  }

  protected prepareValue(): any {
    return { ...this.model };
  }
}
