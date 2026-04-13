import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthPayload, BackendAuthPayload, LoginInput, SignupInput } from '../models/auth.model';
import { GraphqlService } from './graphql.service';
import { SessionService } from './session.service';

interface LoginMutationResponse {
  login: BackendAuthPayload;
}

interface SignupMutationResponse {
  signup: BackendAuthPayload;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly graphqlService = inject(GraphqlService);
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);
  private readonly sessionState = signal<AuthPayload | null>(this.sessionService.getSession());

  readonly session = computed(() => this.sessionState());
  readonly currentUser = computed(() => this.sessionState()?.user ?? null);
  readonly token = computed(() => this.sessionState()?.token ?? null);
  readonly isAuthenticated = computed(() => Boolean(this.sessionState()?.token));

  login(input: LoginInput): Observable<AuthPayload> {
    const query = `
      query Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            _id
            username
            email
          }
        }
      }
    `;

    return this.graphqlService
      .execute<LoginMutationResponse, LoginInput>(query, input)
      .pipe(map((response) => this.mapAuthPayload(response.login)), tap((payload) => this.setSession(payload)));
  }

  signup(input: SignupInput): Observable<AuthPayload> {
    const query = `
      mutation Signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
          token
          user {
            _id
            username
            email
          }
        }
      }
    `;

    return this.graphqlService
      .execute<SignupMutationResponse, SignupInput>(query, input)
      .pipe(map((response) => this.mapAuthPayload(response.signup)), tap((payload) => this.setSession(payload)));
  }

  logout(): void {
    this.sessionState.set(null);
    this.sessionService.clearSession();
    void this.router.navigate(['/login']);
  }

  private setSession(payload: AuthPayload): void {
    this.sessionState.set(payload);
    this.sessionService.saveSession(payload);
  }

  private mapAuthPayload(payload: BackendAuthPayload): AuthPayload {
    return {
      token: payload.token,
      user: {
        id: payload.user._id,
        username: payload.user.username,
        email: payload.user.email
      }
    };
  }
}
