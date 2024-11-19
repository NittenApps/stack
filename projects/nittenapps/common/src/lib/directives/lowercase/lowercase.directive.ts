import { BooleanInput } from '@angular/cdk/coercion';
import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive({
  selector: '[lowercase]',
  standalone: true,
})
export class LowercaseDirective implements AfterViewInit, OnDestroy {
  @Input()
  set lowercase(apply: BooleanInput) {
    this._apply = !(apply === false);
    if (this._apply) {
      this.renderer.addClass(this.element.nativeElement, 'lowercase');
    }
  }

  private _apply = true;
  private destroy$ = new Subject<void>();

  constructor(private element: ElementRef, @Self() private ngControl: NgControl, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (!this._apply) {
      return;
    }

    setTimeout(() => this.setValue(this.toLowercase(this.ngControl.value)));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('blur')
  onBlur(): void {
    if (!this._apply) {
      return;
    }

    const value = this.ngControl.control?.value || '';
    !!value && this.setValue(this.toLowercase(value));
  }

  private setValue(value: string) {
    this.ngControl.control?.setValue(value, { emitEvent: false });
  }

  private toLowercase(value: string): string {
    if (!value) {
      return value;
    }
    return value.toLowerCase();
  }
}
