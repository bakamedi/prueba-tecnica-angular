import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchComponent } from "./search/search.component";
import { AddProductComponent } from "./add-product/add-product.component";
import { ProductListComponent } from "./product-list/product-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    SearchComponent,
    AddProductComponent,
    ProductListComponent,
  ],
  templateUrl: './home.component.html',
  styles: ``
})
export default class HomeComponent {

}
