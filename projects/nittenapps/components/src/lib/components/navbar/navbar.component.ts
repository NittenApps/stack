import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { TypeofPipe } from '@nittenapps/common';
import { NavItem } from '../../types/navbar-item';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'nas-navbar-item',
  standalone: true,
  imports: [IconComponent, MatRippleModule, NgClass, RouterModule, TypeofPipe],
  templateUrl: './navbar-item.component.html',
})
export class NavigationItemComponent {
  @Input() item!: NavItem;
}

@Component({
  selector: 'nas-navbar-collapsible',
  standalone: true,
  imports: [IconComponent, MatRippleModule, NavigationItemComponent, NgClass, RouterModule, TypeofPipe],
  templateUrl: './navbar-collapsible.component.html',
  animations: [trigger('children', [state('hidden', style({ height: 0 })), transition('* => *', [animate('0.2s')])])],
})
export class NavigationCollapsibleComponent {
  @Input() item!: NavItem;
  @Input() navigation!: NavigationComponent;

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
  imports: [MatRippleModule, NavigationCollapsibleComponent, NavigationItemComponent, NgClass, RouterModule],
  templateUrl: './navbar.component.html',
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
