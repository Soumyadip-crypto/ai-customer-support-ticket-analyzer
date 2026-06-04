import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TicketService } from '../../core/services/ticket.service';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ticket-create.html',
  styleUrl: './ticket-create.css',
})
export class TicketCreate {
  ticketService = inject(TicketService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  subject = '';
  message = '';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent' = 'Medium';

  loading = false;
  errorMessage = '';
  successMessage = '';

  createdTicket: Ticket | null = null;

  createTicket(): void {
    if (!this.subject || !this.message) {
      this.errorMessage = 'Subject and message are required';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.createdTicket = null;

    this.ticketService
      .createTicket({
        subject: this.subject,
        message: this.message,
        priority: this.priority,
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.successMessage = res.message;
          this.createdTicket = res.ticket;

          this.subject = '';
          this.message = '';
          this.priority = 'Medium';
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Ticket creation failed';
        },
      });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}