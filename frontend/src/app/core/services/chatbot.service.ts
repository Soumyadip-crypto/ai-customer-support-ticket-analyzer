import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ChatbotCreateTicketResponse,
  ChatbotMessageResponse,
  ChatHistoryResponse,
} from '../../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private apiUrl = 'http://localhost:5000/api/chatbot';

 private http=inject(HttpClient) 

  sendMessage(data: { message: string }): Observable<ChatbotMessageResponse> {
    return this.http.post<ChatbotMessageResponse>(
      `${this.apiUrl}/message`,
      data
    );
  }

  getChatHistory(): Observable<ChatHistoryResponse> {
    return this.http.get<ChatHistoryResponse>(`${this.apiUrl}/history`);
  }

  createTicketFromChat(data: {
    subject: string;
    message: string;
  }): Observable<ChatbotCreateTicketResponse> {
    return this.http.post<ChatbotCreateTicketResponse>(
      `${this.apiUrl}/create-ticket`,
      data
    );
  }
}