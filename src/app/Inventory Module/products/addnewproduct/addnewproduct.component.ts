import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController, ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { ToastService } from "../../../../sdk/custom/toast.service";
import { UserService } from "../../../../sdk/core/user.service";
import { AuthService } from "../../../../sdk/core/auth.service";
import { CategeoryService } from "../../../../sdk/custom/categeory.service";
//import { read } from 'fs';

import { ProductsService } from "../../../../sdk/core/products.service";
import { ReturnStatement, TmplAstRecursiveVisitor } from "@angular/compiler";
import { waitForAsync } from "@angular/core/testing";
import { __await } from "tslib";
import { WhiteSpaceValidator } from "src/sdk/custom/whitespacevalidator.service";
@Component({
  selector: "app-addnewproduct",
  templateUrl: "./addnewproduct.component.html",
  styleUrls: ["./addnewproduct.component.scss"],
})
export class AddnewproductComponent implements OnInit {
  email: any;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private toastservice: ToastService,
    private userservice: UserService,
    private authservice: AuthService,
    private categeoryservice: CategeoryService,
    private toastController: ToastController,
    private productsService: ProductsService,
    private router: Router,
    private whiteSpaceValidator: WhiteSpaceValidator
  ) {}

  addNewProductForm: FormGroup;
  loading = false;
  @Input() product;
  urls: string[] = [];
  filePresent;
  disableBtn: boolean;
  a = false;
  b = false;
  sellerName;
  categeorydup: any = [];
  categeory: any = [];
  subcategeory: any = [];
  multipleImages: [] = [];
  store_name;
  store_id;
  imgidforpro;

  ngOnInit() {
    this.categeory = this.categeoryservice.getCategeory();
    console.log("categeory", this.categeory);
    //this.subcategeory=this.categeoryservice.getsubCategeory();

    this.disableBtn = true;
    this.formInitializer();
    this.filePresent = false;
    this.getdatafromstorage();

    if (this.product) {
      console.log("got product", this.product);
      this.addNewProductForm.patchValue(this.product);
    }
  }

  formInitializer() {
    this.addNewProductForm = this.formBuilder.group({
      _id: [],
      name: [
        "",
        [
          Validators.required,
          ,
          Validators.pattern("[a-zA-Z ]*"),
          this.whiteSpaceValidator.spaceValidator,
        ],
      ],
      price: [null, [Validators.required]],
      discription: [
        null,
        [Validators.required, this.whiteSpaceValidator.spaceValidator],
      ],

      catageory: [null],
      subCatageory: [null],
      sellername: [],
      email: [],
      stock: [],
      store_name: [],
      store_id: [],
      is_deleted: [false, [Validators.required]],
      image_url: [],
      mainimage: [],
    });
  }

  getdatafromstorage() {
    const semail = "email";
    const sname = "name";
    this.authservice
      .getTokenFromStorage(semail)
      .then((data) => {
        this.email = data;
        this.addNewProductForm.controls["email"].setValue(this.email);
        console.log("fetched profile email", this.email);

        this.authservice
          .getTokenFromStorage(sname)
          .then((data) => {
            this.sellerName = data;
            this.addNewProductForm.controls["sellername"].setValue(
              this.sellerName
            );
            console.log("fetched seller name", this.sellerName);
            this.getstore();
          })
          .catch((error) => {
            console.log("fethching error", error);
          });
      })
      .catch((error) => {
        console.log("fethching error", error);
      });
  }

  getstore() {
    const store_name = "storename";
    const store_id = "storeid";
    this.authservice
      .getTokenFromStorage(store_name)
      .then((data) => {
        console.log("fetched data", data);
        this.store_name = data;
        console.log("fetched store name", this.store_name);
        if (this.store_name != null) {
          this.addNewProductForm.controls["store_name"].setValue(
            this.store_name
          );
        }
      })
      .catch((error) => {
        console.log("fethching error", error);
      });

    this.authservice
      .getTokenFromStorage(store_id)
      .then((data) => {
        this.store_id = data;
        console.log("fetched data", data);
        console.log("fetched store id", this.store_id);
        if (this.store_id != null) {
          this.addNewProductForm.controls["store_id"].setValue(this.store_id);
          console.log("fetched store id", this.store_id);
        }
      })
      .catch((error) => {
        console.log("fethching error", error);
      });
  }
  onChange(event) {
    console.log("before onselect", this.subcategeory);
    this.subcategeory = this.categeoryservice
      .getsubCategeory()
      .filter((e) => e.id == event.target.value);
    if (this.subcategeory.length == 0) {
      console.log("empty array", this.subcategeory);
      this.disableBtn = true;
    } else {
      this.disableBtn = false;
      console.log("after onselect", this.subcategeory);
    }
  }

  async addNew() {
    if (this.filePresent === true) {
      const cat = this.addNewProductForm.controls["catageory"].value;
      this.categeorydup = this.categeory.filter((e) => e.id == cat);
      if (this.categeorydup == null) {
        console.log("can't find duplicate");
      } else {
        for (var i = 0; i < this.categeorydup.length; i++)
          this.addNewProductForm.controls["catageory"].setValue(
            this.categeorydup[i].name
          );
        const cata = this.addNewProductForm.controls["catageory"].value;
        console.log("after updating catagory name", cata);
      }
      console.log("catageoryformvalue", cat);
      const scat = this.addNewProductForm.controls["subCatageory"].value;
      console.log("subcatageoryformvalue", scat);

      const observable = await this.productsService.addNewProduct(
        this.addNewProductForm.value
      );
      observable.subscribe(
        (data) => {
          console.log(
            "got response from server product added successfully",
            data
          );
          this.imgidforpro = data.data._id;

          console.log("pro id after ading product", this.imgidforpro);
          console.log("addnew subscribe ended");
          this.a = true;

          console.log("value of a in addnew", this.a);
          this.upload();
        },
        (error) => {
          this.loading = false;
          this.modalCtrl.dismiss();

          console.log("error in add new", error);
        }
      );
    } else {
      const mess = "Failed! Please Select an image first and Try Again! ";
      this.toastservice.presenterrorToast(mess);
    }
  }

  async updateProduct() {
    const observable = await this.productsService.updateProduct(
      this.addNewProductForm.value
    );

    observable.subscribe(
      async (data) => {
        console.log("got response from server for update products", data);
        if (data.message === "Updated Successfully") {
          if (this.filePresent === true) {
            this.upload();
          } else {
            const mess = "Success! Product Updated Successfully. ";
            this.toastservice.presentpositiveToast(mess);
            this.modalCtrl.dismiss();
            this.loading = false;
          }
        }
      },
      (error) => {
        if (error.error.message === "Unprocessible Entity") {
          if (this.filePresent === true) {
            this.upload();
          } else {
            message: "Unprocessible Entity";
            const msg = "Failed! Please Update Data and Try Again!";
            this.toastservice.presenterrorToast(msg);
            this.loading = false;

            console.log("error", error);
          }
        }
      }
    );
  }

  save() {
    if (this.product) {
      this.updateProduct();
    } else {
      this.addNew();
    }
  }

  async upload() {
    if (this.filePresent === true) {
      let _id;
      console.log("upload entered");
      const name = this.addNewProductForm.value["name"];
      if (this.product) {
        _id = this.addNewProductForm.controls["_id"].value;
      } else {
        _id = this.imgidforpro;
      }

      console.log("name", name);
      console.log("_id", _id);
      console.log("email", this.email);
      //console.log("image file checking before using user service",this.multipleImages);
      //const id = this.getLostData.controls._id;

      const observable = await this.productsService.uploadAvatar(
        _id,
        name,
        this.email,
        this.multipleImages
      );

      observable.subscribe(
        (data) => {
          console.log("got response from server", data.message);
          if (
            data.message === "Updated Successfully" ||
            "Created Successfully"
          ) {
            if (data.message === "Created Successfully") {
              const msg = "Success! Product added Successfully.";
              this.toastservice.presentpositiveToast(msg);
            }
            if (data.message === "Updated Successfully") {
              const msg = "Success! Product Updated Successfully.";
              this.toastservice.presentpositiveToast(msg);
            }

            this.loading = false;
            this.addNewProductForm.reset();
            //optional
            this.modalCtrl.dismiss();

            if (this.store_id === null) {
              this.router.navigateByUrl("/products");
            } else {
              this.router.navigateByUrl("/store");
            }
          } else {
            const messag =
              "Failed! Please check your connection and try again!";
            this.toastservice.presenterrorToast(messag);
            this.loading = false;
          }
        },
        (error) => {
          console.log("error in upload", error);
          const messag = "Failed! Please check your connection and try again!";
          this.toastservice.presenterrorToast(messag);
        }
      );

      console.log("upload subscribe ended");
    } else {
      if (this.product) {
        const mess = "Failed! Please Select an image first and Try Again! ";
        console.log(mess);
      } else {
        const mess = "Failed! Please Select an image first and Try Again! ";
        this.toastservice.presenterrorToast(mess);
      }
    }
  }

  onchange(event) {
    console.log("event val without trim", event.target.value);

    let check = event.target.value.trim();
    console.log("check val trimmed", check);
    event.target.value = "";
    event.target.value = check;
    console.log("event val ", event.target.value);
    // check = check.trim();
    // console.log("check", check);
    // event.target.value = check;
    // console.log("event val", event.target.value);
  }

  onchangetext(event) {
    console.log("event val without trim", event.target.value);

    let check = event.target.value.trimStart();
    console.log("check val trimmed", check);
    event.target.value = "";
    event.target.value = check;
    console.log("event val ", event.target.value);
  }

  onselect(e) {
    this.urls.length = 0;
    const name = this.addNewProductForm.value["name"];

    if (e.target.files.length > 4) {
      alert("Only 4 files accepted.");
      e.preventDefault();
    } else {
      if (e.target.files) {
        this.multipleImages = e.target.files;
        if (this.multipleImages.length === 0) {
          this.filePresent = false;
        } else {
          console.log("multiple images before", this.multipleImages);

          for (let j = 0; j < e.target.files.length; j++) {
            var reader = new FileReader();

            reader.readAsDataURL(e.target.files[j]);
            reader.onload = (events: any) => {
              this.urls.push(events.target.result);
            };
          }
          this.filePresent = true;
        }
      }
    }
  }

  dismiss() {
    if (this.store_id == null) {
      this.modalCtrl.dismiss({
        dismissed: true,
      });
      this.router.navigateByUrl("/products");
    } else {
      this.modalCtrl.dismiss({
        dismissed: true,
      });
      this.router.navigateByUrl("/store");
    }
  }
}
