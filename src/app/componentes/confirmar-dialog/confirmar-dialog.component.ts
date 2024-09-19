import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmar-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirmar-dialog.component.html',
  styleUrl: './confirmar-dialog.component.scss'
})

export class ConfirmarDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmarDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true)
  }
  onCancel(): void {
    this.dialogRef.close(false)
  }
}
