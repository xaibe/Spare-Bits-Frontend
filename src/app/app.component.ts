import { AuthService } from "./../sdk/core/auth.service";
import { SideMenuService } from "./../sdk/core/sidemenu.service";
import { Storage } from "@ionic/storage";
import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";
import { AlertService } from "../sdk/custom/alert.service";
import { ProjectConfig } from "src/sdk/Project.config";
import { UserService } from "src/sdk/core/user.service";
import { ToastService } from "../sdk/custom/toast.service";
import { BehaviorSubject } from "rxjs";
import { cartService } from "src/sdk/custom/cart.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  name;
  image;
  userexist = false;
  cartItemCount = new BehaviorSubject(0);

  getitemnumber() {
    this.cartItemCount = this.cartService.getCartItemCount();
  }
  public appPages = [
    {
      title: "Home",
      url: "/home",
      icon: "home",
    },
    {
      title: "Profile",
      url: "/profile",
      icon: "people",
    },
    {
      title: "My Products",
      url: "/products",
      icon: "bookmarks",
    },
    {
      title: "My Store",
      url: "/store",
      icon: "storefront",
    },
    {
      title: "Chats",
      url: "/chats",
      icon: "chatbubbles",
    },
    {
      title: "Orders",
      url: "/orders",
      icon: "clipboard",
    },
    {
      title: "Shopping Cart",
      url: "/cart",
      icon: "cart",
    },
    {
      title: "User Guide",
      url: "/about",
      icon: "information-circle",
    },

    {
      title: "Log Out",
      icon: "log-out",
    },
  ];
  fetchedemail: any;
  avatar;
  constructor(
    private platform: Platform,
    private sideMenuService: SideMenuService,
    private storage: Storage,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private toastService: ToastService,
    private cartService: cartService
  ) {
    this.initializeApp();
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //      this.storage.clear();
      //    localStorage.removeItem("name");
    });
  }

  getname() {
    const sname = "name";
    this.authService
      .getTokenFromStorage(sname)
      .then((data) => {
        this.name = data;

        this.getavatar();
      })
      .catch((error) => {
        console.log("fethching name error", error);
      });
  }

  getavatar() {
    const imgUrl = "avatar";
    this.authService
      .getTokenFromStorage(imgUrl)
      .then((data) => {
        this.avatar = data;

        this.setsidemenudata();
      })
      .catch((error) => {
        console.log("fethching name error", error);
      });
  }

  setsidemenudata() {
    try {
      if (this.avatar === null || this.avatar === undefined) {
        if (this.name === null || this.name === undefined) {
          this.userexist = false;
        }

        this.userexist = true;
      } else {
        this.image = ProjectConfig.getPath() + "/uploads/" + this.avatar;

        this.userexist = true;
      }
    } catch (ex) {
      console.log("error getting data from side menu", ex);
    }
  }

  sidemenuservicefunction() {
    this.sideMenuService.getObservable().subscribe((data) => {
      this.name = data.name;
      try {
        if (data.avatar === null || data.avatar === undefined) {
          if (data.name === null || data.name === undefined) {
            this.userexist = false;
          }
          this.userexist = true;
        } else {
          this.image = ProjectConfig.getPath() + "/uploads/" + data.avatar;
          this.userexist = true;
        }
      } catch (ex) {
        console.log("cant find image", ex);
      }
    });
  }
  ngOnInit() {
    this.userexist = true;
    this.getname();
    if (this.userexist) {
    } else {
      this.sidemenuservicefunction();
    }
  }

  ngOnDestroy() {
    //   this.storage.clear();
    //   localStorage.removeItem('name');
    //   this.userexist = false;
  }

  logout() {
    this.userexist = false;
    this.name = "";
    this.image = "";
    const msg = "Logged Out Successfully!";
    this.storage.clear();
    localStorage.removeItem("name");
    localStorage.removeItem("avatar");
    this.toastService.presentpositiveToast(msg);
    this.authService.logout();
  }
}
