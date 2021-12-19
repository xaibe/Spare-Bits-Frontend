import { SideMenuService } from "../../../sdk/core/sidemenu.service";
import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../sdk/core/user.service";

import { AuthService } from "../../../sdk/core/auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastService } from "../../../sdk/custom/toast.service";
import { Router } from "@angular/router";
import { LoaderService } from "../../../sdk/custom/loader.service";
import { AlertService } from "../../../sdk/custom/alert.service";
import { Platform } from "@ionic/angular";
import { ProjectConfig } from "src/sdk/Project.config";
import { WhiteSpaceValidator } from "src/sdk/custom/whitespacevalidator.service";

@Component({
  selector: "app-users-profile",
  templateUrl: "./users-profile.page.html",
  styleUrls: ["./users-profile.page.scss"],
})
export class UsersProfilePage implements OnInit {
  baseimageurl;
  dataretrieved: any;
  email: any;
  img;
  dupimg;
  filepresent = false;
  imageFile;
  loading = false;
  userInfo;
  getProfileData: FormGroup;
  clickedspinner = false;
  clickededit = false;
  userAddress;
  skeletonlist = [1, 2, 3, 4, 5];
  calculatedRating: any;
  constructor(
    private whiteSpaceValidator: WhiteSpaceValidator,
    private userservice: UserService,
    private toastservice: ToastService,
    private sideMenuService: SideMenuService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private loaderservice: LoaderService,
    private platform: Platform,
    private alertservice: AlertService
  ) {}

  ngOnInit() {
    this.loaderservice.showLoader();
    this.loading = true;
    this.formInitializer();
    this.clickedspinner = false;
    this.clickededit = false;

    setTimeout(() => {
      this.getdatafromstorage();
    }, 1000);
  }

  formInitializer() {
    this.getProfileData = this.formBuilder.group({
      name: [
        null,
        [Validators.required, this.whiteSpaceValidator.spaceValidator],
      ],
      email: ["", [Validators.required, Validators.email]],
      mnumber: ["", [Validators.required, Validators.minLength(11)]],
      address: ["", Validators.required],
      rating: ["", Validators.required],
      count: ["", Validators.required],
    });
  }

  onselect(e) {
    this.imageFile = e.target.files[0];
    this.userInfo = this.imageFile.name.split(".").pop();
    //console.log(" image extension",this.userInfo);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = (events: any) => {
      this.img = events.target.result;
    };
    this.filepresent = true;
  }

  uploadImage() {
    if (this.filepresent == true) {
      //console.log("userservice");
      this.userInfo = "jpeg";
      //console.log("userinfo",this.userInfo);
      //console.log("image file checking before using user service",this.imageFile);
      //const id = this.getLostData.controls._id;
      this.userservice
        .uploadAvatar(this.userInfo, this.email, this.imageFile)
        .subscribe(
          (data) => {
            //console.log('got response from server', data.message);
            if (
              data.message == "Updated Successfully" ||
              "Created Successfully"
            ) {
              const msg = "Success! Profile Updated Successfully.";

              this.toastservice.presentpositiveToast(msg);
              this.clickedspinner = false;
              this.router.navigateByUrl("/users");
            } else {
              const messag =
                "Failed! Please check your connection and try again!";
              this.toastservice.presenterrorToast(messag);
              this.clickedspinner = false;
            }
          },
          (error) => {
            console.log("error", error);
            const messag =
              "Failed! Please check your connection and try again!";
            this.toastservice.presenterrorToast(messag);
            this.clickedspinner = false;
          }
        );
    } else {
      const mess = "Failed! Please Select an image first and Try Again! ";
      this.toastservice.presenterrorToast(mess);
      this.clickedspinner = false;
    }
  }

  getdatafromstorage() {
    const semail = "useremail";
    this.authService
      .getTokenFromStorage(semail)
      .then((data) => {
        this.email = data;
        //console.log('fetched profile email',this.email);
        this.subscrib(this.email);
      })
      .catch((error) => {
        console.log("fethching error", error);
      });
  }

  //for fetching user existing data
  subscrib(email: string) {
    this.loading = true;
    this.userservice.getSingleUser(email).subscribe((userdata) => {
      this.dataretrieved = userdata;
      console.log("recieved user", this.dataretrieved);
      if (
        userdata.Address2 === null ||
        userdata.Address2 === "" ||
        userdata.Address2 === undefined
      ) {
        this.userAddress =
          userdata.data.Address1 +
          "," +
          userdata.data.City +
          "," +
          userdata.data.Province +
          "," +
          userdata.data.Zipcode;
      } else {
        this.userAddress =
          userdata.data.Address1 +
          "," +
          userdata.data.Address2 +
          "," +
          userdata.data.City +
          "," +
          userdata.data.Province +
          "," +
          userdata.data.Zipcode;
      } //console.log("data retrieved", this.dataretrieved);

      this.baseimageurl = ProjectConfig.getPath() + "//uploads//";
      this.img = this.dataretrieved.data.avatar;
      this.dupimg = this.dataretrieved.data.avatar;
      this.loading = false;
      this.loaderservice.hideLoader();
    });
    (err) => {
      console.log("api error in all request retrieval", err);
      const mess = "Error! Server Down , Please Retry";
      this.toastservice.presenterrorToast(mess);

      this.loaderservice.hideLoader();
    };
  }

  editclicked() {
    this.baseimageurl = ProjectConfig.getPath() + "//uploads//";
    this.clickededit = true;
  }

  update() {
    var number = Number(this.getProfileData.value.mnumber);
    this.clickedspinner = true;
    var name = this.getProfileData.value.name.trim();
    if (
      this.dataretrieved.data.email === this.getProfileData.value.email &&
      this.dataretrieved.data.mnumber === number &&
      this.dataretrieved.data.name === name &&
      this.dataretrieved.data.address === this.getProfileData.value.address
    ) {
      if (this.img === this.dupimg) {
        const msg = "Failed! Please Update Info & Try Again ";
        this.toastservice.presenterrorToast(msg);
        this.clickedspinner = false;
        //console.log("no change in the data");
      } else {
        this.uploadImage();
      }
    } else {
      try {
        const getpdata = this.getProfileData.value;
        getpdata.name = name;
        //console.log("profile update form data",getpdata);
        //console.log("profile email for update",this.email);
        this.userservice.UpdateUser(getpdata, this.email).subscribe(
          (data) => {
            if (this.img === this.dupimg) {
              const msg = "Success! Profile Updated Successfully.";
            } else {
              this.uploadImage();
            }
          },
          (error) => {
            console.log("error", error);
            this.alertservice.presentAlertConfirm(
              "Cannot Post Data right!",
              "Failed!"
            );
            this.clickedspinner = false;
          }
        );
      } catch (ex) {
        console.log("ex", ex);
      }
    }
  }
}
