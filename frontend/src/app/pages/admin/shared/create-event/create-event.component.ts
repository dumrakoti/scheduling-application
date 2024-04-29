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

  isUpdate: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    console.log(data.selectInfo?.startStr);
  }

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: [''],
      description: [''],
      participants: ['']
    });

    if (this.data?.selectInfo) {
      this.eventForm.patchValue({
        start: this.data?.selectInfo?.startStr
      });
    }

    if (this.data?.eventObj) {
      const eObj = this.data.eventObj;
      this.isUpdate = true;
      this.eventForm.patchValue({
        title: eObj?.title,
        start: eObj?.start,
        end: eObj?.end,
        description: eObj?.description,
        participants: eObj?.participants
      });
    }
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

      let url: any;
      if (this.isUpdate) {
        url = this.schedulingService.patchEvents(eventObj, this.data.eventObj?.id);
      } else {
        url = this.schedulingService.postEvents(eventObj);
      }

      if (url) {
        this.eventPostSubscrption = url.subscribe({
          next: (response: any) => {
            this.submitted = false;
            this.isSubmitting = false;
            this.snackBarService.openSnackBar({ type: 'success', message: `You have successfully ${this.isUpdate ? 'updated' : 'created'} event.` });
            this.closeDialog(response.data);
          }, error: (error: any) => {
            this.submitted = false;
            this.isSubmitting = false;
            const message = error && error.message ? error.message : `Unable to ${this.isUpdate ? 'update' : 'created'} event at this moment.`;
            this.snackBarService.openSnackBar({ type: 'danger', message });
          }
        });
      }
    }
  }

}
