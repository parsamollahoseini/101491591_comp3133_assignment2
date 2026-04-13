import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

interface GraphQlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'http://127.0.0.1:4000/graphql';

  execute<TData, TVariables extends object | undefined = undefined>(
    query: string,
    variables?: TVariables
  ): Observable<TData> {
    return this.http
      .post<GraphQlResponse<TData>>(this.endpoint, {
        query,
        variables
      })
      .pipe(
        map((response) => {
          if (response.errors?.length) {
            throw new Error(response.errors.map((error) => error.message).join(', '));
          }

          if (!response.data) {
            throw new Error('GraphQL response did not include data.');
          }

          return response.data;
        }),
        catchError((error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 0) {
            return throwError(
              () =>
                new Error(
                  `Unable to reach the GraphQL server at ${this.endpoint}. Make sure your backend is running and CORS allows requests from http://localhost:4200.`
                )
            );
          }

          return throwError(() => (error instanceof Error ? error : new Error('Unexpected network error.')));
        })
      );
  }
}
