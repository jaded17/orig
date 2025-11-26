// Enum for member status
export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE'
}

// Main TeamMember interface
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
  status: MemberStatus;
  projects: number;
  tasks: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Stats interface
export interface TeamStats {
  totalMembers: number;
  active: number;
  onLeave: number;
  totalTasks: number;
}

// DTO for creating a new member
export interface CreateTeamMemberDto {
  name: string;
  role: string;
  email: string;
  phone: string;
  status?: MemberStatus;
}

// DTO for updating a member
export interface UpdateTeamMemberDto {
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  status?: MemberStatus;
}

// API Response wrapper (adjust based on your backend)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Paginated response (if your backend supports pagination)
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter/Query params for fetching members
export interface TeamMemberQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: MemberStatus;
  sortBy?: 'name' | 'role' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}