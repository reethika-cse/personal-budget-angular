import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data: any;

  constructor(private http: HttpClient) {
    this.data = null;
  }

  fetchData(): Observable<any> {
    if (this.data !== null) {
      return of(this.data);
    } else {
    return this.http.get('http://localhost:3000/budget').pipe(tap((res) => {
      this.data = res;
    })
    );
}}

getData(): any {
  return this.data;
}
}
