import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatserviceService {

  readonly apiUrl = 'http://127.0.0.1:5000'; // Base URL of your Flask backend

  constructor(private http: HttpClient) {}

  // Send user message and get bot response
  getBotResponse(userInput: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/chat`, { message: userInput });
  }

  // Fetch all analytics data
  getAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analytics`);
  }

  // Fetch performance metrics
  getPerformanceMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/metrics`);
  }

  // Fetch intent analysis data (correct predictions vs null intents)
  getIntentAnalysis(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/intent-analysis`);
  }
}