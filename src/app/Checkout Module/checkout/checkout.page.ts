import { Component, Injectable, OnInit } from "@angular/core";
import { cartService } from "src/sdk/custom/cart.service";
import { ProjectConfig } from "src/sdk/Project.config";
import { AuthService } from "src/sdk/core/auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserService } from "src/sdk/core/user.service";
import { OrdersService } from "src/sdk/core/orders.service";
import { Router } from "@angular/router";
import { ToastService } from "src/sdk/custom/toast.service";
import { AppComponent } from "src/app/app.component";
import { Inject } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { InAppBrowserOptions } from "@ionic-native/in-app-browser";
import { LoaderService } from "src/sdk/custom/loader.service";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.page.html",
  styleUrls: ["./checkout.page.scss"],
})
export class CheckoutPage implements OnInit {
  options: InAppBrowserOptions = {
    location: "no",
    zoom: "no",
  };
  Orderid;
  cart = [];
  checkStatus = false;
  placementStatus;
  order_reference;
  loaderr;
  bro;
  Total;

  globalObj;

  apiAddress;
  apiOrderId;
  apiPhone;
  apiPaymentMethod;

  lastButton;
  public default: boolean = true;
  BuyerEmail;
  baseimageurl;
  radiobtn;
  hidDetails;
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
    private loaderService: LoaderService,
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
    this.hidDetails = true;
    this.lastButton = "CheckOut";
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

  checkradio() {
    if (this.radiobtn) {
      if (this.radiobtn === "Credit/Debit Card") {
        this.PayWithCredit();
      } else {
        this.PayOnCash();

        console.log("cash on delivery");
      }
    } else {
      const msg = "Failed! Please Select a payment method first";
      this.toastService.presenterrorToast(msg);
    }
  }
  PayOnCash() {
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
          this.createorder(obj);
        }
      } else {
        console.log("can't find seller name");
      }
    }
  }

  PayWithCredit() {
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

      Address = this.buyerAddress;
      Phonenumber = this.buyerphone;
      console.log("address", Address);
      console.log("phone", Phonenumber);

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

  async checkOrderPaymentStatus(id) {
    console.log("refer id", id);
    const observable = await this.ordersService.checkOrderPaymentStatus(id);
    observable.subscribe(
      (data) => {
        this.checkStatus = true;
        console.log("confirm order payment status", data);
        this.placementStatus = data.result.body.placement_status;
        const orderid = data.result.body.merchant_order_id;

        if (this.placementStatus === "3") {
          this.globalObj.paymentType = data.result.body.payment_method.name;
          this.globalObj.Phonenumber =
            "0" + data.result.body.customer.phone_number;
          this.globalObj.Address = data.result.body.delivery_address.address;

          this.updateorder(this.globalObj, orderid);
        } else {
          const msg = "FAILED! Payment Un-Successful.Please Try Again";
          this.toastService.presenterrorToast(msg);
          this.deleteorder(orderid);
        }

        //     // this.router.navigateByUrl("/finalpage");
      },
      (err) => {
        console.log("confirm order payment status err", err);
        this.toastService.presenterrorToast(err.error.messag);
      }
    );

    //   return status;
  }

  async deleteorder(id) {
    const observable = await this.ordersService.deleteOrder(id);
    observable.subscribe(
      async (data) => {
        this.loaderService.hideLoader();
        console.log("data after order creation", data);
      },
      (err) => {
        console.log("confirm order err", err);
      }
    );
  }
  async callInAppBrowser() {
    console.log("entered in app browser");
    this.bro = await this.theInAppBrowser.create(
      this.checkout_Address.toString(),
      "_blank",
      this.options
    );

    this.bro.on("loaderror").subscribe(
      (event) => {
        this.loaderService.showLoaderwhite();
        this.bro.close();
        this.checkOrderPaymentStatus(this.order_reference);

        //     // this.router.navigateByUrl("/finalpage");
      },
      (err) => {
        console.log("call in app browser  err", err);
        this.toastService.presenterrorToast(err.error.messag);
      }
    );
  }

  async confirmPayment(obj) {
    this.globalObj = obj;
    const observable = await this.ordersService.ConfirmPayment(obj);
    observable.subscribe(
      async (data) => {
        console.log("data after order creation", data);
        this.checkout_Address = data.result.body.checkout_url;
        console.log("checkout", this.checkout_Address.toString());

        this.order_reference = data.result.body.order_reference;
        console.log("order refer", this.order_reference);

        this.callInAppBrowser();
        this.Orderid = data.result.body.merchant_order_id;
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

  async updateorder(obj, id) {
    const observable = await this.ordersService.UpdateOrderAfterPayment(
      obj,
      id
    );
    observable.subscribe(
      (data) => {
        console.log("data", data);
        const msg = "Success! Product ordered Successfully.";
        this.toastService.presentpositiveToast(msg);

        const Ordid = "ordid";
        this.authService.saveTokenToStorage(Ordid, data._id);
        this.router.navigateByUrl("/finalpage");
        this.loaderService.hideLoader();
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

    if (this.radiobtn === "cash") {
      this.hidDetails = false;

      this.lastButton = "CheckOut";
    } else {
      console.log("credit card");
      this.lastButton = "PayNow";
      this.hidDetails = true;
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
        if (
          data.data.Address2 === null ||
          data.data.Address2 === "" ||
          data.data.Address2 === undefined
        ) {
          this.buyerAddress =
            data.data.Address1 +
            "," +
            data.data.City +
            "," +
            data.data.Province +
            "," +
            data.data.Zipcode;
        } else {
          this.buyerAddress =
            data.data.Address1 +
            "," +
            data.data.Address2 +
            "," +
            data.data.City +
            "," +
            data.data.Province +
            "," +
            data.data.Zipcode;
        }
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
