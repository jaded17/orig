import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { UserRole } from '../../core/enums/user-role.enum';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private roles: UserRole[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input() set appHasRole(roles: UserRole | UserRole[]) {
    this.roles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  ngOnInit(): void {
    // Subscribe to user changes
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateView());
  }

  private updateView(): void {
    this.viewContainer.clear();
    
    if (this.authService.hasRole(this.roles)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}