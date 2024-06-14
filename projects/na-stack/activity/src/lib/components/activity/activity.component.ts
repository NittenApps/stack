import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'nas-activity',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class ActivityComponent {}
