// Import stuff we need
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SomeService } from '../../../../core/services/some.service';

// This defines what a "User" looks like
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

// @Injectable means this service can be used anywhere in your app
@Injectable({
  providedIn: 'root'  // Available everywhere
})
export class UserService {
  // Get the Laravel URL from environment file
  private apiUrl = environment.apiUrl;

  // HttpClient is what makes the actual API calls
  constructor(private http: HttpClient) {}

  // ===== API METHODS =====

  // 1. GET ALL USERS
  // Like saying: "Laravel, give me all users"
  getUsers(): Observable<User[]> {
    // http.get = "Please GET data"
    // `${this.apiUrl}/users` = http://localhost:8000/api/users
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // 2. GET ONE USER
  // Like saying: "Laravel, give me user #5"
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  // 3. CREATE NEW USER
  // Like saying: "Laravel, save this new user"
  createUser(user: Partial<User>): Observable<User> {
    // http.post = "Please POST (save) this data"
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  // 4. UPDATE USER
  // Like saying: "Laravel, update user #5 with this new info"
  updateUser(id: number, user: Partial<User>): Observable<User> {
    // http.put = "Please UPDATE this data"
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }

  // 5. DELETE USER
  // Like saying: "Laravel, delete user #5"
  deleteUser(id: number): Observable<void> {
    // http.delete = "Please DELETE this"
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // 6. BULK DELETE (delete multiple users at once)
  bulkDeleteUsers(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/bulk-delete`, { ids });
  }
}