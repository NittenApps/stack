import { Component } from '@angular/core';
import { DetailToolbarComponent } from '@na-stack/components';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [DetailToolbarComponent],
  templateUrl: './detail.component.html',
})
export class DetailComponent {}
