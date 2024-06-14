import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TypeofPipe } from '@na-stack/common';
import { NavItem } from '../../types/navbar-item';
import { FaDuotoneIconComponent, FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'nas-navbar-item',
  standalone: true,
  imports: [
    FaDuotoneIconComponent,
    FaIconComponent,
    MatIconModule,
    MatRippleModule,
    NgClass,
    NgIf,
    RouterModule,
    TypeofPipe,
  ],
  template: `
    <a
      *ngIf="item.routerLink"
      class="nav-link"
      matRipple
      [attr.target]="item.target"
      [queryParams]="item.queryParams"
      [routerLink]="item.routerLink"
      [routerLinkActive]="['state-link-active']"
      [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
    >
      <span class="nav-link-title">{{ item.label }}</span>
      @if ((item.icon | typeof) === 'string') {
      <mat-icon
        class="nav-link-icon"
        [fontIcon]="item.iconSet ? asString(item.icon) : ''"
        [fontSet]="item.iconSet || ''"
        [ngClass]="item.iconClass || ''"
        aria-hidden="true"
      >
        {{ item.iconSet ? '' : item.icon }}
      </mat-icon>
      } @else if (item.icon) {
        @if (item.iconSet === 'duo') {
        <fa-duotone-icon [icon]="item.icon" [swapOpacity]="item.swapOpacity" aria-hidden="true" />
        } @else {
        <fa-icon [icon]="item.icon" />
        }
      }
    </a>
    <a *ngIf="!item.routerLink" class="nav-link" [attr.target]="item.target" [href]="item.url || '#'" matRipple>
      <span class="nav-link-title">{{ item.label }}</span>
      @if ((item.icon | typeof) === 'string') {
      <mat-icon
        class="nav-link-icon"
        [fontIcon]="item.iconSet ? asString(item.icon) || '' : ''"
        [fontSet]="item.iconSet || ''"
        [ngClass]="item.iconClass || ''"
        aria-hidden="true"
      >
        {{ item.iconSet ? '' : item.icon }}
      </mat-icon>
      } @else if (item.icon) {
        @if (item.iconSet === 'duo') {
        <fa-duotone-icon [icon]="item.icon" [swapOpacity]="item.swapOpacity" aria-hidden="true" />
        } @else {
        <fa-icon [icon]="item.icon" />
        }
      }
    </a>
  `,
})
export class NavigationItemComponent {
  @Input() item!: NavItem;

  asString(value: any): string {
    return value as string;
  }
}

@Component({
  selector: 'nas-navbar-collapsible',
  standalone: true,
  imports: [
    FaDuotoneIconComponent,
    FaIconComponent,
    MatIconModule,
    MatRippleModule,
    NavigationItemComponent,
    NgClass,
    NgIf,
    NgFor,
    RouterModule,
    TypeofPipe,
  ],
  template: `
    <a
      *ngIf="item.routerLink"
      class="nav-link"
      matRipple
      [attr.target]="item.target"
      [ngClass]="{ open: item.expanded }"
      [queryParams]="item.queryParams"
      [routerLink]="item.routerLink"
      [routerLinkActive]="['state-active']"
      [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
      (click)="handleClick($event, item)"
    >
      <span class="nav-link-title">{{ item.label }}</span>
      <mat-icon class="collapse-arrow" aria-hidden="true">expand_more</mat-icon>
      @if ((item.icon | typeof) === 'string') {
      <mat-icon
        class="nav-link-icon"
        [fontIcon]="item.iconSet ? asString(item.icon) : ''"
        [fontSet]="item.iconSet || ''"
        [ngClass]="item.iconClass || ''"
        aria-hidden="true"
      >
        {{ item.iconSet ? '' : item.icon }}
      </mat-icon>
      } @else if (item.icon) {
        @if (item.iconSet === 'duo') {
        <fa-duotone-icon [icon]="item.icon" [swapOpacity]="item.swapOpacity" aria-hidden="true" />
        } @else {
        <fa-icon [icon]="item.icon" />
        }
      }
    </a>
    <a
      *ngIf="!item.routerLink"
      class="nav-link"
      [attr.target]="item.target"
      [href]="item.url || '#'"
      matRipple
      [ngClass]="{ open: item.expanded }"
      (click)="handleClick($event, item)"
    >
      <span class="nav-link-title">{{ item.label }}</span>
      <mat-icon class="collapse-arrow" aria-hidden="true">expand_more</mat-icon>
      @if ((item.icon | typeof) === 'string') {
      <mat-icon
        class="nav-link-icon"
        [fontIcon]="item.iconSet ? asString(item.icon) : ''"
        [fontSet]="item.iconSet || ''"
        [ngClass]="item.iconClass || ''"
        aria-hidden="true"
      >
        {{ item.iconSet ? '' : item.icon }}
      </mat-icon>
      } @else if (item.icon) {
        @if (item.iconSet === 'duo') {
        <fa-duotone-icon [icon]="item.icon" [swapOpacity]="item.swapOpacity" aria-hidden="true" />
        } @else {
        <fa-icon [icon]="item.icon" />
        }
      }
    </a>
    <div class="children" [@children]="item.expanded ? 'visible' : 'hidden'">
      <ng-template ngFor let-child [ngForOf]="item.children">
        <nas-navbar-collapsible
          *ngIf="child.children && visible(child)"
          class="nav-item"
          [item]="child"
          [navigation]="navigation"
          [ngClass]="{ 'state-active': item.expanded }"
        />
        <nas-navbar-item *ngIf="!child.children && visible(child)" class="nav-item" [item]="child" />
      </ng-template>
    </div>
  `,
  animations: [trigger('children', [state('hidden', style({ height: 0 })), transition('* => *', [animate('0.2s')])])],
})
export class NavigationCollapsibleComponent {
  @Input() item!: NavItem;
  @Input() navigation!: NavigationComponent;

  asString(value: any): string {
    return value as string;
  }

  handleClick(event: any, navItem: NavItem): void {
    this.navigation.handleClick(event, navItem);
  }

  visible(navItem: NavItem): boolean {
    return this.navigation.visible(navItem);
  }
}

@Component({
  selector: 'nas-navbar-navigation',
  standalone: true,
  imports: [
    MatRippleModule,
    NavigationCollapsibleComponent,
    NavigationItemComponent,
    NgClass,
    NgIf,
    NgFor,
    NgForOf,
    RouterModule,
  ],
  template: `
    <ng-template ngFor let-item [ngForOf]="items">
      <nas-navbar-collapsible
        *ngIf="item.children && visible(item)"
        class="nav-item"
        [item]="item"
        [navigation]="this"
        [ngClass]="{ 'state-active': item.expanded }"
      />
      <nas-navbar-item *ngIf="!item.children && visible(item)" class="nav-item" [item]="item" />
    </ng-template>
  `,
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavigationComponent {
  @Input() items!: NavItem[];

  handleClick(event: any, navItem: NavItem) {
    for (const item of this.items) {
      if (item !== navItem && item.expanded) {
        if (!this.containsItem(item, navItem)) {
          item.expanded = false;
          this.collapseChildren(item);
        }
      }
    }

    if (navItem.disabled) {
      event.preventDefault();
      return;
    }

    navItem.expanded = !navItem.expanded;

    if (!navItem.url) {
      event.preventDefault();
    }

    if (navItem.command) {
      navItem.command(event, navItem);
    }
  }

  visible(navItem: NavItem): boolean {
    if (navItem.hidden !== undefined && navItem.hidden !== null) {
      if (typeof navItem.hidden === 'boolean') {
        return !navItem.hidden;
      }
      return !navItem.hidden(navItem);
    }
    return true;
  }

  private collapseChildren(navItem: NavItem): void {
    if (!navItem.children) {
      return;
    }

    for (const child of navItem.children) {
      if (child.children) {
        child.expanded = false;
        this.collapseChildren(child);
      }
    }
  }

  private containsItem(navItem: NavItem, targetItem: NavItem): boolean {
    if (!navItem.children) {
      return false;
    }

    for (const child of navItem.children) {
      if (child === targetItem) {
        return true;
      }
      if (child.children) {
        return this.containsItem(child, targetItem);
      }
    }
    return false;
  }
}
