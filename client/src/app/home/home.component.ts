import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../types';
import { ProductComponent } from '../components/product/product.component';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule, PaginatorModule, EditPopupComponent, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  products: Product[] = [];
  totalRecords: number = 15;
  rows: number = 5;

  displayAddPopup: boolean = false;
  displayEditPopup: boolean = false;

  toggleEditPopup(product: Product){
    this.selectedProduct = product;
    this.displayEditPopup = !this.displayEditPopup;
  }

  toggleDeletePopup(product: Product){
    if(!product.id)return;
    this.deleteProduct(product.id);
  }

  toggleAddPopup(){
    this.displayAddPopup = !this.displayAddPopup;
    
  }

  selectedProduct: Product = {
    id: 0,
    name: '',
    image: '',
    price: '',
    rating: 0
  };

  constructor(
    private productsService: ProductsService
  ) {}

  onConfirmEdit(product: Product){
    if(!this.selectedProduct.id)return;
    this.editProduct(product, this.selectedProduct.id);
    this.displayEditPopup = false;
  }

  onConfirmAdd(product: Product){
    this.addProduct(product);
    this.displayAddPopup = false;
  }

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
      this.totalRecords = products.total;
      console.log(products.items);
    });
  }

  onProductOutput(product: Product){
    console.log(product, 'Output')
  }

  editProduct(product: Product, id: number){
    this.productsService.editProduct(`http://localhost:3000/clothes/${id}`, product).subscribe(
      {
        next: (data) => {
          console.log(data);
          this.fetchProducts(0, this.rows);
        },
        error: (err) => console.log(err)
      }
    );
  }
  deleteProduct(id: number){
    this.productsService.deleteProduct(`http://localhost:3000/clothes/${id}`).subscribe(
      {
        next: (data) => {
          console.log(data);
          this.fetchProducts(0, this.rows);
        },
        error: (err) => console.log(err)
      }
    );
  }
  addProduct(product: Product){
    this.productsService.addProduct(`http://localhost:3000/clothes`, product).subscribe(
      {
        next: (data) => {
          debugger
          console.log(data);
          this.fetchProducts(0, this.rows);
        },
        error: (err) => console.log(err)
      }
    );
  }
}
