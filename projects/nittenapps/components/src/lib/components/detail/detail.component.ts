import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService, NAS_API_CONFIG } from '@nittenapps/api';
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

  private activityService!: ActivityService<T>;

  setModel(model: T): void {
    this.model = model;
  }

  constructor(private route: ActivatedRoute, private router: Router) {
    this.model = this.initModel();
    this.fields = this.initFields();
    this.options = this.initFormOptions();

    this.activityService = new ActivityService(inject(NAS_API_CONFIG), inject(HttpClient), this.getActivity());
  }

  ngOnInit(): void {}

  isDirty(): boolean {
    return this.form.dirty;
  }

  save(): void {
    this.activityService.save(this.prepareValue()).subscribe((response) => {
      if (response.success) {
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    });
  }

  protected abstract getActivity(): string;

  protected abstract initFields(): StackFieldConfig[];

  protected initFormOptions(): StackFormOptions {
    return {};
  }

  protected initModel(): T {
    return {} as T;
  }

  protected prepareValue(): any {
    return { ...this.model };
  }
}
