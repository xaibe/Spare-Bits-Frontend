import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { SideMenuService } from './../../../sdk/core/sidemenu.service';
import { AuthService } from './../../../sdk/core/auth.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from './../../../sdk/custom/toast.service';
import { UserService } from '../../../sdk/core/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  constructor(
private sideMenuService: SideMenuService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,   
    private toastService: ToastService,
    private authService: AuthService
  ) {}
  loginForm: FormGroup;
  loading = false;
  clicked =false;
  ngOnInit() {
    this.clicked = false;
    this.formInitializer();
  }

  formInitializer() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  register() {
    this.router.navigateByUrl('/register');
   }

   forgotPassword() {
     console.log('working on it!');
     this.router.navigateByUrl('/forgotpassword');
   }

   ionViewWillEnter() {
    this.loading = false;
    this.clicked = false;
    this.loginForm.reset();
  }

  ionViewDidLoad() {
    this.loginForm.reset();
    }

  save() {
    const loginData = this.loginForm.value;
    console.log('loginData', loginData);
    
    const demail = this.loginForm.value['email'];
    console.log('demail', demail);
    
    // we need to send this data to our node.js server

    this.userService.userLogin(loginData).subscribe(
      data => {
        const token='token';
        const sname='name';
        const semail='email';
        console.log('got response from server', data);
        this.toastService.presentpositiveToast(data.message);
        this.loading = false;
        this.authService.saveTokenToStorage(token,data.token);
       //to show name and pic on sidemenu
       this.authService.saveTokenToStorage(semail,demail);
        this.sideMenuService.publishSomeData(data);
        
        this.router.navigateByUrl('/books');
      },
      error => {
        
        if(error.message=="Http failure response for http://localhost:3000/users/login: 0 Unknown Error")
        {
          this.loginForm.reset()
          this.loading = false;
          console.log('error', error);  
          const mess= "Please Check Your Internet Connection and Try Again ";
          this.toastService.presenterrorToast(mess);
          
        }else{
        this.loginForm.reset()
        this.loading = false;
        console.log('error', error);
        const msg = "Error! Incorrect Email/password Please Try Again. ";
        this.toastService.presenterrorToast(msg);
      }
    }
    );
  }
}
