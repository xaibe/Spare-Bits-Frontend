import { Component, Injectable, OnInit } from "@angular/core";
import { cartService } from "src/sdk/custom/cart.service";
import { ProjectConfig } from "src/sdk/Project.config";
import { AuthService } from "src/sdk/core/auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserService } from "src/sdk/core/user.service";
import { OrdersService } from "src/sdk/core/orders.service";
import { Router } from "@angular/router";
import { ToastService } from "src/sdk/custom/toast.service";
import { ProductsService } from "src/sdk/core/products.service";
import { AppComponent } from "src/app/app.component";
import { ProductsPageRoutingModule } from "src/app/Inventory Module/products/products-routing.module";
import { Inject } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.page.html",
  styleUrls: ["./checkout.page.scss"],
})
export class CheckoutPage implements OnInit {
  cart = [];
  Total;
  public default: boolean = true;
  BuyerEmail;
  baseimageurl;
  radiobtn;
  hid: Boolean;
  buyerAddress;
  buyerphone;
  sellername;
  currentdate;
  date;
  datetime;
  time;
  amOrPm;
  checkout_Address;

  CheckoutForm: FormGroup;
  //baseimageurl= "http://localhost:3000//uploadproduct//";

  constructor(
    @Inject(InAppBrowser) private theInAppBrowser: InAppBrowser,
    private cartservice: cartService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private appComponent: AppComponent,
    private toastService: ToastService,
    private ordersService: OrdersService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formInitializer();
    this.baseimageurl = ProjectConfig.getPath() + "//uploadproduct//";
    this.cart = this.cartservice.getCart();
    console.log("cart=", this.cart);
    this.getdatafromstorage();
    this.hid = true;
  }

  formInitializer() {
    this.CheckoutForm = this.formBuilder.group({
      Address: [null, [Validators.required]],
      phone: ["", [Validators.required, Validators.minLength(11)]],
      easyphone: ["", [Validators.required, Validators.minLength(11)]],
    });
  }
  getDateTime() {
    this.currentdate = new Date();
    console.log("currentdate = ", this.currentdate);
    this.date =
      this.currentdate.getDate() +
      "/" +
      (this.currentdate.getMonth() + 1) +
      "/" +
      this.currentdate.getFullYear();

    this.time =
      this.twelveHours() +
      ":" +
      this.currentdate.getMinutes() +
      ":" +
      this.currentdate.getSeconds() +
      " " +
      this.amOrPm;

    console.log("date = ", this.date);
    console.log("time = ", this.time);
  }

  twelveHours() {
    if (this.currentdate.getHours() > 12) {
      this.amOrPm = "PM";
      let twentyFourHourTime = this.currentdate.getHours();
      let conversion = twentyFourHourTime - 12;
      return `${conversion}`;
    } else {
      this.amOrPm = "AM";
      return `${this.currentdate.getHours()}`;
    }
  }

  Paynow() {
    console.log("entered paynow");
    //need to check if payment method is cash or easypaisay if easypaisa then deduct the amount from easypaisa account using given number
    this.getDateTime();
    let productid;
    let productname;
    let ordertoemail;
    let orderbyemail;
    let Address;
    let Phonenumber;
    let TotalAmount;
    let sellername;
    let productCount;
    let sellerName;
    let discount = 0;
    let paymentType;
    let date;
    let Time;
    let confirm;
    for (let pro of this.cart) {
      console.log("product", pro);
      orderbyemail = this.BuyerEmail;

      ordertoemail = pro.email;

      if (this.default === true) {
        Address = this.buyerAddress;
        Phonenumber = this.buyerphone;
        console.log("address", Address);
        console.log("phone", Phonenumber);
      } else {
        Address = this.CheckoutForm.value["Address"];
        Phonenumber = this.CheckoutForm.value["phone"];
        console.log("address", Address);
        console.log("phone", Phonenumber);
      }
      sellername = pro.sellername;
      console.log("sellername", sellername);

      if (sellername != null && sellername != undefined) {
        productname = pro.name;
        sellerName = pro.sellername;
        productCount = pro.amount;
        productid = pro._id;
        TotalAmount = productCount * pro.price + 0.0;

        var obj = {
          orderbyemail: orderbyemail,
          sellername: sellername,
          Address: Address,
          Phonenumber: Phonenumber,
          confirm: false,
          cancelled: false,
          Delivered: false,
          mainimage: pro.mainimage,
          ordertoemail: ordertoemail,
          productid: productid,
          sellerName: sellerName,
          discount: discount,
          productname: productname,
          TotalAmount: TotalAmount,
          productCount: productCount,
          paymentType: this.radiobtn,
          Date: this.date,
          Time: this.time,
        };
        if (orderbyemail === ordertoemail) {
          const msg = "Failed! Can't order your own product";
          this.toastService.presenterrorToast(msg);
          this.cartservice.resetCart();
          this.router.navigateByUrl("/home");
        } else {
          console.log("obj=", obj);
          this.confirmPayment(obj);
        }
      } else {
        console.log("can't find seller name");
      }
    }
  }
  // options: InAppBrowserOptions = {
  //   location: "yes", //Or 'no'
  //   hidden: "no", //Or  'yes'
  //   clearcache: "yes",
  //   clearsessioncache: "yes",
  //   zoom: "yes", //Android only ,shows browser zoom controls
  //   hardwareback: "yes",
  //   mediaPlaybackRequiresUserAction: "no",
  //   shouldPauseOnSuspend: "no", //Android only
  //   closebuttoncaption: "Close", //iOS only
  //   disallowoverscroll: "no", //iOS only
  //   toolbar: "yes", //iOS only
  //   enableViewportScale: "no", //iOS only
  //   allowInlineMediaPlayback: "no", //iOS only
  //   presentationstyle: "pagesheet", //iOS only
  //   fullscreen: "yes", //Windows only
  // };

  async confirmPayment(obj) {
    const observable = await this.ordersService.ConfirmPayment(obj);
    observable.subscribe(
      (data) => {
        console.log("data", data);
        this.checkout_Address = data.result.body.checkout_url;
        console.log("checkout", this.checkout_Address.toString());
        let url = this.checkout_Address;
        const bro = this.theInAppBrowser.create(
          this.checkout_Address.toString(),
          "_blank",
          "location=yes"
        );
        //const bro = this.theInAppBrowser.create(url, "_system");
        console.log("browser", bro);
        //working in external browser
        //window.location.href = this.checkout_Address.toString();
        //Response.redirect(this.checkout_Address);
        const msg = "Success! Product ordered Successfully.";
        // this.createorder(obj);
      },
      (err) => {
        console.log("confirm order err", err);
        this.toastService.presenterrorToast(err.error.messag);
      }
    );
  }
  async createorder(obj) {
    const observable = await this.ordersService.CreateOrder(obj);
    observable.subscribe(
      (data) => {
        console.log("data", data);
        const msg = "Success! Product ordered Successfully.";
        this.toastService.presentpositiveToast(msg);

        const Ordid = "ordid";
        this.authService.saveTokenToStorage(Ordid, data._id);
        this.router.navigateByUrl("/finalpage");
      },
      (err) => {
        console.log("create order err", err);
        this.toastService.presenterrorToast(err.error.messag);
        this.router.navigateByUrl("/cart");
      }
    );
  }

  radioGroupChange(event) {
    console.log("radioGroupChange", event.target.value);
    this.radiobtn = event.target.value;
    if (this.radiobtn === "easypaisa") {
      this.hid = false;
    } else {
      this.hid = true;
    }
  }

  getdatafromstorage() {
    const total = "total";
    this.authService
      .getTokenFromStorage(total)
      .then((data) => {
        this.getemail();
        this.Total = data;
        console.log("fetched Total", this.Total);
      })
      .catch((error) => {
        console.log("fethching error", error);
      });
  }

  async getuserdata() {
    const observable = await this.userService.getSingleUser(this.BuyerEmail);
    observable.subscribe(
      (data) => {
        console.log("data", data);
        this.buyerAddress = data.data.address;
        console.log("address", this.buyerAddress);
        this.buyerphone = data.data.mnumber;
      },
      (err) => {
        console.log("gett all err", err);
      }
    );
  }

  getemail() {
    const semail = "email";
    this.authService
      .getTokenFromStorage(semail)
      .then((data) => {
        this.BuyerEmail = data;
        console.log("fetched BuyerEmail", this.BuyerEmail);

        this.getuserdata();
      })
      .catch((error) => {
        console.log("fethching error", error);
      });
  }

  change() {
    if (this.default === false) {
      this.CheckoutForm.reset();
      this.default = true;
    } else {
      this.default = false;
    }
  }
}
