import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  constructor(private router: Router) { }

  /**
   * Navigate to login page
   */
  public navigate(route: string): void {
    this.router.navigate([route]);
  }

  /**
   * Navigate to login
   */
  public login(): void {
    this.router.navigate(['/auth/login']);
  }

  /**
   * Learn more action
   */
  public learnMore(): void {
    alert('Learn more about our project management system!');
  }
}