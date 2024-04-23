import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackBarService } from 'src/app/core/utils/snack-bar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './../shared.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {
  private title = inject(Title);
  private router = inject(Router);
  private authService = inject(AuthService);
  private formBuilder = inject(UntypedFormBuilder);
  private snackBarService = inject(SnackBarService);

  registerSubscrption: Subscription | any;

  registerForm: UntypedFormGroup | any;
  isSubmitting: boolean = false;
  submitted: boolean = false;
  error: string = '';

  constructor() {
    this.title.setTitle('Register | Calendar Scheduling');
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.error = '';
    if (this.registerForm.invalid) {
      this.isSubmitting = true;
      return;
    } else {
      if (this.submitted) { return; }
      if (this.registerSubscrption) { this.registerSubscrption.unsubscribe(); }
      this.submitted = true;

      this.registerSubscrption = this.authService.register({ name: this.f.name.value, email: this.f.email.value, password: this.f.password.value }).subscribe({
        next: (response: any) => {
          this.submitted = false;
          this.isSubmitting = false;
          this.snackBarService.openSnackBar({ type: 'success', message: 'You have successfully register.' });
          this.router.navigateByUrl('/auth/login');
        }, error: (error) => {
          this.submitted = false;
          this.isSubmitting = false;
          const message = error && error.message ? error.message : 'Unable to register at this moment.';
          this.snackBarService.openSnackBar({ type: 'danger', message });
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.registerSubscrption) { this.registerSubscrption.unsubscribe(); }
  }

}
