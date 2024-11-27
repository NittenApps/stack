import { BooleanInput } from '@angular/cdk/coercion';
import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive({
  selector: '[uppercase]',
  standalone: true,
})
export class UppercaseDirective implements AfterViewInit, OnDestroy {
  @Input() set uppercase(apply: BooleanInput) {
    this._apply = !(apply === false);
    if (this._apply) {
      this.renderer.addClass(this.element.nativeElement, 'uppercase');
    }
  }

  private _apply = true;
  private destroy$ = new Subject<void>();

  constructor(private element: ElementRef, @Self() private ngControl: NgControl, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (!this._apply) {
      return;
    }

    setTimeout(() => this.setValue(this.ngControl.value?.toUpperCase()));
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

    const value = this.ngControl.value;
    !!value && this.setValue(value?.toUpperCase());
  }

  private setValue(value: string) {
    this.ngControl.control?.setValue(value, { emitEvent: true });
  }
}
