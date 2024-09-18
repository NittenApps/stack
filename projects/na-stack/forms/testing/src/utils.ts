import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { StackFieldConfig } from '../../src/lib/types';

export function createFieldChangesSpy(field: StackFieldConfig): [jest.Mock, Subscription] {
  const spy = jest.fn();

  return [spy, field.options!.fieldChanges!.subscribe(spy)];
}

export function mockComponent(options: Component): any {
  const metadata: Component = {
    selector: options.selector,
    template: options.template || '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: options.inputs,
    outputs: options.outputs || [],
    exportAs: options.exportAs || '',
  };

  class Mock {
    [key: string]: any;
  }

  metadata.outputs?.forEach((method) => {
    Mock.prototype[method] = new EventEmitter<any>();
  });

  return Component(metadata)(Mock);
}

class TargetEvent extends Event {
  override get target() {
    return this._target;
  }
  override set target(_target) {
    this._target = _target;
  }
  private _target: any;

  constructor(type: string, target: any) {
    super(type);
    this.target = target;
  }
}

export function ɵCustomEvent(target?: any) {
  return new TargetEvent('custom', target);
}
