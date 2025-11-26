import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // FIX: Required for [formGroup]
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // FIX: RouterLink required for standalone component

import { CommonModule } from '@angular/common'; // FIX: Required for *ngIf, *ngFor (Fixes NG8103)
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  // FIX: Added 'standalone: true' as implied by previous NG6008 errors
  standalone: true, 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    // FIX: All template directives must be imported explicitly
    CommonModule, 
    ReactiveFormsModule,
    FormsModule,
    RouterLink // Allows use of routerLink in the template
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '/';
  errorMessage: string = '';
  showPassword = false;

  constructor(
    // Renaming 'formBuilder' to 'fb' for consistency with common Angular conventions
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // NOTE: Redirect logic is typically best handled by an Angular Guard 
    // rather than the component constructor. Keeping it for now.
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    // Initialize form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const email = this.f['email'].value;
    const password = this.f['password'].value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        // Navigation is typically handled by authService.login() or here
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
      }
    });
  }

  // Quick login methods for testing (remove in production)
  quickLoginAsAdmin(): void {
    this.loginForm.patchValue({
      email: 'admin@example.com',
      password: 'admin123'
    });
    this.onSubmit();
  }

  quickLoginAsPM(): void {
    this.loginForm.patchValue({
      email: 'pm@example.com',
      password: 'pm123'
    });
    this.onSubmit();
  }

  quickLoginAsMember(): void {
    this.loginForm.patchValue({
      email: 'member@example.com',
      password: 'member123'
    });
    this.onSubmit();
  }
}