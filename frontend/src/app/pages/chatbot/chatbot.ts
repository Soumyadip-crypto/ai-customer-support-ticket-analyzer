import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ChatbotService } from '../../core/services/chatbot.service';
import { ChatMessage } from '../../models/chat.model';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot implements OnInit {
  private chatbotService = inject(ChatbotService);

  @ViewChild('chatBox') chatBox!: ElementRef<HTMLDivElement>;

  messages: ChatMessage[] = [];

  userMessage = '';
  lastUserMessage = '';

  loading = false;
  historyLoading = false;
  ticketCreating = false;

  errorMessage = '';
  successMessage = '';

  shouldCreateTicket = false;
  suggestedCategory = '';

  createdTicket: Ticket | null = null;

  ngOnInit(): void {
    this.loadChatHistory();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatBox) {
        this.chatBox.nativeElement.scrollTop =
          this.chatBox.nativeElement.scrollHeight;
      }
    }, 100);
  }

  loadChatHistory(): void {
    this.historyLoading = true;
    this.errorMessage = '';

    this.chatbotService.getChatHistory().subscribe({
      next: (res) => {
        this.historyLoading = false;
        this.messages = res.messages;
        this.scrollToBottom();
      },
      error: (err) => {
        this.historyLoading = false;
        this.errorMessage = err.error?.message || 'Failed to load chat history';
      },
    });
  }

  sendMessage(): void {
    const message = this.userMessage.trim();

    if (!message) {
      this.errorMessage = 'Message is required';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.createdTicket = null;
    this.shouldCreateTicket = false;

    this.chatbotService.sendMessage({ message }).subscribe({
      next: (res) => {
        this.loading = false;

        this.messages.push(res.userMessage);
        this.messages.push(res.aiReply);

        this.lastUserMessage = message;
        this.userMessage = '';

        this.shouldCreateTicket = res.shouldCreateTicket;
        this.suggestedCategory = res.category;

        this.scrollToBottom();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Chatbot failed';
      },
    });
  }

  createTicketFromChat(): void {
    if (!this.lastUserMessage) {
      this.errorMessage = 'No message found to create ticket';
      return;
    }

    this.ticketCreating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.chatbotService
      .createTicketFromChat({
        subject: this.buildSubject(this.lastUserMessage),
        message: this.lastUserMessage,
      })
      .pipe(
        finalize(() => {
          this.ticketCreating = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.successMessage = res.message;
          this.createdTicket = res.ticket;
          this.messages.push(res.chatMessage);
          this.shouldCreateTicket = false;

          this.scrollToBottom();
        },
        error: (err) => {
          this.errorMessage =
            err.error?.error ||
            err.error?.message ||
            'Failed to create ticket from chatbot';
        },
      });
  }

  buildSubject(message: string): string {
    if (message.length <= 50) {
      return message;
    }

    return message.slice(0, 50) + '...';
  }
}