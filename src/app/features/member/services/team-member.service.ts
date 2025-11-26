import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, delay } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { 
  TeamMember, TeamStats, MemberStatus,
  CreateTeamMemberDto, UpdateTeamMemberDto,
  ApiResponse, PaginatedResponse, TeamMemberQueryParams 
} from '../models/team-member.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  private readonly apiUrl = `${environment.apiUrl}/team-members`;
  
  // Toggle this to switch between mock and real API
  private readonly useMockData = true;

  constructor(private http: HttpClient) {}

  // GET all members
  getMembers(params?: TeamMemberQueryParams): Observable<TeamMember[]> {
    if (this.useMockData) {
      return this.getMockMembers();
    }

    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<TeamMember[]>>(this.apiUrl, { params: httpParams })
      .pipe(
        map(response => response.data),
        retry(2),
        catchError(this.handleError)
      );
  }

  // GET single member by ID
  getMemberById(id: number): Observable<TeamMember> {
    if (this.useMockData) {
      return this.getMockMembers().pipe(
        map(members => {
          const member = members.find(m => m.id === id);
          if (!member) throw new Error('Member not found');
          return member;
        })
      );
    }

    return this.http.get<ApiResponse<TeamMember>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  // POST create new member
  createMember(dto: CreateTeamMemberDto): Observable<TeamMember> {
    if (this.useMockData) {
      const newMember: TeamMember = {
        id: Date.now(),
        ...dto,
        status: dto.status || MemberStatus.ACTIVE,
        projects: 0,
        tasks: 0,
        createdAt: new Date()
      };
      return of(newMember).pipe(delay(500));
    }

    return this.http.post<ApiResponse<TeamMember>>(this.apiUrl, dto)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  // PUT update member
  updateMember(id: number, dto: UpdateTeamMemberDto): Observable<TeamMember> {
    if (this.useMockData) {
      return this.getMockMembers().pipe(
        map(members => {
          const member = members.find(m => m.id === id);
          if (!member) throw new Error('Member not found');
          return { ...member, ...dto, updatedAt: new Date() };
        }),
        delay(500)
      );
    }

    return this.http.put<ApiResponse<TeamMember>>(`${this.apiUrl}/${id}`, dto)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  // PATCH update member status
  updateMemberStatus(id: number, status: MemberStatus): Observable<TeamMember> {
    if (this.useMockData) {
      return this.updateMember(id, { status });
    }

    return this.http.patch<ApiResponse<TeamMember>>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  // DELETE member
  deleteMember(id: number): Observable<void> {
    if (this.useMockData) {
      return of(undefined).pipe(delay(500));
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // GET team statistics
  getTeamStats(): Observable<TeamStats> {
    if (this.useMockData) {
      return this.getMockMembers().pipe(
        map(members => ({
          totalMembers: members.length,
          active: members.filter(m => m.status === MemberStatus.ACTIVE).length,
          onLeave: members.filter(m => m.status === MemberStatus.ON_LEAVE).length,
          totalTasks: members.reduce((sum, m) => sum + m.tasks, 0)
        }))
      );
    }

    return this.http.get<ApiResponse<TeamStats>>(`${this.apiUrl}/stats`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  // Mock data for development
  private getMockMembers(): Observable<TeamMember[]> {
    const mockData: TeamMember[] = [
      {
        id: 1, name: 'John Doe', role: 'Senior Developer',
        email: 'john.doe@company.com', phone: '+1 (555) 123-4567',
        status: MemberStatus.ACTIVE, projects: 3, tasks: 12
      },
      {
        id: 2, name: 'Jane Smith', role: 'UI/UX Designer',
        email: 'jane.smith@company.com', phone: '+1 (555) 234-5678',
        status: MemberStatus.ACTIVE, projects: 2, tasks: 8
      },
      {
        id: 3, name: 'Mike Johnson', role: 'Backend Developer',
        email: 'mike.j@company.com', phone: '+1 (555) 345-6789',
        status: MemberStatus.ACTIVE, projects: 4, tasks: 15
      },
      {
        id: 4, name: 'Sarah Williams', role: 'QA Engineer',
        email: 'sarah.w@company.com', phone: '+1 (555) 456-7890',
        status: MemberStatus.ON_LEAVE, projects: 2, tasks: 6
      }
    ];
    return of(mockData).pipe(delay(800)); // Simulate network delay
  }

  // Error handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('TeamMemberService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}