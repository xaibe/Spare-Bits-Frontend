import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController, ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { ToastService } from "../../../sdk/custom/toast.service";
import { UserService } from "../../../sdk/core/user.service";
import { AuthService } from "../../../sdk/core/auth.service";
import { CategeoryService } from "../../../sdk/custom/categeory.service";
//import { read } from 'fs';
import { StoresService } from "src/sdk/core/stores.service";
import { __await } from "tslib";

@Component({
  selector: "app-createstore",
  templateUrl: "./createstore.component.html",
  styleUrls: ["./createstore.component.scss"],
})
export class CreatestoreComponent implements OnInit {
  email: any;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private toastservice: ToastService,
    private userservice: UserService,
    private authservice: AuthService,
    private categeoryservice: CategeoryService,
    private toastController: ToastController,
    private storesServices: StoresService,
    private router: Router
  ) {}

  createStoreForm: FormGroup;
  loading = false;
  @Input() store;
  imgidforpro;
  urls: string[] = [];
  filePresent;
  disableBtn: boolean;
  a = false;
  b = false;
  categeorydup: any = [];
  categeory: any = [];
  subcategeory: any = [];
  multipleImages: [] = [];

  ngOnInit() {
    this.categeory = this.categeoryservice.getCategeory();
    console.log("categeory", this.categeory);
    //this.subcategeory=this.categeoryservice.getsubCategeory();

    this.disableBtn = true;
    this.formInitializer();
    this.filePresent = false;
    this.getdatafromstorage();

    if (this.store) {
      console.log("got store", this.store);
      this.createStoreForm.patchValue(this.store);
    }
  }

  formInitializer() {
    this.createStoreForm = this.formBuilder.group({
      _id: [],
      name: ["", [Validators.required, , Validators.pattern("[a-zA-Z ]*")]],
      Phone: ["", [Validators.required, Validators.minLength(11)]],
      Address1: ["", [Validators.required]],
      Address2: [null],
      Province: ["", [Validators.required]],
      City: ["", [Validators.required]],
      Zipcode: ["", [Validators.required, Validators.minLength(5)]],
      discription: [null],
      catageory: [null],
      subCatageory: [null],
      email: [],
      image_url: [],
      mainimage: [],
    });
  }

  getdatafromstorage() {
    const semail = "email";
    this.authservice
      .getTokenFromStorage(semail)
      .then((data) => {
        this.email = data;
        this.createStoreForm.controls["email"].setValue(this.email);
        console.log("fetched profile email", this.email);
      })
      .catch((error) => {
        console.log("fethching error", error);
      });
  }

  async delete(_id) {
    const observable = await this.storesServices.deleteStore(_id);
    observable.subscribe(
      (data) => {
        console.log(
          "got response from server store deleted successfully",
          data
        );
        const msg = "Success! Store Deleted Successfully.";
        this.toastservice.presentpositiveToast(msg);
        this.loading = false;
        this.createStoreForm.reset();
        //optional
        this.modalCtrl.dismiss();
      },
      (error) => {
        this.loading = false;
        this.modalCtrl.dismiss();

        console.log("error in deletion", error);
      }
    );
  }

  onchange(event) {
    console.log("event val without trim", event.target.value);

    let check = event.target.value.trim();
    console.log("check val trimmed", check);
    event.target.value = "";
    event.target.value = check;
    console.log("event val ", event.target.value);
  }

  onchangetext(event) {
    console.log("event val without trim", event.target.value);

    let check = event.target.value.trimStart();
    console.log("check val trimmed", check);
    event.target.value = "";
    event.target.value = check;
    console.log("event val ", event.target.value);
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
    if (this.filePresent == true) {
      const cat = this.createStoreForm.controls["catageory"].value;
      this.categeorydup = this.categeory.filter((e) => e.id == cat);
      if (this.categeorydup == null) {
        console.log("can't find duplicate");
      } else {
        for (var i = 0; i < this.categeorydup.length; i++)
          this.createStoreForm.controls["catageory"].setValue(
            this.categeorydup[i].name
          );
        const cata = this.createStoreForm.controls["catageory"].value;
        console.log("after updating catagory name", cata);
      }
      console.log("catageoryformvalue", cat);
      const scat = this.createStoreForm.controls["subCatageory"].value;
      console.log("subcatageoryformvalue", scat);
      console.log("Form value", this.createStoreForm.value);
      const observable = await this.storesServices.addNewStore(
        this.createStoreForm.value
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
      this.loading = false;
    }
  }

  async updatestore() {
    const observable = await this.storesServices.updateStore(
      this.createStoreForm.value
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
    this.loading = true;
    if (this.store) {
      this.updatestore();
    } else {
      this.addNew();
    }
  }

  async upload() {
    if (this.filePresent == true) {
      let _id;
      console.log("upload entered");
      const name = this.createStoreForm.value["name"];
      if (this.store) {
        _id = this.createStoreForm.controls["_id"].value;
      } else {
        _id = this.imgidforpro;
      }

      //console.log("image file checking before using user service",this.multipleImages);
      //const id = this.getLostData.controls._id;

      const observable = await this.storesServices.uploadAvatar(
        _id,
        name,
        this.email,
        this.multipleImages
      );

      observable.subscribe(
        (data) => {
          console.log("got response from server", data.message);
          if (
            data.message == "Updated Successfully" ||
            "Created Successfully"
          ) {
            if (data.message === "Created Successfully") {
              const msg = "Success! Store added Successfully.";
              this.toastservice.presentpositiveToast(msg);
            }
            if (data.message === "Updated Successfully") {
              const msg = "Success! Store Updated Successfully.";
              this.toastservice.presentpositiveToast(msg);
            }

            this.loading = false;
            this.createStoreForm.reset();
            //optional
            this.modalCtrl.dismiss();
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
          this.loading = false;
        }
      );

      console.log("upload subscribe ended");
    } else {
      if (this.store) {
        const mess = "Failed! Please Select an image first and Try Again! ";
        console.log(mess);
        this.loading = false;
      } else {
        const mess = "Failed! Please Select an image first and Try Again! ";
        this.toastservice.presenterrorToast(mess);
        this.loading = false;
      }
    }
  }

  onselect(e) {
    this.urls.length = 0;
    const name = this.createStoreForm.value["name"];

    if (e.target.files.length > 4) {
      alert("Only 4 files accepted.");
      e.preventDefault();
    } else {
      if (e.target.files) {
        this.multipleImages = e.target.files;

        console.log("multiple images before", this.multipleImages);
        if (this.multipleImages.length === 0) {
          this.filePresent = false;
        } else {
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
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
}
