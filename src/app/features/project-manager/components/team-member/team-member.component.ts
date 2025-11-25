import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';
import { TeamMemberService } from '../../services/team-member.service';
import { TeamMember, TeamStats, MemberStatus } from '../../models/team-member.model';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './team-member.component.html',
  styleUrls: ['./team-member.component.css']
})
export class TeamMembersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  members: TeamMember[] = [];
  stats: TeamStats = { totalMembers: 0, active: 0, onLeave: 0, totalTasks: 0 };

  // Role options for dropdown
  roleOptions: string[] = [
    'Senior Developer',
    'Junior Developer',
    'Backend Developer',
    'Frontend Developer',
    'UI/UX Designer',
    'QA Engineer',
    'Project Manager',
    'DevOps Engineer',
    'Data Analyst',
    'Product Owner'
  ];

  // UI State
  isLoading = false;
  error: string | null = null;
  activeMenuId: number | null = null;

  // Modal State
  isModalOpen = false;
  isEditMode = false;
  isSaving = false;
  editingMemberId: number | null = null;
  memberForm!: FormGroup;

  // Labels
  labels = {
    pageTitle: 'Team Management',
    addMember: 'Add Team Member',
    stats: {
      totalMembers: 'Total Members',
      active: 'Active',
      onLeave: 'On Leave',
      totalTasks: 'Total Tasks'
    },
    member: {
      projects: 'Projects',
      tasks: 'Tasks',
      email: 'Email',
      phone: 'Phone'
    },
    status: {
      active: 'Active',
      onLeave: 'On Leave'
    },
    actions: {
      edit: 'Edit',
      viewProfile: 'View Profile',
      assignTask: 'Assign Task',
      remove: 'Remove'
    },
    messages: {
      loading: 'Loading team members...',
      error: 'Failed to load team members',
      noMembers: 'No team members found',
      retry: 'Retry'
    },
    modal: {
      addTitle: 'Add New Team Member',
      editTitle: 'Edit Team Member',
      subtitle: 'Invite a new member to your team',
      editSubtitle: 'Update team member information',
      cancel: 'Cancel',
      submit: 'Send Invitation',
      update: 'Update Member',
      saving: 'Sending...'
    },
    form: {
      name: 'Full Name',
      namePlaceholder: 'Enter full name',
      role: 'Role',
      rolePlaceholder: 'Select role',
      email: 'Email',
      emailPlaceholder: 'email@company.com',
      phone: 'Phone',
      phonePlaceholder: '+1 (555) 000-0000'
    },
    validation: {
      nameRequired: 'Name is required',
      nameMinLength: 'Name must be at least 2 characters',
      roleRequired: 'Please select a role',
      emailRequired: 'Email is required',
      emailInvalid: 'Please enter a valid email',
      phoneRequired: 'Phone is required',
      phoneInvalid: 'Please enter a valid phone number'
    }
  };

  constructor(
    private teamMemberService: TeamMemberService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.memberForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[\d\s\-\(\)]{10,}$/)]]
    });
  }

  loadMembers(): void {
    this.isLoading = true;
    this.error = null;

    this.teamMemberService.getMembers()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (members) => {
          this.members = members;
          this.calculateStats();
        },
        error: (err) => {
          this.error = this.labels.messages.error;
          console.error('Error loading members:', err);
        }
      });
  }

  calculateStats(): void {
    this.stats = {
      totalMembers: this.members.length,
      active: this.members.filter(m => m.status === MemberStatus.ACTIVE).length,
      onLeave: this.members.filter(m => m.status === MemberStatus.ON_LEAVE).length,
      totalTasks: this.members.reduce((sum, m) => sum + m.tasks, 0)
    };
  }

  // Modal Actions
  addTeamMember(): void {
    this.isEditMode = false;
    this.editingMemberId = null;
    this.memberForm.reset();
    this.isModalOpen = true;
  }

  editMember(member: TeamMember): void {
    this.closeMenu();
    this.isEditMode = true;
    this.editingMemberId = member.id;
    this.memberForm.patchValue({
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.editingMemberId = null;
    this.memberForm.reset();
  }

  onSubmit(): void {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formData = this.memberForm.value;

    if (this.isEditMode && this.editingMemberId) {
      this.teamMemberService.updateMember(this.editingMemberId, formData)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isSaving = false)
        )
        .subscribe({
          next: (updated) => {
            const idx = this.members.findIndex(m => m.id === this.editingMemberId);
            if (idx !== -1) {
              this.members[idx] = { ...this.members[idx], ...updated };
            }
            this.calculateStats();
            this.closeModal();
          },
          error: (err) => console.error('Error updating member:', err)
        });
    } else {
      const newMemberData = { ...formData, status: MemberStatus.ACTIVE };
      this.teamMemberService.createMember(newMemberData)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isSaving = false)
        )
        .subscribe({
          next: (newMember) => {
            this.members.push(newMember);
            this.calculateStats();
            this.closeModal();
          },
          error: (err) => console.error('Error creating member:', err)
        });
    }
  }

  // Form helpers
  get f() { return this.memberForm.controls; }

  hasError(field: string, error: string): boolean {
    const control = this.memberForm.get(field);
    return !!(control && control.hasError(error) && (control.dirty || control.touched));
  }

  isFieldInvalid(field: string): boolean {
    const control = this.memberForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Other Actions
  viewProfile(member: TeamMember): void {
    this.closeMenu();
    console.log('View profile:', member.id);
  }

  assignTask(member: TeamMember): void {
    this.closeMenu();
    console.log('Assign task to:', member.id);
  }

  removeMember(member: TeamMember): void {
    this.closeMenu();
    if (confirm(`Are you sure you want to remove ${member.name}?`)) {
      this.teamMemberService.deleteMember(member.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.members = this.members.filter(m => m.id !== member.id);
            this.calculateStats();
          },
          error: (err) => console.error('Error removing member:', err)
        });
    }
  }

  // Menu handling
  toggleMenu(memberId: number, event: Event): void {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === memberId ? null : memberId;
  }

  closeMenu(): void {
    this.activeMenuId = null;
  }

  isMenuOpen(memberId: number): boolean {
    return this.activeMenuId === memberId;
  }

  // Helpers
  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getStatusClass(status: MemberStatus): string {
    return status === MemberStatus.ACTIVE ? 'active' : 'on-leave';
  }

  getStatusLabel(status: MemberStatus): string {
    return status === MemberStatus.ACTIVE 
      ? this.labels.status.active 
      : this.labels.status.onLeave;
  }

  trackByMemberId(index: number, member: TeamMember): number {
    return member.id;
  }
}