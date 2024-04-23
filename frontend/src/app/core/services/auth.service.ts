import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment-timezone';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api_url: any;
  authResponse: any;

  loginSubscription: Subscription | any;
  authSuccess: Subject<any> = new Subject<any>();
  authError: Subject<any> = new Subject<any>();

  constructor(
    public http: HttpClient
  ) {
    this.api_url = environment.apiUrl;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') ? true : false;
  }

  getAccessToken(): any {
    return localStorage.getItem('auth_token') ? localStorage.getItem('auth_token') : '';
  }

  getRefreshToken(): any {
    return localStorage.getItem('refresh_token') ? localStorage.getItem('refresh_token') : '';
  }

  getTokenType(): any {
    return localStorage.getItem('token_type') ? localStorage.getItem('token_type') : '';
  }

  getRole(): any {
    return localStorage.getItem('role') ? JSON.parse(localStorage.getItem('role')!) : undefined;
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
    const headers = new HttpHeaders({
      Authorization: this.getAccessToken() ? this.getAccessToken() : '',
      'Content-Type': 'application/json'
    });
    return headers;
  }

  setUserInfo(response_data: any): void {
    this.setUserData(response_data);
    this.setAuthorizationData(response_data);
  }

  setUserData(userData: any): void {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', JSON.stringify(userData.user_role));
    localStorage.setItem('user_data', JSON.stringify(userData));
  }

  setAuthorizationData(auth_data: any): void {
    localStorage.setItem('auth_token', 'Bearer ' + auth_data.auth_token);
  }

  register(r_data: any): Observable<any> {
    const options = { headers: this.getResponseHeader(), method: 'post' };
    return this.http.post(`${this.api_url}/users/register`, r_data, options);
  }

  login(loginCredentials: any): void {
    const options = { headers: this.getResponseHeader(), method: 'post' };
    this.loginSubscription = this.http.post(`${this.api_url}/merchants/login`, loginCredentials, options).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          try {
            this.authResponse = response.data;
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


}
