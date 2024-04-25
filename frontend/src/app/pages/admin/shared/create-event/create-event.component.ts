import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SchedulingService } from 'src/app/core/services/scheduling.service';
import { SnackBarService } from 'src/app/core/utils/snack-bar.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private snackBarService = inject(SnackBarService);
  private schedulingService = inject(SchedulingService);

  eventPostSubscrption: Subscription | any;
  eventForm: UntypedFormGroup | any;
  isSubmitting: boolean = false;
  submitted: boolean = false;
  error: string = '';

  constructor(
    public dialogRef: MatDialogRef<CreateEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: [''],
      description: [''],
      participants: ['']
    });

  }

  closeDialog(res?: any): void {
    if (this.eventPostSubscrption) { this.eventPostSubscrption.unsubscribe(); }
    this.dialogRef.close(res ? res : '');
  }

  get f() { return this.eventForm.controls; }

  onSubmit() {
    this.error = '';
    if (this.eventForm.invalid) {
      this.isSubmitting = true;
      return;
    } else {
      if (this.submitted) { return; }
      if (this.eventPostSubscrption) { this.eventPostSubscrption.unsubscribe(); }
      this.submitted = true;

      const eventObj = {
        title: this.f.title.value,
        start: this.f.start.value,
        end: this.f.end.value,
        description: this.f.description.value,
        participants: this.f.participants.value
      };

      this.eventPostSubscrption = this.schedulingService.postEvents(eventObj).subscribe({
        next: (response: any) => {
          this.submitted = false;
          this.isSubmitting = false;
          this.snackBarService.openSnackBar({ type: 'success', message: 'You have successfully created event.' });
          this.closeDialog(response.data);
        }, error: (error) => {
          this.submitted = false;
          this.isSubmitting = false;
          const message = error && error.message ? error.message : 'Unable to create event at this moment.';
          this.snackBarService.openSnackBar({ type: 'danger', message });
        }
      });
    }
  }

}
