import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../roles/role.service';


interface Role {
  id: number;
  title: string;
  permissions: string[];
  selected?: boolean;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl:'./roles.component.html', 
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  entriesPerPage = 100;
  searchTerm = '';
  submitting = false;
  
  // Modal visibility
  showAddModal = false;
  showViewModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Forms
  addRoleForm: FormGroup;
  editRoleForm: FormGroup;
  
  selectedRole: Role | null = null;
  selectedPermissions: string[] = [];
  editSelectedPermissions: string[] = [];
  
  availablePermissions = [
    'users_manage',
    'users_view',
    'roles_manage',
    'permissions_manage',
    'content_manage',
    'content_view',
    'profile_edit'
  ];
  
  roles: Role[] = [
    { id: 1, title: 'administrator', permissions: ['users_manage', 'roles_manage', 'permissions_manage'] },
    { id: 2, title: 'moderator', permissions: ['users_view', 'content_manage'] },
    { id: 3, title: 'user', permissions: ['profile_edit'] }
  ];

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService
  ) {
    this.addRoleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      permissions: [[], [Validators.required, Validators.minLength(1)]]
    });

    this.editRoleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      permissions: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit() {}

  filteredRoles() {
    if (!this.searchTerm) return this.roles;
    const term = this.searchTerm.toLowerCase();
    return this.roles.filter(r => 
      r.title.toLowerCase().includes(term) || 
      r.permissions.some(p => p.toLowerCase().includes(term))
    );
  }

  toggleAll(event: any) {
    this.roles.forEach(r => r.selected = event.target.checked);
  }

  allSelected() {
    return this.roles.length > 0 && this.roles.every(r => r.selected);
  }

  hasSelected() {
    return this.roles.some(r => r.selected);
  }

  // ===== ADD ROLE MODAL =====
  openAddModal() {
    this.addRoleForm.reset();
    this.selectedPermissions = [];
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  onPermissionChange(event: any, permission: string) {
    if (event.target.checked) {
      this.selectedPermissions.push(permission);
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(p => p !== permission);
    }
    this.addRoleForm.patchValue({ permissions: this.selectedPermissions });
  }

  addRole() {
    if (this.addRoleForm.invalid) {
      Object.keys(this.addRoleForm.controls).forEach(key => {
        this.addRoleForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    const roleData = this.addRoleForm.value;

    // TODO: Uncomment when connecting to Laravel
    /*
    this.roleService.createRole(roleData).subscribe({
      next: (newRole) => {
        this.roles.push(newRole);
        this.closeAddModal();
        alert('Role created successfully!');
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error creating role:', err);
        alert('Failed to create role');
        this.submitting = false;
      }
    });
    */

    // Simulate API call
    setTimeout(() => {
      const newRole: Role = {
        id: this.roles.length + 1,
        ...roleData
      };
      this.roles.push(newRole);
      this.closeAddModal();
      alert('Role created successfully!');
      this.submitting = false;
    }, 1000);
  }

  // ===== VIEW ROLE MODAL =====
  openViewModal(role: Role) {
    this.selectedRole = role;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedRole = null;
  }

  // ===== EDIT ROLE MODAL =====
  openEditModal(role: Role) {
    this.selectedRole = role;
    this.editSelectedPermissions = [...role.permissions];
    this.editRoleForm.patchValue({
      title: role.title,
      permissions: role.permissions
    });
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedRole = null;
  }

  isPermissionSelected(permission: string): boolean {
    return this.editSelectedPermissions.includes(permission);
  }

  onEditPermissionChange(event: any, permission: string) {
    if (event.target.checked) {
      this.editSelectedPermissions.push(permission);
    } else {
      this.editSelectedPermissions = this.editSelectedPermissions.filter(p => p !== permission);
    }
    this.editRoleForm.patchValue({ permissions: this.editSelectedPermissions });
  }

  updateRole() {
    if (this.editRoleForm.invalid) {
      Object.keys(this.editRoleForm.controls).forEach(key => {
        this.editRoleForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    const roleData = this.editRoleForm.value;

    // TODO: Uncomment when connecting to Laravel
    /*
    this.roleService.updateRole(this.selectedRole!.id, roleData).subscribe({
      next: (updatedRole) => {
        const index = this.roles.findIndex(r => r.id === this.selectedRole!.id);
        if (index !== -1) {
          this.roles[index] = updatedRole;
        }
        this.closeEditModal();
        alert('Role updated successfully!');
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error updating role:', err);
        alert('Failed to update role');
        this.submitting = false;
      }
    });
    */

    // Simulate API call
    setTimeout(() => {
      const index = this.roles.findIndex(r => r.id === this.selectedRole!.id);
      if (index !== -1) {
        this.roles[index] = { ...this.roles[index], ...roleData };
      }
      this.closeEditModal();
      alert('Role updated successfully!');
      this.submitting = false;
    }, 1000);
  }

  // ===== DELETE ROLE MODAL =====
  openDeleteModal(role: Role) {
    this.selectedRole = role;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedRole = null;
  }

  confirmDelete() {
    if (!this.selectedRole) return;

    this.submitting = true;

    // TODO: Uncomment when connecting to Laravel
    /*
    this.roleService.deleteRole(this.selectedRole.id).subscribe({
      next: () => {
        this.roles = this.roles.filter(r => r.id !== this.selectedRole!.id);
        this.closeDeleteModal();
        alert('Role deleted successfully!');
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error deleting role:', err);
        alert('Failed to delete role');
        this.submitting = false;
      }
    });
    */

    // Simulate API call
    setTimeout(() => {
      this.roles = this.roles.filter(r => r.id !== this.selectedRole!.id);
      this.closeDeleteModal();
      alert('Role deleted successfully!');
      this.submitting = false;
    }, 1000);
  }

  // ===== BULK DELETE =====
  bulkDelete() {
    const selectedIds = this.roles.filter(r => r.selected).map(r => r.id);
    
    if (selectedIds.length === 0) {
      alert('Please select roles to delete');
      return;
    }

    if (!confirm(`Delete ${selectedIds.length} role(s)?`)) {
      return;
    }

    this.roles = this.roles.filter(r => !r.selected);
    alert('Roles deleted successfully!');
  }
} 