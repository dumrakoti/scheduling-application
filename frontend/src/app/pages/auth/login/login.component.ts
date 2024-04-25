import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackBarService } from 'src/app/core/utils/snack-bar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './../shared.scss'
})
export class LoginComponent implements OnInit {
  private title = inject(Title);
  private router = inject(Router);
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(UntypedFormBuilder);
  private snackBarService = inject(SnackBarService);

  loginForm: UntypedFormGroup | any;
  isSubmitting: boolean = false;
  submitted: boolean = false;
  error: string = '';

  returnUrl: string | any;

  constructor() {
    this.title.setTitle('Login | Calendar Scheduling');

    this.authService.authSuccess.subscribe(this.authResponse.bind(this));
    this.authService.authError.subscribe(this.authError.bind(this));
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.error = '';
    if (this.loginForm.invalid) {
      this.isSubmitting = true;
      return;
    } else {
      if (this.submitted) { return; }
      this.submitted = true;
      this.authService.login({ email: this.f.email.value, password: this.f.password.value });
    }
  }

  authResponse(response: any): any {
    this.submitted = false;
    this.isSubmitting = false;
    this.snackBarService.openSnackBar({ type: 'success', message: 'You have successfully loggedIn.' });
    this.router.navigateByUrl(this.returnUrl);
  }

  authError(error: any): any {
    this.submitted = false;
    this.isSubmitting = false;
    if (error && error.error && error.error.error) {
      this.error = error.error.error ? error.error.error : 'Incorrect email address or password.';
    } else {
      this.error = 'Invalid email address or password.';
    }
    setTimeout(() => { this.error = ''; }, 5000);
  }



}
