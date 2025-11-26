// src/app/shared/components/footer/footer.ts

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true, // ⭐ NEW
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
  imports: [
    CommonModule // Include any necessary modules
  ]
})
export class Footer {
  // component logic...
}