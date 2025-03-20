import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatserviceService {

  readonly apiUrl = 'http://127.0.0.1:5000'; // Base URL of  Flask

  constructor(readonly http: HttpClient) {}

  // Send user message and get bot response
  getBotResponse(userInput: string){
    return this.http.post(`${this.apiUrl}/chat`, { message: userInput });
  }
}