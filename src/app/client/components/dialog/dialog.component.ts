import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dialog',
  template: `<h1 mat-dialog-title class="modal-title text-center">
      {{ data.title }}
    </h1>
    <div mat-dialog-content class="modal-body">
      {{ data.message }}
    </div>
    <div mat-dialog-actions class="modal-footer d-flex justify-content-center">
      <button mat-button color="warn" (click)="dialogRef.close(true)">
        {{ data.confirmLabel }}
      </button>
      <button mat-button (click)="dialogRef.close(false)">
        {{ data.cancelLabel }}
      </button>
    </div> `,
})
export class DialogComponent {
  protected readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  @Inject(MAT_DIALOG_DATA) public data: any;
}
