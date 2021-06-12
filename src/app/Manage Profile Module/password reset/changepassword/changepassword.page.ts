import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { UserService } from '../../../../sdk/core/user.service';
import { AuthService } from '../../../../sdk/core/auth.service';
import { AlertService } from '../../../../sdk/custom/alert.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {

 
  changePasswordForm: FormGroup;
  fetchedData: void;
  constructor(
    private platform: Platform,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
     private service: UserService, 
     private alertservice: AlertService) { 
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
      this.router.navigate(['login']);
    });
   }
  clicked = false;
  hasverified=false;
  ngOnInit() {
    this.formInitializer();
  }

  formInitializer() {
    this.changePasswordForm = this.formBuilder.group({
       password: [null, [Validators.required]]
    });
  }
    subscrib(fetchedData,pass){
      this.service.updatepassword(this.fetchedData,pass).subscribe(
        data => {
          this.authService.clearLocalStorage();
        this.alertservice.presentAlertConfirm(" You may now login with the New Password","YOUR PASSWORD IS UPDATED!");
      
        this.clicked=false;  
         this.router.navigateByUrl('/login');
        },
    
        error => {      
          
          this.clicked=false;      
          this.alertservice.presentAlertOnly("Please Enter a password more than 6 digits","Failed!");          
        }
        );
        
        
    }
    
    updatePassword(){
    try{
      const semail="email";
      this.authService.getTokenFromStorage(semail).then(data => {
          this.fetchedData = data;
    
          console.log('token email',this.fetchedData);
          
          this.clicked = true;
          const pass = this.changePasswordForm.value;
          console.log('form text',pass);
         
        this.subscrib(this.fetchedData,pass);
        })
          .catch(error => { console.log('fethching error',error) });
          }
          catch (ex) {
            console.log('ex', ex);
        } 
    }
  
 


 
}
