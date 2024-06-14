import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgStyle } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NavItem } from '../../types/navbar-item';
import { NavigationComponent } from './navbar.component';

@Component({
  selector: 'nas-navbar-vertical',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, MatIconModule, NavigationComponent, NgStyle],
  template: `
    <div class="navbar-header shadow">
      <div class="logo">
        <span class="logo-icon"></span>
        <span class="logo-text">{{ logoText }}</span>
      </div>
      @if (!(isHandset$ | async)) {
      <button mat-icon-button tabindex="-1" (click)="onToggleFold()">
        <mat-icon aria-label="Alternar menú">menu</mat-icon>
      </button>
      }
    </div>
    <div class="navbar-content" style="position: relative;">
      <nas-navbar-navigation
        layout="vertical"
        [items]="items"
        [ngStyle]="{ height: containerHeight, 'max-height': containerHeight }"
      ></nas-navbar-navigation>
    </div>
    <div class="navbar-footer">
      <div class="footer">
        <span class="footer-text">{{ footerText }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./navbar-vertical.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarVerticalComponent implements OnInit {
  @Input() footerText?: string;
  @Input() items!: NavItem[];
  @Input() logoText?: string;

  @Output() toggleFold = new EventEmitter<boolean>();
  @Output() toggleOpen = new EventEmitter<boolean>();

  containerHeight = '0';
  folded = true;
  open = false;

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  ngOnInit(): void {
    this.onResize({ target: { innerHeigh: window.innerHeight } });
  }

  @HostListener('mouseenter') onmouseenter(): void {
    this.toggleOpen.emit(true);
    this.open = true;
  }

  @HostListener('mouseleave') onmouseleave(): void {
    this.toggleOpen.emit(false);
    this.open = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.containerHeight = event.target.innerHeight - 64 + 'px';
  }

  onToggleFold(): void {
    this.toggleFold.emit(!this.folded);
    this.folded = !this.folded;
  }
}
