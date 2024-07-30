// src/app/core/services/product.service.ts

import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProductInterface, Datum, Convert } from '../models/product.interface';
import { ProductDTO } from '../models/product.dto';

interface State {
  products: Datum[];
  loading: boolean;
  max: number;
  paginatedProducts: Datum[],
  productExist: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3002/bp/products';
  private http = inject(HttpClient);

  #state = signal<State>(
    {
      loading: true,
      products: [],
      max: 0,
      paginatedProducts: [],
      productExist: false,
    }
  );

  public loading = computed(() => this.#state().loading);
  public products = computed(() => this.#state().products);
  public max = computed(() => this.#state().max);
  public paginatedProducts = computed(() => this.#state().paginatedProducts);


  constructor() {
    this.loadProducts();
  }

  public loadProducts() {
    this.http.get<ProductInterface>(this.apiUrl).subscribe(res => {
      this.#state.set({
        ...this.#state(),
        loading: false,
        products: res.data,
        max: res.data.length,
        paginatedProducts: [],
      });
    });
  }

  public verifyIdentifier(id: number | string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }

  public getOne(id: number | string): Observable<Datum> {
    return this.http.get<Datum>(`${this.apiUrl}/${id}`);
  }

  public createItem(productItem: any): Observable<Datum> {
    console.log(productItem);
    return this.http.post<Datum>(this.apiUrl, productItem, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  public updateItem(id: number | string, productItem: ProductDTO): Observable<Datum> {
    return this.http.put<Datum>(`${this.apiUrl}/${id}`, productItem, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  public removeItem(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}