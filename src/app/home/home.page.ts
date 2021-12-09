import { AlertController, ModalController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../sdk/core/auth.service";
import { ProductsService } from "../../sdk/core/products.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from "@angular/platform-browser";
import { ProjectConfig } from "src/sdk/Project.config";
import { AppComponent } from "../app.component";
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  loading = false;
  deleteLoading = false;
  products: Products[] = [];
  productsBackup: Products[] = [];
  searchArray: Products[] = [];
  picture: String[] = [];
  emptyarray;
  productIconPath = "assets/icon/book.png";
  skeletonlist = [1, 2, 3, 4, 5];
  selectedProduct: Products;
  image;

  name;
  constructor(
    private router: Router,
    private productsService: ProductsService,
    private modalController: ModalController,
    private alertController: AlertController,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private appComponent: AppComponent
  ) {}

  ngOnInit() {
    try {
      const result = this.appComponent.ngOnInit();
      console.log("result", result);
      this.getAll();
    } catch (ERROR) {
      console.log("error in products fetching", Error);
    }
  }

  baseimageurl = ProjectConfig.getPath() + "//uploadproduct//";

  async getAll() {
    console.log("gett all entered");
    this.loading = true;

    const observable = await this.productsService.getAllProducts();
    observable.subscribe(
      (data) => {
        this.products = data.data.docs;
        this.loading = false;
        console.log("data", data);
        this.productsBackup = this.products;
        console.log("Data received", this.products);
        console.log("Data received", this.products);
        //  this.image = 'http://localhost:3000' + '/uploadproduct/' + data.name;
        //  console.log('imageurl:', this.image);
      },
      (err) => {
        console.log("gett all err", err);
      }
    );
  }

  // mySearch(search){

  //   console.log("mysearch",search);
  //   this.searchArray=this.products.filter(e=> e.name== search);
  //   if (this.searchArray.length == 0) {
  //     console.log("empty array",this.searchArray);
  //     this.loading=false;
  //   }else{
  //     this.products=this.searchArray;
  //     console.log("product found",this.products);
  //   }
  // }

  mySearch(ev: any) {
    this.products = this.productsBackup;
    this.emptyarray = "";
    const search = ev.target.value;

    if (search && search.trim() != "") {
      this.searchArray = this.products.filter((item) => {
        return item.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
      });
      if (this.searchArray.length == 0) {
        console.log("empty array", this.searchArray);
        this.emptyarray = "Can't Find Any Match ";
        this.products = this.searchArray;
        this.loading = false;
      } else {
        this.products = this.searchArray;
        console.log("product found", this.products);
      }
    } else {
      console.log("empty searchbox", search);
      this.products = this.productsBackup;
      this.loading = false;
    }
  }

  openEditPopup(product: Products) {
    // add edit page
  }

  changeUrl(user) {
    const id = user._id;
    console.log("userid", id);
    const url = `home/${id}`;

    this.router.navigateByUrl(url);

    // or

    // this.router.navigate([url]);
  }

  async delete(product) {
    this.selectedProduct = product;
    const alert = await this.alertController.create({
      header: "Confirm!",
      message: `Are you sure you want to delete the book "${product.name}"`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Okay",
          handler: () => {
            this.deleteProduct();
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteProduct() {
    this.deleteLoading = true;
    const observable = await this.productsService.deleteProduct(
      this.selectedProduct._id
    );

    observable.subscribe(
      (data) => {
        console.log("got response from server", data);
        this.deleteLoading = false;
        this.getAll();
      },
      (error) => {
        this.deleteLoading = false;
        console.log("error", error);
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
  mainimage: string;
  stock: number;
  sellername: string;
  image_url: [];
  catageory: string;
  subCatageory: string;
  Feedback: [{}];
  is_deleted: boolean;
  email: string;
}
