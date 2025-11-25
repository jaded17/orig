import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// NOTE: Components like Sidebar and specific layout logic 
// should be imported and used within a LayoutComponent 
// that is rendered by the router.

@Component({
  selector: 'app-root',
  standalone: true,
  // The root component only needs the RouterOutlet to display the routed content
  imports: [RouterOutlet], 
  template: `
    <router-outlet></router-outlet>
  `,
  // Stylesheets are often empty or minimal for the root component
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Keep the component logic minimal
}