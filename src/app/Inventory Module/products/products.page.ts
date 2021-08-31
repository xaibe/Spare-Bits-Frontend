import { AlertController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AddnewproductComponent } from './addnewproduct/addnewproduct.component';
import { AuthService } from '../../../sdk/core/auth.service';
import { ProductsService } from '../../../sdk/core/products.service';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ProjectConfig } from 'src/sdk/Project.config';
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  loading = false;
  deleteLoading = false;
  products: Products[] = [];
  picture: String[] = [];
  productIconPath = 'assets/icon/book.png';
  skeletonlist = [1, 2, 3, 4, 5];
  selectedProduct: Products;
image;
email;

name;
  constructor(
    private productsService: ProductsService,
    private modalController: ModalController,
    private alertController: AlertController,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    try{
      this.getdatafromstorage();
  }
  
    catch ( ERROR)
  {
console.log("error in products fetching", Error);
  }
}
 
baseimageurl  =   ProjectConfig.getPath()+"//uploadproduct//";  
// baseimageurl= "http://localhost:3000//uploadproduct//";
 
 public concatenate(str2:string) {
 var str3 = this.baseimageurl.concat(str2.toString());
 console.log("str3",str3);
 this.getSantizeUrl(str3);
 }
public getSantizeUrl(url : string) {
  console.log("sanitized",this.sanitizer.bypassSecurityTrustUrl(url));
    return this.sanitizer.bypassSecurityTrustUrl(url);
}

  async getAll() {
    console.log('gett filter entered');
    this.loading = true;

    //const observable = await this.productsService.getAllProducts();
    const observable = await this.productsService.filterProduct(this.email);
    observable.subscribe(
   async data => {
        this.products = data.data;
        this.loading = false;
        console.log('Data Received', data);

        console.log('Products recieved', this.products);
        
        //  this.image = 'http://localhost:3000' + '/uploadproduct/' + data.name;  
        //  console.log('imageurl:', this.image);

      },
      err => {
        console.log('gett filter err', err);
      }
    );
  }

  openEditPopup(product: Products) {
    this.openAddModal(product);
  }

  getdatafromstorage(){
    const semail='email';
    this.authService.getTokenFromStorage(semail).then(data => {
       this.email = data;
        console.log('fetched profile email',this.email);

        console.log('before gett all');
        this.getAll();
      })
        .catch(error => { console.log('fethching error',error) });
  }

  async openAddModal(product?: Products) {
    const modal = await this.modalController.create({
      component: AddnewproductComponent,
      componentProps: { product }
    });
    modal.onDidDismiss().then(data => {
      console.log('dismissed', data);
      this.getAll();
    });
    await modal.present();
  }


  async delete(product) {
    this.selectedProduct = product;
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: `Are you sure you want to delete the book "${product.name}"`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Okay',
          handler: () => {
            this.deleteProduct();
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteProduct() {
    this.deleteLoading = true;
    const observable = await this.productsService.deleteProduct(
      this.selectedProduct._id
    );

    observable.subscribe(
      data => {
        console.log('got response from server', data);
        this.deleteLoading = false;
        this.getAll();
      },
      error => {
        this.deleteLoading = false;
        console.log('error', error);
      }
    );
  }
}

// Intefacing is Optional


interface Products {
  name: string;
  price: number;
  _id?: string;
  discription: string;
  mainimage:string;
  stock:number;
  image_url:[];
  Delivery_Charges:number;
  Orders:[{}];
  catageory:string;
  Feedback:[{}];
  subCatageory:string;
  is_deleted: boolean;
  email:string;
}