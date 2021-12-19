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
import { WhiteSpaceValidator } from "src/sdk/custom/whitespacevalidator.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  dataretrieved: any;
  email: any;

  getProfileData: FormGroup;
  clickedspinner = false;
  clickededit = false;
  calculatedRating: any;
  disable = false;

  constructor(
    private userservice: UserService,
    private toastservice: ToastService,
    private sideMenuService: SideMenuService,
    private router: Router,
    private whiteSpaceValidator: WhiteSpaceValidator,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private loaderservice: LoaderService,
    private platform: Platform,
    private alertservice: AlertService
  ) {}

  ngOnInit() {
    this.loaderservice.showLoader();
    this.clickedspinner = false;
    this.clickededit = false;
    this.formInitializer();

    this.getdatafromstorage();
  }

  getdatafromstorage() {
    const semail = "email";
    this.authService
      .getTokenFromStorage(semail)
      .then((data) => {
        this.email = data;
        console.log("fetched profile email", this.email);
        this.subscrib(this.email);
      })
      .catch((error) => {
        console.log("fethching error", error);
      });
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
    // check = check.trim();
    // console.log("check", check);
    // event.target.value = check;
    // console.log("event val", event.target.value);
  }

  subscrib(email: string) {
    this.userservice.getSingleUser(email).subscribe((userdata) => {
      this.loaderservice.hideLoader();
      this.dataretrieved = userdata;
      console.log("data retrieved", this.dataretrieved);
    });
    (err) => {
      console.log("api error in all request retrieval", err);
      const msg = "Error! Server Down! Please retry";
      this.toastservice.presenterrorToast(msg);
      this.loaderservice.hideLoader();
    };
  }

  ngAfterViewInit() {}

  formInitializer() {
    this.getProfileData = this.formBuilder.group({
      name: [
        "",
        [Validators.required, this.whiteSpaceValidator.spaceValidator],
      ],
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          this.whiteSpaceValidator.spaceValidator,
        ],
      ],
      mnumber: ["", [Validators.required]],
      Address1: [
        "",
        [Validators.required, this.whiteSpaceValidator.spaceValidator],
      ],
      Address2: [null, this.whiteSpaceValidator.spaceValidator],
      Province: [
        "",
        [Validators.required, this.whiteSpaceValidator.spaceValidator],
      ],
      City: [
        "",
        [Validators.required, this.whiteSpaceValidator.spaceValidator],
      ],
      Zipcode: ["", [Validators.required]],

      rating: [""],
      count: [""],
    });
  }

  editclicked() {
    this.clickededit = true;
  }

  updatename(name, email, getpdata) {
    var newname = {
      name: name,
    };
    const sname = "name";
    const semail = "email";
    this.userservice.UpdateName(newname, this.email).subscribe(
      (data) => {
        console.log("data recived", data);
        if (data.message === "Updated Successfully") {
          this.authService.saveTokenToStorage(sname, name);
          //to show name and pic on sidemenu
          this.authService.saveTokenToStorage(semail, this.email);
          this.sideMenuService.publishSomeData(getpdata);
          const msg = "Success! Profile Updated Successfully.";
          this.toastservice.presentpositiveToast(msg);
          this.clickedspinner = false;
          this.disable = false;
          console.log("got response from server", data);
          this.router.navigate(["home"]);
        } else {
          const msg = "Failed! Please To update name Try Again!";
          this.toastservice.presenterrorToast(msg);
        }
      },
      (error) => {
        console.log("error", error);
        const msg = "Failed! Please To update name Try Again!";
        this.toastservice.presenterrorToast(msg);
        this.disable = false;
        this.clickedspinner = false;
      }
    );
  }

  update() {
    this.clickedspinner = true;
    this.disable = true;
    if (this.getProfileData.invalid) {
      const getpdata = this.getProfileData.value;
      console.log("profile update form data", getpdata);
      const msg = "ERROR! Please Enter Valid values.";
      this.toastservice.presenterrorToast(msg);
      this.clickedspinner = false;
      this.disable = false;
    } else {
      try {
        const sname = "name";
        const semail = "email";
        const getpdata = this.getProfileData.value;
        console.log("profile update form data", getpdata);
        var name = this.getProfileData.value.name.trim();
        getpdata.name = name;
        console.log("profile email for update", this.email);
        this.userservice.UpdateUser(getpdata, this.email).subscribe(
          (data) => {
            if (this.dataretrieved.data.name != name) {
              this.updatename(name, this.email, getpdata);
            } else {
              this.authService.saveTokenToStorage(sname, getpdata.name);
              //to show name and pic on sidemenu
              this.authService.saveTokenToStorage(semail, this.email);
              this.sideMenuService.publishSomeData(getpdata);
              const msg = "Success! Profile Updated Successfully.";
              this.toastservice.presentpositiveToast(msg);
              this.clickedspinner = false;
              this.disable = false;
              console.log("got response from server", data);
              this.router.navigate(["home"]);
            }
          },
          (error) => {
            console.log("error", error);
            const msg = "Failed! Please Update Data and Try Again!";
            this.toastservice.presenterrorToast(msg);
            this.disable = false;
            this.clickedspinner = false;
          }
        );
      } catch (ex) {
        this.disable = false;
        this.clickedspinner = false;
        console.log("ex", ex);
      }
    }
  }
}
