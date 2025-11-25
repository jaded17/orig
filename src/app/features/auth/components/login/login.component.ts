import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '/';
  errorMessage: string = '';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    // Initialize form
    this.loginForm = this.formBuilder.group({
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
      next: (user) => {
        this.loading = false;
        // Navigation is handled by authService.login()
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