import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { TicketService } from '../../core/services/ticket.service';
import { AuthService } from '../../core/services/auth.service';
import { Ticket, TicketStats } from '../../models/ticket.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-tickets',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-tickets.html',
  styleUrl: './admin-tickets.css',
})
export class AdminTickets implements OnInit {
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);

  tickets: Ticket[] = [];
  stats: TicketStats | null = null;
  user = this.authService.getUser();

  loading = false;
  statsLoading = false;

  errorMessage = '';
  successMessage = '';

  assignUserId = '';

  search = '';
  statusFilter = '';
  priorityFilter = '';
  categoryFilter = '';

  page = 1;
  limit = 5;
  totalPages = 1;
  totalTickets = 0;

  ngOnInit(): void {
    this.loadStats();
    this.loadTickets();
  }

  loadStats(): void {
    this.statsLoading = true;

    this.ticketService
      .getTicketstats()
      .pipe(finalize(() => (this.statsLoading = false)))
      .subscribe({
        next: (res) => {
          this.stats = res.stats;
        },
        error: (err) => {
          this.errorMessage =
            err.error?.message || 'Failed to load ticket stats';
        },
      });
  }

  loadTickets(): void {
    this.loading = true;
    this.errorMessage = '';

    this.ticketService
      .getAlltickets({
        search: this.search,
        status: this.statusFilter,
        priority: this.priorityFilter,
        category: this.categoryFilter,
        page: this.page,
        limit: this.limit,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.tickets = res.tickets;
          this.totalPages = res.pages || 1;
          this.totalTickets = res.total || 0;
        },
        error: (err) => {
          this.errorMessage =
            err.error?.message || 'Failed to load all tickets';
        },
      });
  }

  updateStatus(ticket: Ticket, status: string): void {
    this.successMessage = '';
    this.errorMessage = '';

    this.ticketService.updateTicketStatus(ticket._id, { status }).subscribe({
      next: (res) => {
        ticket.status = res.ticket.status;
        this.successMessage = res.message;
        this.loadStats();
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Failed to update ticket status';
      },
    });
  }

  assignTicket(ticket: Ticket): void {
    if (!this.assignUserId.trim()) {
      this.errorMessage = 'Support/Admin user id is required';
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    this.ticketService
      .assignTicket(ticket._id, {
        assignedTo: this.assignUserId.trim(),
      })
      .subscribe({
        next: (res) => {
          this.successMessage = res.message;
          ticket.assignedTo = res.ticket.assignedTo;
          this.assignUserId = '';
        },
        error: (err) => {
          this.errorMessage =
            err.error?.message || 'Failed to assign ticket';
        },
      });
  }

  deleteTicket(ticket: Ticket): void {
    const confirmDelete = confirm(
      `Are you sure you want to delete ${ticket.ticketId}?`
    );

    if (!confirmDelete) return;

    this.successMessage = '';
    this.errorMessage = '';

    this.ticketService.deleteTicket(ticket._id).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.tickets = this.tickets.filter((t) => t._id !== ticket._id);
        this.loadStats();
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Failed to delete ticket';
      },
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadTickets();
  }

  clearFilters(): void {
    this.search = '';
    this.statusFilter = '';
    this.priorityFilter = '';
    this.categoryFilter = '';
    this.page = 1;
    this.loadTickets();
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadTickets();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadTickets();
    }
  }

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  getUserName(user: string | User | null | undefined): string {
    if (!user) return 'Not assigned';
    return typeof user === 'string' ? user : user.name;
  }

  getUserEmail(user: string | User | null | undefined): string {
    if (!user || typeof user === 'string') return '';
    return user.email;
  }
}