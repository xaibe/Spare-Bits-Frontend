import { SideMenuService } from '../../../sdk/core/sidemenu.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../sdk/core/user.service';

import { AuthService } from '../../../sdk/core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../../sdk/custom/toast.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../../sdk/custom/loader.service';
import { AlertService } from '../../../sdk/custom/alert.service';
import { Platform } from '@ionic/angular';





@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


    dataretrieved: any;
    email: any;

    getProfileData: FormGroup;
    clickedspinner = false;
    clickededit = false;
    calculatedRating: any;

    constructor(private userservice: UserService,
        private toastservice: ToastService,
        private sideMenuService:SideMenuService,
         private router: Router,
         private authService:AuthService,
        private formBuilder: FormBuilder,
        private loaderservice: LoaderService,
        private platform: Platform,
        private alertservice: AlertService) {
        this.loaderservice.showLoader();
        this.platform.backButton.subscribeWithPriority(10, () => {
            console.log('Handler was called!');
            this.router.navigate(['books']);
        });
    }





    ngOnInit() {
        this.clickedspinner = false;
        this.clickededit = false;
        this.formInitializer();
        setTimeout(() => {
                 this.getdatafromstorage();
             }, 1000);
        
     
    }

    getdatafromstorage(){
        const semail='email';
        this.authService.getTokenFromStorage(semail).then(data => {
          
            this.email = data;
            console.log('fetched profile email',this.email);   
            this.subscrib(this.email);
      
          })
            .catch(error => { console.log('fethching error',error) });
    }

    subscrib(email: string) {
        this.userservice.getSingleUser(email).subscribe(
            userdata => {
                this.dataretrieved = userdata;
                console.log("data retrieved", this.dataretrieved);
                this.loaderservice.hideLoader();

            });
        err => {
            console.log("api error in all request retrieval", err);
            this.alertservice.presentAlertConfirm("Server Down! Please retry", "Error!");
            this.loaderservice.hideLoader();
        };

    }
    

    ngAfterViewInit() {
    }

    formInitializer() {
        this.getProfileData = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            mnumber:['', [Validators.required, Validators.minLength(11)]],
            address: ['', Validators.required],
            rating: ['', Validators.required],
            count: ['', Validators.required]
        });
    }


    editclicked() {
        this.clickededit = true;
    }

    update() {
        this.clickedspinner = true;
        try {
            const getpdata = this.getProfileData.value;
            console.log("profile update form data",getpdata);
            console.log("profile email for update",this.email);
            this.userservice.UpdateUser(getpdata, this.email).subscribe(
                data => {
                    const msg = "Success! Profile Updated Successfully.";
                    this.toastservice.presentpositiveToast(msg); 
                    this.clickedspinner = false;
                    console.log('got response from server', data);
                    this.router.navigate(['home']);
                },
                error => {
                    console.log('error', error);
                    this.alertservice.presentAlertConfirm("Cannot Post Data right!", "Failed!");
                    this.clickedspinner = false;
                }
            );
        } catch (ex) {
            console.log('ex', ex);
        }
    }
}
