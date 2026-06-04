import { Component, inject } from '@angular/core';
import { Router,RouterLink  } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private authService = inject(AuthService);
  private router = inject(Router);

  user: User | null = this.authService.getUser();

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
