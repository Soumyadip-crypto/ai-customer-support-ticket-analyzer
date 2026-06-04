import { Ticket } from './ticket.model';
export interface ChatMessage {
  _id: string;
  user: string;
  sender: 'user' | 'ai';
  message: string;
  createdTicket?: string | Ticket | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatbotMessageResponse {
  message: string;
  userMessage: ChatMessage;
  aiReply: ChatMessage;
  shouldCreateTicket: boolean;
  category: string;
}

export interface ChatHistoryResponse {
  message: string;
  count: number;
  messages: ChatMessage[];
}

export interface ChatbotCreateTicketResponse {
  message: string;
  ticket: Ticket;
  chatMessage: ChatMessage;
}

