import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-explain-dialog',
  templateUrl: './explain-dialog.component.html',
  styleUrls: ['./explain-dialog.component.css']
})
export class ExplainDialogComponent {

  navierStokesEquation = ``;

  constructor(
    public dialogRef: MatDialogRef<ExplainDialogComponent>
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
