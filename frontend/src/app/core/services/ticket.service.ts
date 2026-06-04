import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  AddReplyResponse,
  AllTicketsResponse,
  CreateTicketResponse,
  MyTicketsResponse,
  TicketDetailsResponse,
  TicketStatsResponse,
  UpdateTicketResponse,
} from '../../models/ticket.model';

type TicketQueryParams = {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  page?: number;
  limit?: number;
};

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private apiUrl = 'http://localhost:5000/api/tickets';
  private http = inject(HttpClient);

  private buildParams(params?: TicketQueryParams): HttpParams {
    let httpParams = new HttpParams();

    if (!params) return httpParams;

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }

  createTicket(data: {
    subject: string;
    message: string;
    priority?: string;
  }): Observable<CreateTicketResponse> {
    return this.http.post<CreateTicketResponse>(this.apiUrl, data);
  }

  getMyTickets(params?: TicketQueryParams): Observable<MyTicketsResponse> {
    return this.http.get<MyTicketsResponse>(`${this.apiUrl}/my`, {
      params: this.buildParams(params),
    });
  }

  getTicketById(id: string): Observable<TicketDetailsResponse> {
    return this.http.get<TicketDetailsResponse>(`${this.apiUrl}/${id}`);
  }

  addReply(
    id: string,
    data: { message: string }
  ): Observable<AddReplyResponse> {
    return this.http.post<AddReplyResponse>(
      `${this.apiUrl}/${id}/reply`,
      data
    );
  }

  getAlltickets(params?: TicketQueryParams): Observable<AllTicketsResponse> {
    return this.http.get<AllTicketsResponse>(this.apiUrl, {
      params: this.buildParams(params),
    });
  }

  getTicketstats(): Observable<TicketStatsResponse> {
    return this.http.get<TicketStatsResponse>(`${this.apiUrl}/stats`);
  }

  updateTicketStatus(
    id: string,
    data: { status: string }
  ): Observable<UpdateTicketResponse> {
    return this.http.put<UpdateTicketResponse>(
      `${this.apiUrl}/${id}/status`,
      data
    );
  }

  assignTicket(
    id: string,
    data: { assignedTo: string }
  ): Observable<UpdateTicketResponse> {
    return this.http.put<UpdateTicketResponse>(
      `${this.apiUrl}/${id}/assign`,
      data
    );
  }

  deleteTicket(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}