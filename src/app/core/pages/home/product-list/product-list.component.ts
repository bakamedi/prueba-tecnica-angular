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
  selectedProduct: Datum | undefined;

  public productService = inject(ProductService);

  public products = this.productService.products();
  public max = this.productService.max();
  public pagProducts = this.productService.paginatedProducts;

  async ngOnInit() {
    await this.productService.loadProducts();
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts() {
    this.productService.paginateProducts(1);
  }

  onItemsPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const itemsPerPage = parseInt(target.value, 10);
    this.productService.setItemsPerPage(itemsPerPage);
    this.updatePaginatedProducts();
  }

  onSelectForDelete(selectedProduct: Datum):void {
    this.selectedProduct = selectedProduct;
    console.log(this.selectedProduct);
  }

  public async deleteProduct(): Promise<void> {
   await this.productService.removeItem(this.selectedProduct?.id!);
   await this.productService.loadProducts();
   this.updatePaginatedProducts();
  }

}
