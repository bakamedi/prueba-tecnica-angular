// src/app/core/services/product.service.ts

import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

import { ProductInterface, Datum } from '../models/product.interface';
import { ProductDTO } from '../models/product.dto';

interface State {
  products: Datum[];
  loading: boolean;
  max: number;
  itemsPerPage: number;
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
      itemsPerPage: 5,
      paginatedProducts: [],
      productExist: false,
    }
  );

  public loading = computed(() => this.#state().loading);
  public products = computed(() => this.#state().products);
  public max = computed(() => this.#state().max);
  public paginatedProducts = computed(() => this.#state().paginatedProducts);

  public async loadProducts(): Promise<void> {
    try {
      const res = await firstValueFrom(this.http.get<ProductInterface>(this.apiUrl));

      this.#state.set({
        ...this.#state(),
        loading: false,
        products: res.data,
        max: res.data.length,
        paginatedProducts: res.data.slice(0, 5),
      });

    } catch (error) {
      console.error('Error loading products:', error);
      // Manejo de errores, si es necesario
      this.#state.set({
        ...this.#state(),
        loading: false,
      });
    }
  }

  public paginateProducts(page: number): void {
    const startIndex = (page - 1) * this.#state().itemsPerPage;
    const endIndex = startIndex + this.#state().itemsPerPage;
    const produtcs = [...this.#state().products];
    this.#state.set({
      ...this.#state(),
      max: produtcs.length,
      paginatedProducts: produtcs.slice(startIndex, endIndex),
    });

  }

  public setItemsPerPage(itemsPerPage: number): void {
    this.#state.set({
      ...this.#state(),
      itemsPerPage: itemsPerPage,
    });
  }

  public async verifyIdentifier(id: number | string): Promise<boolean> {
    return await firstValueFrom(this.http.get<boolean>(`${this.apiUrl}/verification/${id}`));
  }

  public getOne(id: number | string): Observable<Datum> {
    return this.http.get<Datum>(`${this.apiUrl}/${id}`);
  }

  public async createItem(productItem: any): Promise<Datum> {
    return await firstValueFrom(this.http.post<Datum>(this.apiUrl, productItem, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }));
  }

  public updateItem(id: number | string, productItem: ProductDTO): Observable<Datum> {
    return this.http.put<Datum>(`${this.apiUrl}/${id}`, productItem, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  public async removeItem(id: number | string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }

}