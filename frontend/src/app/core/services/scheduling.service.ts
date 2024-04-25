import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Event } from '../model/Event';

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {
  apiUrl: any;

  constructor(
    public http: HttpClient,
    private authSerivce: AuthService
  ) {
    this.apiUrl = environment.apiUrl;
  }

  getResponseOptions(method: string): any {
    const headers = new HttpHeaders({
      Authorization: this.authSerivce.getAccessToken() ? this.authSerivce.getAccessToken() : '',
      'Content-Type': 'application/json'
    });
    return { headers, method };
  }

  getCountries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/utils/countries`, this.getResponseOptions('get'));
  }

  getHolidays(country: any, year: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/utils/holidays?country=${country}&year=${year}`, this.getResponseOptions('get'));
  }

  getEvents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/event`, this.getResponseOptions('get'));
  }

  getEventById(eventId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/event/${eventId}`, this.getResponseOptions('get'));
  }

  postEvents(eventObj: Event): Observable<any> {
    return this.http.post(`${this.apiUrl}/event`, eventObj, this.getResponseOptions('post'));
  }

  patchEvents(eventObj: Event, eventId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/event/${eventId}`, eventObj, this.getResponseOptions('patch'));
  }

  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/event/${eventId}`, this.getResponseOptions('delete'));
  }



}
