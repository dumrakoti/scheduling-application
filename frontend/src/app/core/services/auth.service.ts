import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { tap } from 'rxjs/operators';
import 'moment-timezone';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: any;
  authResponse: any;

  loginSubscription: Subscription | any;
  authSuccess: Subject<any> = new Subject<any>();
  authError: Subject<any> = new Subject<any>();

  constructor(
    public http: HttpClient
  ) {
    this.apiUrl = `${environment.apiUrl}/auth`;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') ? true : false;
  }

  getAccessToken(): any {
    return localStorage.getItem('access_token') ? localStorage.getItem('access_token') : '';
  }

  getRefreshToken(): any {
    return localStorage.getItem('refresh_token') ? localStorage.getItem('refresh_token') : '';
  }

  getEmail(): any {
    if (localStorage.getItem('user_data')) {
      try {
        const ud = JSON.parse(localStorage.getItem('user_data')!);
        return ud.email;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  getUserData(): any {
    if (localStorage.getItem('user_data')) {
      try {
        return JSON.parse(localStorage.getItem('user_data')!);
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  getResponseHeader(): any {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return headers;
  }

  setUserInfo(response_data: any): void {
    this.setUserData(response_data);
    this.setAuthorizationData(response_data);
  }

  setUserData(userData: any): void {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('refresh_token', userData.refresh_token);
    localStorage.setItem('user_data', JSON.stringify({ name: userData.name, id: userData.id, email: userData.email }));
  }

  setAuthorizationData(auth_data: any): void {
    localStorage.setItem('access_token', 'Bearer ' + auth_data.access_token);
  }

  register(userData: any): Observable<any> {
    const options = { headers: this.getResponseHeader(), method: 'post' };
    return this.http.post(`${this.apiUrl}/register`, userData, options);
  }

  login(loginCredentials: any): void {
    const options = { headers: this.getResponseHeader(), method: 'post' };
    this.loginSubscription = this.http.post(`${this.apiUrl}/login`, loginCredentials, options).subscribe({
      next: (response: any) => {
        if (response && response.userData) {
          try {
            this.authResponse = response.userData;
            this.setUserInfo(this.authResponse);
          } catch (e) {
            this.authError.next(this);
          }
        } else {
          this.authError.next(response);
        }
      }, error: (error: any) => {
        this.authError.next(error);
        this.loginSubscription.unsubscribe();
      }, complete: () => {
        this.authSuccess.next(this.authResponse);
        this.loginSubscription.unsubscribe();
      }
    });
  }

  updateToken(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers, method: 'post' };

    return this.http.post<any>(`${this.apiUrl}/token`, { email: this.getEmail() }, options)
      .pipe(tap((tokens) => {
        this.storeTokens(tokens.data);
      }));
  }

  storeTokens(res: any): void {
    localStorage.setItem('access_token', 'Bearer ' + res.token);
  }


}
