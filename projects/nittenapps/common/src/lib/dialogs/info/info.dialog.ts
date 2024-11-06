import { Component, Inject, Optional } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FaDuotoneIconComponent } from '@fortawesome/angular-fontawesome';
import { faSquareInfo } from '@fortawesome/pro-duotone-svg-icons';
import { DialogData } from '../../types';

@Component({
  selector: 'nas-info-dialog',
  standalone: true,
  imports: [FaDuotoneIconComponent, MatButtonModule, MatDialogModule],
  templateUrl: './info.dialog.html',
})
export class InfoDialog {
  faSquareInfo = faSquareInfo;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
