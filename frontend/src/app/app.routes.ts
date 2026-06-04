import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { TicketCreate } from './pages/ticket-create/ticket-create';
import { authGuard } from './core/guards/auth-guard';
import { MyTicketsComponent } from './pages/my-tickets/my-tickets';
import { TicketDetails } from './pages/ticket-details/ticket-details';
import { Chatbot } from './pages/chatbot/chatbot';
import { AdminTickets } from './pages/admin-tickets/admin-tickets';
export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

    { path: 'login', component: Login },
    { path: 'register', component: Register },

    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard],
    },
    {
        path: 'tickets/create',
        component: TicketCreate,
        canActivate: [authGuard],
    },
    {
        path: 'tickets',
        component: MyTicketsComponent,
        canActivate: [authGuard],
    },
    {
        path: 'tickets/:id',
        component: TicketDetails,
        canActivate: [authGuard],
    },
    {
        path: 'chatbot',
        component: Chatbot,
        canActivate: [authGuard],
    },
    {
        path: 'admin/tickets',
        component: AdminTickets,
        canActivate: [authGuard],
    },

    { path: '**', redirectTo: 'dashboard' },
];
