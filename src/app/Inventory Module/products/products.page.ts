import { AlertController, ModalController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";
import { AddnewproductComponent } from "./addnewproduct/addnewproduct.component";
import { AuthService } from "../../../sdk/core/auth.service";
import { ProductsService } from "../../../sdk/core/products.service";
import { Observable } from "rxjs";
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from "@angular/platform-browser";
import { ProjectConfig } from "src/sdk/Project.config";
import { Router } from "@angular/router";
@Component({
  selector: "app-products",
  templateUrl: "./products.page.html",
  styleUrls: ["./products.page.scss"],
})
export class ProductsPage implements OnInit {
  orders: [];
  searchval;
  searchph;
  probackup;
  searchArray;
  emptyarray;
  loading = false;
  deleteLoading = false;
  products: Products[] = [];
  picture: String[] = [];
  productIconPath = "assets/icon/book.png";
  skeletonlist = [1, 2, 3, 4, 5];
  selectedProduct: Products;
  image;
  email;
  notfound;
  name;
  constructor(
    private productsService: ProductsService,
    private modalController: ModalController,
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.notfound = true;
    this.emptyarray = true;
    try {
      this.getdatafromstorage();
    } catch (ERROR) {
      console.log("error in products fetching", Error);
    }
  }

  baseimageurl = ProjectConfig.getPath() + "//uploadproduct//";

  async getAll() {
    console.log("gett filter entered");
    this.loading = true;
    this.notfound = true;
    //const observable = await this.productsService.getAllProducts();
    const observable = await this.productsService.filterProduct(this.email);
    observable.subscribe(
      async (data) => {
        this.products = data.data;
        this.probackup = data.data;
        this.loading = false;
        console.log("Data Received", data);

        console.log("Products recieved", this.products);
        if (this.products.length === 0) {
          this.notfound = false;
        } else {
          this.notfound = true;
        }
      },
      (err) => {
        console.log("gett filter err", err);
      }
    );
  }

  openEditPopup(product: Products) {
    this.openAddModal(product);
  }
  changeUrl(product) {
    const id = product._id;
    console.log("product", id);
    const url = `home/${id}`;

    this.router.navigateByUrl(url);

    // or

    // this.router.navigate([url]);
  }
  mySearch(ev: any) {
    this.products = this.probackup;
    this.emptyarray = true;
    const search = ev.target.value;

    if (search && search.trim() != "") {
      this.searchArray = this.products.filter((item) => {
        return item.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
      });
      if (this.searchArray.length == 0) {
        //console.log("empty array",this.searchArray);
        this.emptyarray = false;
        this.products = this.searchArray;
        this.loading = false;
      } else {
        this.products = this.searchArray;
        //console.log("product found",this.products);
      }
    } else {
      //console.log("empty searchbox",search);
      // Reset the field
      ev.target.value = "";
      this.products = this.probackup;
      this.loading = false;
    }
  }

  getdatafromstorage() {
    const semail = "email";
    this.authService
      .getTokenFromStorage(semail)
      .then((data) => {
        this.email = data;
        console.log("fetched profile email", this.email);

        console.log("before gett all");

        this.getAll();
        this.removestore();
      })
      .catch((error) => {
        console.log("fethching error", error);
      });
  }

  removestore() {
    const store_name = "storename";
    const store_id = "storeid";

    this.authService
      .removeTokenFromStorage(store_name)
      .then((data) => {
        console.log("store name removed", data);
      })
      .catch((error) => {
        console.log("removing store name error", error);
      });

    this.authService
      .removeTokenFromStorage(store_id)
      .then((data) => {
        console.log("store id removed", data);
      })
      .catch((error) => {
        console.log("removing store id error", error);
      });
  }

  async openAddModal(product?: Products) {
    const modal = await this.modalController.create({
      component: AddnewproductComponent,
      componentProps: { product },
    });
    modal.onDidDismiss().then((data) => {
      console.log("dismissed", data);
      this.getAll();
    });
    await modal.present();
  }

  async delete(product) {
    this.selectedProduct = product;
    const alert = await this.alertController.create({
      header: "Confirm!",
      message: `Are you sure you want to delete the product "${product.name}"`,
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
  image_url: [];
  sellername: string;
  Delivery_Charges: number;
  Orders: [{}];
  store_name: string;
  store_id: string;
  catageory: string;
  Feedback: [{}];
  subCatageory: string;
  is_deleted: boolean;
  email: string;
}
