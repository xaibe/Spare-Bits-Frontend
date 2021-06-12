import { AuthService } from './../sdk/core/auth.service';
import { SideMenuService } from './../sdk/core/sidemenu.service';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AlertService } from '../sdk/custom/alert.service';
import { BookyConfig } from 'src/sdk/booky.config';
import{UserService} from 'src/sdk/core/user.service'
import { ToastService } from '../sdk/custom/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  name;
  image;
  userexist = false;
  public appPages = [
    
    {
      title: 'Profile',
      url: '/profile',
      icon: 'people'
    },
    {
      title: 'My Posts',
      url: '/myposts',
      icon: 'bookmarks'
    },
    {
      title: 'Chats',
      url: '/openchat',
      icon: 'chatbubbles'
    },
    {
      title: 'User Guide',
      url: '/about',
      icon: 'information-circle-outline'
    },
    
    {
      title: 'Log Out',
      icon: 'log-out',
    }
  ];
  fetchedemail: any;
  
  constructor(
    private platform: Platform,
    private sideMenuService:SideMenuService,
    private storage: Storage,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private alertService :AlertService,
    private authService: AuthService,
    private router:Router,
    private userService:UserService,
    private toastService: ToastService,
  ) { 
    this.initializeApp();
 
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.clear();
      localStorage.removeItem('name');

  //     this.sideMenuService.getObservable().subscribe((data) => {
  //       console.log('Data received', data);
  //       this.name = data.name;
  //    if(this.name){
  //     console.log('Data received', this.name);
  //      this.userexist = true;
  //    }
  //  else{
  //      this.userexist = false;
  //    }
        
  //   });

    });
  }


  

  ngDoCheck() {

  //     this.sideMenuService.getObservable().subscribe((data) => {
  //       console.log('Data received', data);
  //       this.name = data.name;
  //    if(this.name){
  //     console.log('Data received', this.name);
  //      this.userexist = true;
  //    }
  //  else{
  //      this.userexist = false;
  //    }
        
  //   });

   
    }
  
   ngOnInit() {
  //   try{
  //     const semail="email";
  //     this.authService.getTokenFromStorage(semail).then(data => {
  //         this.fetchedemail = data;
    
  //         console.log('token email',this.fetchedemail);
          
  //       })
  //         .catch(error => {
  //            console.log('fethching error',error) });
  //         }
  //         catch (ex) {
  //           console.log('ex', ex);
  //       } 
  
  this.sideMenuService.getObservable().subscribe((data) => {
    console.log('Data received', data);
    this.name = data.name;
    console.log('avatar before user service',data.avatar);
    // this.userService.retrieveAvatar(data.avatar).subscribe(
    //   img => {
    //     console.log('got response from server', img);
    //     this.image=img;
      
        
    //   },
    //   error => {
    //     console.log('error', error);  
    //       const mess= "Unable to get profile image ";
    //       this.toastService.presenterrorToast(mess);
    //   }
    //   );
     //this.image = BookyConfig.getPath() + '/users/retrieveAvatar/' + data.avatar;
     this.image = BookyConfig.getPath() + '/uploads/' + data.avatar;  
     console.log('imageurl:', this.image);
       
 if(this.image){
  console.log('Data received', this.name);
  console.log('Data received', this.image);
   this.userexist = true;
 }
else{
   this.userexist = false;
 }
    
});

    }
  

  ngOnDestroy() {
    this.storage.clear();
    localStorage.removeItem('name');
    this.userexist = false;
  }
  
  logout(){
  this.alertService.presentAlertConfirm("Logged Out Successfully!", "Success");
    this.authService.logout();
    this.router.navigateByUrl('/login');    
  }
  
    
  }
