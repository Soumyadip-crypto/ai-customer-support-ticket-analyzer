import { User } from './user.model';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketStatus = 'Open' | 'Pending' | 'Resolved' | 'Closed';

export interface Ticket {
  _id: string;
  ticketId: string;

  user: string | User;

  subject: string;
  message: string;

  category: string;
  priority: TicketPriority;
  sentiment: string;

  status: TicketStatus;

  screenshot?: string;

  aiSummary?: string;
  aiSuggestedReply?: string;
  aiSolutionSteps?: string[];

  assignedTo?: string | User | null;

  createdAt: string;
  updatedAt: string;
}

export interface TicketReply {
  _id: string;
  ticket: string | Ticket;
  sender: string | User;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketResponse {
  message: string;
  ticket: Ticket;
}

export interface TicketDetailsResponse {
  message: string;
  ticket: Ticket;
  replies: TicketReply[];
}

export interface AddReplyResponse {
  message: string;
  reply: TicketReply;
}

export interface TicketStats {
  totalTickets: number;
  openTickets: number;
  pendingTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  highPriorityTickets: number;
}

export interface TicketStatsResponse {
  message: string;
  stats: TicketStats;
}

export interface UpdateTicketResponse {
  message: string;
  ticket: Ticket;
}

export interface PaginatedTicketResponse {
  message: string;
  count: number;
  total: number;
  page: number;
  pages: number;
  tickets: Ticket[];
}

export interface MyTicketsResponse extends PaginatedTicketResponse {}

export interface AllTicketsResponse extends PaginatedTicketResponse {}