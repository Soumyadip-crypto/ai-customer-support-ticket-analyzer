import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TicketService } from '../../core/services/ticket.service';
import { Ticket, TicketReply } from '../../models/ticket.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-ticket-details',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.css',
})
export class TicketDetails implements OnInit  {
  private route = inject(ActivatedRoute);
  private ticketService = inject(TicketService);
  ticket: Ticket | null = null;
  replies: TicketReply[] = [];

  replyMessage = '';

  loading = false;
  replyLoading = false;

  errorMessage = '';
  replyError = '';
  replySuccess = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadTicket(id);
    }
  }
    loadTicket(id: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.ticketService.getTicketById(id).subscribe({
      next: (res) => {
        this.loading = false;
        this.ticket = res.ticket;
        this.replies = res.replies;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to load ticket';
      },
    });
  }
    addReply(): void {
    if (!this.ticket || !this.replyMessage.trim()) {
      this.replyError = 'Reply message is required';
      return;
    }

    this.replyLoading = true;
    this.replyError = '';
    this.replySuccess = '';
        this.ticketService
      .addReply(this.ticket._id, {
        message: this.replyMessage,
      })
      .subscribe({
        next: (res) => {
          this.replyLoading = false;
          this.replySuccess = res.message;
          this.replies.push(res.reply);
          this.replyMessage = '';
        },
        error: (err) => {
          this.replyLoading = false;
          this.replyError = err.error?.message || 'Failed to add reply';
        },
      });

}
  getUserName(user: string | User | null | undefined): string {
    if (!user) return 'N/A';
    return typeof user === 'string' ? user : user.name;
  }

  getUserEmail(user: string | User | null | undefined): string {
    if (!user) return '';
    return typeof user === 'string' ? '' : user.email;
  }

  getUserRole(user: string | User | null | undefined): string {
    if (!user) return '';
    return typeof user === 'string' ? '' : user.role;
  }
}
