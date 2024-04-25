import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SchedulingService } from 'src/app/core/services/scheduling.service';
import { SnackBarService } from 'src/app/core/utils/snack-bar.service';

@Component({
  selector: 'app-delete-event',
  standalone: true,
  imports: [],
  templateUrl: './delete-event.component.html',
  styleUrl: './delete-event.component.scss'
})
export class DeleteEventComponent {
  private snackBarService = inject(SnackBarService);
  private schedulingService = inject(SchedulingService);

  eventDeleteSubscrption: Subscription | any;
  loader: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  closeDialog(res?: any): void {
    if (this.eventDeleteSubscrption) { this.eventDeleteSubscrption.unsubscribe(); }
    this.dialogRef.close(res ? true : false);
  }

  deleteEvent() {
    this.eventDeleteSubscrption = this.schedulingService.deleteEvent(this.data.id).subscribe({
      next: (response: any) => {
        this.snackBarService.openSnackBar({ type: 'success', message: 'You have successfully deleted event.' });
        this.closeDialog(response.data);
      }, error: (error) => {
        const message = error && error.message ? error.message : 'Unable to delete event at this moment.';
        this.snackBarService.openSnackBar({ type: 'danger', message });
      }
    });
  }

}
