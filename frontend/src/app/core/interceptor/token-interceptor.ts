import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    public router: Router,
    public authService: AuthService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error: any): any => {
      if (error?.error?.error?.message === 'jwt expired') {
        localStorage.clear();
        window.location.href = `${environment.baseUrl}/auth/login?returnUrl=${window.location.pathname}`;
      } else {
        return new Error(error);
      }
    })) as any;
  }
}
