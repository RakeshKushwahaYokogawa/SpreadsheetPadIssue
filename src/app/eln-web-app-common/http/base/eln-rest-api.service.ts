import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ElnRestApiService {
  private readonly API_VERSION: string = 'v1';

  constructor(private http: HttpClient) { }

  public get<T>(baseURL: string, endPoint: string): Observable<T> {
    return this.http.get<T>(`${baseURL}/${this.API_VERSION}/${endPoint}`);
  }

  public post<T>(baseURL: string, endPoint: string, data: any | null): Observable<T> {
    return this.http.post<T>(`${baseURL}/${this.API_VERSION}/${endPoint}`, data);
  }

  public patch<T>(baseURL: string, endPoint: string, data: any | null): Observable<T> {
    return this.http.patch<T>(`${baseURL}/${this.API_VERSION}/${endPoint}`, data);
  }

  public put<T>(baseURL: string, endPoint: string, data: any | null): Observable<T> {
    return this.http.put<T>(`${baseURL}/${this.API_VERSION}/${endPoint}`, data);
  }

  public delete<T>(baseURL: string, endPoint: string): Observable<T> {
    return this.http.delete<T>(`${baseURL}/${this.API_VERSION}/${endPoint}`);
  }

  public getByUrl<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  public getBlob(baseURL: string, endPoint: string): Observable<Blob> {
    return this.http.get(`${baseURL}/${this.API_VERSION}/${endPoint}`, { responseType: 'blob' });
  }

  public postWithMultipart<T>(baseURL: string, endPoint: string, data: any | null, file?: File) {
    const input = new FormData();
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (Array.isArray(data[key])) {
        data[key].forEach((value: string) => {
          input.append(key, value);
        });
      } else {
        input.append(key, data[key]);
      }
    });
    if (file) {
      input.append('file', file);
    }
    return this.http.post<T>(
      `${baseURL}/api/${endPoint}`,
      input
    );
  }
}
