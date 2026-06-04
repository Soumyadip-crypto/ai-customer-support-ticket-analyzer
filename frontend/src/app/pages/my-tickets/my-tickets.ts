import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { TicketService } from '../../core/services/ticket.service';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-my-tickets',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css',
})
export class MyTicketsComponent implements OnInit {
  private ticketService = inject(TicketService);

  tickets: Ticket[] = [];

  loading = false;
  errorMessage = '';

  page = 1;
  limit = 10;
  totalPages = 1;
  totalTickets = 0;

  ngOnInit(): void {
    this.loadMyTickets();
  }

  loadMyTickets(): void {
    this.loading = true;
    this.errorMessage = '';

    this.ticketService
      .getMyTickets({
        page: this.page,
        limit: this.limit,
      })
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.tickets = res.tickets;
          this.totalPages = res.pages || 1;
          this.totalTickets = res.total || 0;
        },
        error: (err) => {
          this.errorMessage =
            err.error?.message || err.error?.error || 'Failed to load tickets';
        },
      });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadMyTickets();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadMyTickets();
    }
  }
}