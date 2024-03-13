import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../types';
import { ProductComponent } from '../components/product/product.component';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule, PaginatorModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  products: Product[] = [];
  totalRecords: number = 15;
  rows: number = 5;

  constructor(
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.fetchProducts(0, this.rows);
  }

  onPageChange(event: any){ 
    this.fetchProducts(event.page, event.rows);
  }

  fetchProducts(page: number, perPage: number) {
    this.productsService.getProducts('http://localhost:3000/clothes', { page: page, perPage: perPage})
    .subscribe((products: Products) => {
      this.products = products.items;
      console.log(products.items);
    });
  }

  onProductOutput(product: Product){
    console.log(product, 'Output')
  }
}
