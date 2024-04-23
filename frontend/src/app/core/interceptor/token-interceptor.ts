import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { SnackBarService } from '../utils/snack-bar.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    public router: Router,
    private snackBarService: SnackBarService,
    public authService: AuthService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const authorizationHeader = event.headers.get('Authorization');
          if (authorizationHeader) {
            this.authService.updateToken(authorizationHeader);
          }
        }
      }),
      catchError(error => {
        if (error.status === 401 && error.error && error.error.message && error.error.message === 'Authentication error!') {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
      })
    ) as any;
  }

  // private addToken(request: HttpRequest<any>, token: string): any {
  //   return request.clone({
  //     setHeaders: { Authorization: `Bearer ${token}` }
  //   });
  // }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): any {
    // if (this.dialogRef) { this.dialogRef.closeAll(); }
    this.snackBarService.openSnackBar({ type: 'danger', message: 'Session expired! Please relogin.' });
    localStorage.clear();
    window.location.href = `${environment.baseUrl}/auth/login?returnUrl=${window.location.pathname}`;
    // this.router.navigate(['/auth/login'], { queryParams: { returnUrl: window.location.pathname } });
    return throwError('');

    // if (!this.isRefreshing) {
    //   this.isRefreshing = true;
    //   this.refreshTokenSubject.next(null);

    //   return this.authService.refreshToken().pipe(
    //     switchMap((tokenData: any) => {
    //       this.isRefreshing = false;
    //       this.refreshTokenSubject.next(tokenData);
    //       return next.handle(this.addToken(request, tokenData.access_token));
    //     }),
    //     catchError((err: any) => {
    //       this.isRefreshing = false;
    //       localStorage.clear();
    //       this.router.navigate(['/auth/login'], { queryParams: { sessionExpired: true } });
    //       return throwError(err);
    //     })
    //   );
    // } else {
    //   return this.refreshTokenSubject.pipe(filter(token => token != null), take(1), switchMap(tokenData => {
    //     return next.handle(this.addToken(request, tokenData.access_token));
    //   }));
    // }
  }
}
