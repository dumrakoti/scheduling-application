import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {
  api_url: any;

  constructor(
    public http: HttpClient,
    private authSerivce: AuthService
  ) {
    this.api_url = environment.apiUrl;
  }

  getResponseOptions(method: string): any {
    const headers = new HttpHeaders({
      Authorization: this.authSerivce.getAccessToken() ? this.authSerivce.getAccessToken() : '',
      'Content-Type': 'application/json'
    });
    return { headers, method };
  }

  getEvents(): Observable<any> {
    return this.http.get(`${this.api_url}/events`, this.getResponseOptions('get'));
  }



}
