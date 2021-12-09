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

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  imagePreview: string;
  userInfo;
  filePresent;
  public ID: String;
  loading = false;
  public clicked = false;
  isLoadingImgUpload = false;
  isLoading = false;
  randomNumber: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router
  ) {}
  registerForm: FormGroup;

  ngOnInit() {
    this.formInitializer();
  }

  formInitializer() {
    this.registerForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      mnumber: ["", [Validators.required, Validators.minLength(11)]],
      address: ["", [Validators.required]],
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

  save() {
    if (this.registerForm.invalid) {
      return;
    } else {
      this.clicked = true;
      this.loading = true;
      const semail = "email";
      const emailData = this.registerForm.value["email"];
      console.log("tokenemail", emailData);

      this.userService.userRegister(this.registerForm.value).subscribe(
        (data) => {
          console.log("got response from server", data.message);
          if (data.message == "This email has been registered already") {
            const mess = "This email has been registered already";
            this.toastService.presenterrorToast(data.message);
            this.loading = false;
            this.clicked = false;
          } else {
            this.authService.saveTokenToStorage(semail, emailData);
            this.toastService.presentpositiveToast(data.message);
            this.loading = false;
            this.clicked = false;
            this.router.navigateByUrl("/profile-pic");
          }
        },
        (error) => {
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
