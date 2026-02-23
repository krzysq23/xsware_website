import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './http.tokens';

type Options = {
  headers?: HttpHeaders | Record<string, string>;
  params?: HttpParams | Record<string, string | number | boolean>;
  context?: HttpContext;
  withCredentials?: boolean;
  responseType?: 'json' | 'blob';
};

@Injectable({ providedIn: 'root' })
export class ApiClient {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  get<T>(path: string, options: Options = {}): Observable<T> {
    return this.http.get<T>(this.url(path), this.opts(options));
  }

  post<T>(path: string, body: unknown, options: Options = {}): Observable<T> {
    return this.http.post<T>(this.url(path), body, this.opts(options));
  }

  put<T>(path: string, body: unknown, options: Options = {}): Observable<T> {
    return this.http.put<T>(this.url(path), body, this.opts(options));
  }

  patch<T>(path: string, body: unknown, options: Options = {}): Observable<T> {
    return this.http.patch<T>(this.url(path), body, this.opts(options));
  }

  delete<T>(path: string, options: Options = {}): Observable<T> {
    return this.http.delete<T>(this.url(path), this.opts(options));
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private opts(options: Options) {
    return {
      withCredentials: options.withCredentials ?? true,
      headers: options.headers,
      params: options.params as any,
      context: options.context,
    };
  }

  getBlob(path: string, options: Options = {}): Observable<Blob> {
    return this.http.get(this.url(path), {
      withCredentials: options.withCredentials ?? true,
      headers: options.headers,
      params: options.params as any,
      context: options.context,
      responseType: 'blob',
    });
  }
}