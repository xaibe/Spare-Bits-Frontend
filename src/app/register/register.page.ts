import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AlertService } from "../../sdk/custom/alert.service";
import { UserService } from "../../sdk/core/user.service";
import { ToastService } from "../../sdk/custom/toast.service";
import { AuthService } from "../../sdk/core/auth.service";
import { SideMenuService } from "src/sdk/core/sidemenu.service";
import { WhiteSpaceValidator } from "src/sdk/custom/whitespacevalidator.service";
import { saveConfig } from "@ionic/core";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  imagePreview: string;
  userInfo;
  startverify;
  filePresent;
  verifyCode;
  public ID: String;
  loading;
  blockemail;
  public clicked = false;
  isLoadingImgUpload = false;
  isLoading = false;
  randomNumber: any;

  constructor(
    private sideMenuService: SideMenuService,
    private whiteSpaceValidator: WhiteSpaceValidator,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router
  ) {}
  registerForm: FormGroup;

  ngOnInit() {
    this.loading = false;
    this.blockemail = false;
    this.startverify = false;
    this.formInitializer();
  }

  formInitializer() {
    this.registerForm = this.formBuilder.group({
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
      verifycode: [],
      password: ["", [Validators.required, Validators.minLength(5)]],
      //image: ['', [Validators.required,  mimeType ]],

      confirm_password: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          this.matchOtherValidator("password"),
        ],
      ],
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.registerForm.patchValue({ image: file });
    this.registerForm.get("image").updateValueAndValidity();
    const reader = new FileReader();

    reader.onload = () => {
      this.userInfo = {};
      this.userInfo.touched = true;
      this.userInfo.avatar = (<FileReader>event.target).result;
      this.userInfo.file = file;
      this.userInfo.extension = file.name.split(".").pop();
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.filePresent = true;
  }

  //image upload logic
  onFileChange(e) {
    console.log("e", e);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.userInfo = {};
      this.userInfo.touched = true;
      this.userInfo.avatar = (<FileReader>event.target).result;
      this.userInfo.file = file;
      this.userInfo.extension = file.name.split(".").pop();
    };
    this.filePresent = true;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  login() {
    this.loading = false;
    this.router.navigateByUrl("/login");
  }

  // uploadImage(){

  //   this.randomNumber = this.getRandomInt(500000);

  //   console.log('random number:',this.randomNumber);
  //   if (this.filePresent) {

  //     //const id = this.getLostData.controls._id;
  //     this.userService.uploadAvatar(this.userInfo, this.userInfo.file,this.randomNumber)
  //       .subscribe(
  //         async response => {
  //           console.log('respoe->', response);

  //           this.ID = response._id;
  //           console.log('iddd= ',this.ID);
  //           const msg = "Success! Image Uploaded Successfully.";
  //           this.toastService.presentpositiveToast(msg);
  //         },
  //         error => {
  //           console.log('error', error);
  //           this.alertService.presentAlertConfirm("Cannot Upload Image!","Failed!");
  //           this.isLoadingImgUpload = false;
  //         }
  //       );
  //   }
  // }

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
  saveDataToLocalsStorage(data) {
    const token = "token";
    const sname = "name";
    const semail = "email";
    const id = "userid";

    this.authService.saveTokenToStorage(id, data.userid);
    this.authService.saveTokenToStorage(token, data.token);
    //  this.authService.SetItemtoStorage(token, data.token);
    this.authService.saveTokenToStorage(sname, data.name);
    //to show name and pic on sidemenu
    this.authService.saveTokenToStorage(semail, data.email);
    this.sideMenuService.publishSomeData(data);
  }

  save() {
    this.clicked = true;
    console.log("loading status", this.loading);
    this.verifyCode = (Math.floor(Math.random() * 10000) + 10000)
      .toString()
      .substring(1);
    console.log(this.verifyCode);
    const email = this.registerForm.value.email;
    const body = {
      verifycode: this.verifyCode,
      email: email,
    };
    this.userService.sendNewUserMail(body).subscribe(
      (data) => {
        console.log("email sent", data);
        const mess =
          "Please check your email and Esnter verification code below";
        this.toastService.presentpositiveToast(mess);
        console.log("loading status", this.loading);
        this.startverify = true;
        this.blockemail = true;
        this.clicked = false;
      },
      (error) => {
        this.clicked = false;
        console.log("error", error);
        if (error.error.message === "This user already exists. ") {
          const msg =
            "Error! Can't Registered, User Already Exists with this email. ";
          this.toastService.presenterrorToast(msg);
        } else if (
          error.error.message === "Can't send email please try again"
        ) {
          const msg =
            "Error! Wrong Email Adress Check Your Email & Try Again . ";
          this.toastService.presenterrorToast(msg);
        } else {
          const msg = "Error! Can't Register Please Try Again. ";
          this.toastService.presenterrorToast(msg);
        }
      }
    );
  }

  verify() {
    this.clicked = true;
    console.log(
      "register form verify code",
      this.registerForm.value.verifycode
    );
    if (
      this.registerForm.value.verifycode === null ||
      this.registerForm.value.verifycode === undefined ||
      this.registerForm.value.verifycode === ""
    ) {
      const mess =
        "Error! Please First Enter the Verification Code sent on the given Email.";
      this.toastService.presenterrorToast(mess);
    } else {
      if (this.registerForm.value.verifycode === this.verifyCode) {
        console.log("code matched");
        this.register();
      } else {
        const mess =
          " Please Enter A Valid Verification Code sent on the given Email.";
        this.toastService.presenterrorToast(mess);
        console.log("wrong code");
        this.clicked = false;
      }
    }
  }

  register() {
    if (this.registerForm.invalid) {
      const mess = "Invalid Details! Update Details with Red UnderLine ";
      this.toastService.presenterrorToast(mess);
    } else {
      this.clicked = true;
      this.loading = true;

      console.log("register form values", this.registerForm.value);
      this.userService.userRegister(this.registerForm.value).subscribe(
        (data) => {
          console.log("got response from server", data.message);
          if (data.message == "This email has been registered already") {
            const mess = "This email has been registered already";
            this.toastService.presenterrorToast(data.message);
            this.loading = false;
            this.clicked = false;
          } else {
            this.saveDataToLocalsStorage(data);
            this.toastService.presentpositiveToast(data.message);
            this.loading = false;
            this.clicked = false;
            this.router.navigateByUrl("/profile-pic");
          }
        },
        (error) => {
          this.clicked = false;
          this.loading = false;
          console.log("error", error);
          const msg = "Error! Can't Registered Please Try Again. ";
          this.toastService.presenterrorToast(msg);
        }
      );
    }
  }

  // save() {
  //   if (this.registerForm.invalid)
  //   {
  //     return;
  //   }
  //   else{
  //     this.loading = true;

  //     this.userService.userRegister(this.registerForm.value).subscribe(
  //       data => {
  //         console.log('got response from server', data);
  //         this.loading = false;
  //         this.router.navigateByUrl('/login');
  //       },
  //       error => {
  //         this.loading = false;
  //         console.log('error', error);
  //       }
  //     );
  //   }
  // }

  matchOtherValidator(otherControlName: string) {
    return (control: AbstractControl): { [key: string]: any } => {
      const otherControl: AbstractControl = control.root.get(otherControlName);

      if (otherControl) {
        const subscription: Subscription = otherControl.valueChanges.subscribe(
          () => {
            control.updateValueAndValidity();
            subscription.unsubscribe();
          }
        );
      }

      return otherControl && control.value !== otherControl.value
        ? { match: true }
        : null;
    };
  }
}
