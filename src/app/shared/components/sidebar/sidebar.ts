import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';

// --- Interface for Menu Structure ---
interface MenuItem {
  iconClass: string; // Used for icon CSS class (e.g., 'fa-house')
  label: string;
  route: string;
}

// Extend the interface to include the required role(s) for filtering
interface FullMenuItem extends MenuItem {
  roles: string[]; // e.g., ['PM', 'MEMBER', 'ADMIN']
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  // This array will hold the final, filtered menu items for the current user
  menuItems: MenuItem[] = [];

  // --- 1. Define ALL possible menu items with their required roles ---
  // This is the single source of truth for your four combined projects.
  private allMenuItems: FullMenuItem[] = [
    // Shared Items
    { iconClass: 'fa-house', label: 'Dashboard', route: '/dashboard', roles: ['PM', 'MEMBER', 'ADMIN'] },
    { iconClass: 'fa-folder-open', label: 'Project Management', route: '/project-management', roles: ['PM', 'ADMIN'] },
    { iconClass: 'fa-users', label: 'Team Members', route: '/team-members', roles: ['PM', 'MEMBER', 'ADMIN'] },
    
    // Role-Specific Financial Items (Using your exact labels)
    // PM Role
    { iconClass: 'fa-dollar-sign', label: 'Receipt Approval', route: '/receipts', roles: ['PM', 'ADMIN'] },
    // Member Role
    { iconClass: 'fa-dollar-sign', label: 'My Expenses', route: '/expenses', roles: ['MEMBER', 'ADMIN'] } 
  ];

  // Assuming an AuthService exists that can give you the current user's role
  constructor(
    public router: Router, 
    // You must inject your actual service here!
    // private authService: AuthService 
  ) {}

  ngOnInit() {
    this.loadMenuItems();
  }

  // --- 2. Dynamic Menu Filtering Logic ---
  loadMenuItems(): void {
    // 💡 Replace 'PM' with the result from your actual Auth Service
    // Example: const userRole = this.authService.getCurrentUserRole();
    const userRole = 'PM'; // <<< HARDCODED FOR DEMO. REPLACE WITH DYNAMIC VALUE!
    
    this.menuItems = this.allMenuItems
      .filter(item => item.roles.includes(userRole))
      // Map back to the simpler MenuItem structure for use in the template
      .map(item => ({ 
        iconClass: item.iconClass, 
        label: item.label, 
        route: item.route 
      }));
  }
}