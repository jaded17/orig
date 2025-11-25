// src/app/app.ts

import { Component } from '@angular/core';
// Removed RouterOutlet import, as it was unused (NG8113)

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [], // Empty, as no child components are used here
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class HomeComponent { // Renamed from UserLandingComponent for clarity

  constructor() { }

  /**
   * Defines the navigation handler used in the template (e.g., in the buttons).
   * @param route The target route (e.g., '/dashboard')
   */
  public navigate(route: string): void {
    console.log(`Navigating to ${route}...`);
    // In a real application, you would inject and use the Router service here
  }

  /**
   * Defines the handler for the "Learn More" button.
   */
  public learnMore(): void {
    alert('Learn more clicked!');
  }
}