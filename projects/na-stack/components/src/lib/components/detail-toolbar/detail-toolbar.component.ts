import { Location, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FaDuotoneIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faFloppyDisk } from '@fortawesome/pro-duotone-svg-icons';

@Component({
  selector: 'nas-detail-toolbar',
  standalone: true,
  imports: [FaDuotoneIconComponent, MatButtonModule, MatToolbarModule, MatTooltipModule, NgTemplateOutlet],
  templateUrl: './detail-toolbar.component.html',
  styleUrl: './detail-toolbar.component.scss',
})
export class DetailToolbarComponent {
  faArrowLeft = faArrowLeft;
  faFloppyDisk = faFloppyDisk;

  @ContentChild('leftActions') leftActions: TemplateRef<any> | null = null;
  @ContentChild('rightActions') rightActions: TemplateRef<any> | null = null;

  @Input() allowSave = true;

  constructor(public location: Location) {}
}
