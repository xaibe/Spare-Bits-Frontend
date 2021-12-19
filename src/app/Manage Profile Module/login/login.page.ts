import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ProjectConfig } from "src/sdk/Project.config";
import { SideMenuService } from "./../../../sdk/core/sidemenu.service";
import { AuthService } from "./../../../sdk/core/auth.service";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastService } from "./../../../sdk/custom/toast.service";
import { UserService } from "../../../sdk/core/user.service";
import { WhiteSpaceValidator } from "src/sdk/custom/whitespacevalidator.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  constructor(
    private sideMenuService: SideMenuService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private whiteSpaceValidator: WhiteSpaceValidator
  ) {}
  loginForm: FormGroup;
  loading = false;
  clicked = false;
  disabled = false;
  userid;
  check;
  ngOnInit() {
    this.clicked = false;
    this.formInitializer();
  }

  formInitializer() {
    this.loginForm = this.formBuilder.group({
      email: [
        null,
        [
          Validators.required,
          Validators.email,
          this.whiteSpaceValidator.spaceValidator,
        ],
      ],
      password: [
        null,
        [Validators.required, this.whiteSpaceValidator.spaceValidator],
      ],
    });
  }

  register() {
    this.router.navigateByUrl("/register");
  }

  forgotPassword() {
    console.log("working on it!");
    this.router.navigateByUrl("/forgotpassword");
  }

  ionViewWillEnter() {
    this.loading = false;
    this.clicked = false;
    this.loginForm.reset();
  }

  ionViewDidLoad() {
    this.loginForm.reset();
  }

  async getuserid(useremail) {
    const observable = await this.userService.getSingleUser(useremail);
    observable.subscribe(
      async (data) => {
        console.log("user ", data);
        this.userid = data.data._id;
        console.log("recieved user id", this.userid);
        this.loginuser();
      },
      (error) => {
        console.log("recieveing user id err", error);
        if (error.status === 401 || error.status === 404) {
          const msg = "User Doen't exists Please Signup First ";
          this.toastService.presenterrorToast(msg);
          this.disabled = false;
          this.loading = false;
          this.clicked = false;
        } else {
          console.log(error.message);
          const mess = "Please Check Your Internet Connection and Try Again ";
          this.toastService.presenterrorToast(mess);
          this.disabled = false;
          this.loading = false;
          this.clicked = false;
        }
      }
    );
  }
  loginuser() {
    // we need to send this data to our node.js server
    const loginData = this.loginForm.value;
    console.log("loginData", loginData);

    const demail = this.loginForm.value["email"];
    console.log("demail", demail);

    this.userService.userLogin(loginData).subscribe(
      (data) => {
        const token = "token";
        const sname = "name";
        const semail = "email";
        const id = "userid";
        const picUrl = "avatar";
        console.log("got response from server", data);
        this.toastService.presentpositiveToast(data.message);
        this.loading = false;
        this.clicked = false;
        this.disabled = false;
        this.authService.saveTokenToStorage(id, this.userid);
        this.authService.saveTokenToStorage(token, data.token);
        //  this.authService.SetItemtoStorage(token, data.token);
        this.authService.saveTokenToStorage(sname, data.name);
        this.authService.saveTokenToStorage(picUrl, data.avatar);
        //to show name and pic on sidemenu
        this.authService.saveTokenToStorage(semail, demail);
        console.log("shiftin to sidemenu service");
        this.sideMenuService.publishSomeData(data);
        console.log("shiftin to products");
        this.router.navigateByUrl("/home");
      },
      (error) => {
        this.check =
          "Http failure response for" +
          ProjectConfig.getPath() +
          " /users/login: 0 Unknown Error";
        if (error.message === this.check) {
          this.loginForm.reset();
          this.disabled = false;
          this.clicked = false;
          this.loading = false;
          console.log("error", error);
          const mess = "Please Check Your Internet Connection and Try Again ";
          this.toastService.presenterrorToast(mess);
        } else {
          this.loginForm.reset();
          this.disabled = false;
          this.clicked = false;
          this.loading = false;
          console.log("error", error);
          const msg = "Error! Incorrect Email/password Please Try Again. ";
          this.toastService.presenterrorToast(msg);
        }
      }
    );
  }

  save() {
    const demail = this.loginForm.value["email"];
    this.disabled = true;
    this.clicked = true;
    console.log("demail", demail);
    this.getuserid(demail);
  }
}
