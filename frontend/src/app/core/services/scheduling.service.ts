import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {
  apiUrl: any;
  holidayUrl: any;

  constructor(
    public http: HttpClient,
    private authSerivce: AuthService
  ) {
    this.apiUrl = environment.apiUrl;
    this.holidayUrl = environment.holidayUrl;
  }

  getResponseOptions(method: string): any {
    const headers = new HttpHeaders({
      Authorization: this.authSerivce.getAccessToken() ? this.authSerivce.getAccessToken() : '',
      'Content-Type': 'application/json'
    });
    return { headers, method };
  }

  getCountries(): Observable<any> {
    return this.http.get(`${this.holidayUrl}/countries?pretty&key=${environment.holidayApiKey}`, this.getResponseOptions('get'));
  }

  getHolidays(country: any, year: any): Observable<any> {
    return this.http.get(`${this.holidayUrl}/holidays?pretty&key=${environment.holidayApiKey}&country=${country}&year=${year}`, this.getResponseOptions('get'));
  }

  getEvents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/events`, this.getResponseOptions('get'));
  }



}
