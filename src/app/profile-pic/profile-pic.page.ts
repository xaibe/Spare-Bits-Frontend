import { Component, OnInit } from "@angular/core";
import { Plugins, CameraResultType, CameraSource } from "@capacitor/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { ToastService } from "../../sdk/custom/toast.service";
import { UserService } from "../../sdk/core/user.service";
import { AuthService } from "../../sdk/core/auth.service";
import { AppComponent } from "../app.component";
@Component({
  selector: "app-profile-pic",
  templateUrl: "./profile-pic.page.html",
  styleUrls: ["./profile-pic.page.scss"],
})
export class ProfilePicPage implements OnInit {
  photo: SafeResourceUrl;
  nothing: { dataUrl: string };
  imagePreview: string;
  userInfo;
  imageFile;
  pic;
  picdataurl;
  email;
  limit: 1;
  filepresent: boolean;
  loading: boolean;
  randomNumber: number;
  constructor(
    private appComponent: AppComponent,
    private sanitizer: DomSanitizer,
    private router: Router,
    private toastservice: ToastService,
    private userservice: UserService,
    private authservice: AuthService
  ) {}

  ngOnInit() {
    this.filepresent = false;
    this.getdatafromstorage();
  }

  getdatafromstorage() {
    const semail = "email";
    this.authservice
      .getTokenFromStorage(semail)
      .then((data) => {
        this.email = data;
        console.log("fetched profile email", this.email);
      })
      .catch((error) => {
        console.log("fethching error", error);
      });
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(
      image && image.dataUrl
    );
    console.log("photo URL");
    console.log(this.photo);
    this.filepresent = true;
    this.onImagePicked(image.dataUrl);
  }

  onImagePicked(imageData: string | File) {
    if (typeof imageData === "string") {
      try {
        this.imageFile = this.dataURLtoFile(imageData, "profile-image.jpeg");
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      this.imageFile = imageData;
    }
    this.userInfo = {};
    this.userInfo.touched = true;
    this.userInfo.avatar = this.imageFile;
    this.userInfo.email = this.email;
    this.userInfo.extension = this.imageFile.name.split(".").pop();

    console.log("imageFile");
    console.log(this.imageFile);
    //this.accountSettingForm.patchValue({ photoAvatar: imageFile });
  }

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  deleteimage() {
    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.nothing && this.nothing.dataUrl
    );
    this.filepresent = false;
  }

  skippic() {
    this.loading = false;
    this.router.navigateByUrl("/home");
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  async getUser() {
    const observable = await this.userservice.getSingleUser(this.email);
    observable.subscribe(
      async (data) => {
        const picUrl = "avatar";
        console.log("user ", data);
        const userAvatar = data.data.avatar;
        console.log("recieved user avatar", userAvatar);
        this.authservice.saveTokenToStorage(picUrl, userAvatar);
        this.appComponent.ngOnInit();

        const msg = "Success! Image Uploaded Successfully.";
        this.toastservice.presentpositiveToast(msg);
        this.loading = false;
        this.router.navigateByUrl("/home");
      },
      (error) => {
        console.log("recieveing user avatar err", error);
      }
    );
  }

  uploadImage() {
    //  this.randomNumber = this.getRandomInt(500000);

    if (this.filepresent == true) {
      console.log("userservice");

      console.log("userinfo", this.userInfo);
      console.log(
        "image file checking before using user service",
        this.imageFile
      );
      //const id = this.getLostData.controls._id;
      this.userservice
        .uploadAvatar(this.userInfo, this.email, this.imageFile)
        .subscribe(
          (data) => {
            console.log("got response from server", data.message);
            if (
              data.message == "Updated Successfully" ||
              "Created Successfully"
            ) {
              this.getUser();
            } else {
              const messag =
                "Failed! Please check your connection and try again!";
              this.toastservice.presenterrorToast(messag);
              this.loading = false;
            }
          },
          (error) => {
            console.log("error", error);
            const messag =
              "Failed! Please check your connection and try again!";
            this.toastservice.presenterrorToast(messag);
          }
        );
    } else {
      const mess = "Failed! Please Select an image first and Try Again! ";
      this.toastservice.presenterrorToast(mess);
    }
  }
}

//  captureImage() {
//      this.camera.getPicture(this.options).then((imageData) => {
//        // imageData is either a base64 encoded string or a file URI
//        // If it's base64 (DATA_URL):
//        let base64Image = 'data:image/jpeg;base64,' + imageData;
//        this.clickedImage = base64Image;
//      }, (err) => {
//        console.log(err);
//        // Handle error
//      });
//   }
//  }

//   clickedImage;
//   img;
//   constructor() { }

//   ngOnInit() {
//   }

//   selectImage(){}

//   captureImage(){}
// }
