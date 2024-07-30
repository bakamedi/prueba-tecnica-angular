import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ProductService } from '../../../services/products.service';
import { Datum } from '../../../models/product.interface';
declare var $: any; // Declarar jQuery para TypeScript

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  providers: [ProductService]
})
export class ProductListComponent {

  @ViewChild('deleteModal') deleteModal: ElementRef | undefined ;

  itemsPerPage = 5;
  paginatedProducts: Datum[] = [];
  selectedProduct: Datum | undefined;

  public productService = inject(ProductService);

  public products = this.productService.products();
  public max = this.productService.max();

  ngOnInit() {
    this.updatePaginatedProducts();
  }

  private getPaginatedProducts(page: number): Datum[] {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.products.slice(startIndex, endIndex);
  }

  updatePaginatedProducts() {
    this.paginatedProducts = this.getPaginatedProducts(1);
  }

  onItemsPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const itemsPerPage = parseInt(target.value, 10);
    this.itemsPerPage = itemsPerPage;
    this.updatePaginatedProducts();
  }

  onSelectForDelete(selectedProduct: Datum):void {
    this.selectedProduct = selectedProduct;
    console.log(this.selectedProduct);
  }

  deleteProduct(): void {
    this.productService.removeItem(this.selectedProduct?.id!).subscribe(res => {
      this.productService.loadProducts();
    });
  }

}
