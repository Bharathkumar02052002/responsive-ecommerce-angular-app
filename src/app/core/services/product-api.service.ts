import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Product } from '../../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly productsUrl = `${environment.apiBaseUrl}/products`;
  private readonly products$ = this.http.get<Product[]>(this.productsUrl).pipe(shareReplay(1));

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productsUrl}/${id}`).pipe(shareReplay(1));
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.productsUrl}/categories`).pipe(shareReplay(1));
  }
}
