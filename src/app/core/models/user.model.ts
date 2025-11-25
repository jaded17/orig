import { UserRole } from '../enums/user-role.enum';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  token?: string;
  permissions?: string[];
}