import { Component, OnInit } from "@angular/core";
import { OrdersService } from "src/sdk/core/orders.service";
import { AuthService } from "src/sdk/core/auth.service";
import { ProjectConfig } from "src/sdk/Project.config";
import { ToastService } from "src/sdk/custom/toast.service";
import { Router } from "@angular/router";
import { UserService } from "src/sdk/core/user.service";
import { ContactsService } from "src/sdk/core/contacts.service";
@Component({
  selector: "app-new-orders",
  templateUrl: "./new-orders.page.html",
  styleUrls: ["./new-orders.page.scss"],
})
export class NewOrdersPage implements OnInit {
  orders: [];
  searchval;
  searchph;
  duporders;
  searchArray;
  emptyarray;
  filterorder;
  otnum;
  usermessages = [];
  contacteduser_messages = [];
  seller_imageUrl;
  buyer_imageUrl;
  email;
  hid;
  sellerid;
  sellername;
  buyerid;
  buyername;
  notfound;
  baseimageurl = ProjectConfig.getPath() + "//uploadproduct//";
  constructor(
    private router: Router,
    private userService: UserService,
    private contactsService: ContactsService,
    private ordersService: OrdersService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.notfound = true;
    this.emptyarray = true;
    this.getdatafromstorage();
  }

  getdatafromstorage() {
    try {
      const ordertype = "ordertype";
      this.authService
        .getTokenFromStorage(ordertype)
        .then((data) => {
          this.otnum = data;
          console.log("fetched order type number", this.otnum);
        })
        .catch((error) => {
          console.log("fethching error", error);
        });

      const semail = "email";
      this.authService
        .getTokenFromStorage(semail)
        .then((data) => {
          this.email = data;
          console.log("fetched email", this.email);
          this.getbuyerid(this.email);
          this.getneworders();
        })
        .catch((error) => {
          console.log("fethching error", error);
        });
    } catch (error) {
      console.log("fethching error", error);
    }
  }

  onChange(event) {
    //console.log("event value",event.target.value);
    this.searchval = event.target.value;
    //console.log("searchval",this.searchval);
    if (event.target.value === "1") {
      this.searchph = "Search By ID";
    } else if (event.target.value === "2") {
      this.searchph = "Search By Product Name";
    } else if (event.target.value === "3") {
      this.searchph = "Search By Seller Name";
    } else if (event.target.value === "4") {
      this.searchph = "Search By Seller Email";
    }
  }

  mySearch(ev: any) {
    if (
      this.searchval === undefined ||
      this.searchval === null ||
      this.searchval === ""
    ) {
      const msg = "Please Select ORDER BY FIRST FROM DROPDOWN ON LEFT!";
      this.toastService.presenterrorToast(msg);
    } else {
      this.orders = this.duporders;
      this.emptyarray = true;
      const search = ev.target.value;

      if (search && search.trim() != "") {
        if (this.searchval === "1") {
          this.searchArray = this.orders.filter((item: any) => {
            return item._id.toLowerCase().indexOf(search.toLowerCase()) > -1;
          });
        } else if (this.searchval === "2") {
          this.searchArray = this.orders.filter((item: any) => {
            return (
              item.productname.toLowerCase().indexOf(search.toLowerCase()) > -1
            );
          });
        } else if (this.searchval === "3") {
          this.searchArray = this.orders.filter((item: any) => {
            return (
              item.sellerName.toLowerCase().indexOf(search.toLowerCase()) > -1
            );
          });
        } else if (this.searchval === "4") {
          this.searchArray = this.orders.filter((item: any) => {
            return (
              item.ordertoemail.toLowerCase().indexOf(search.toLowerCase()) > -1
            );
          });
        }

        if (this.searchArray.length == 0) {
          //console.log("empty array",this.searchArray);
          this.emptyarray = false;
          this.orders = this.searchArray;
        } else {
          this.orders = this.searchArray;
          //console.log("User found",this.orders);
        }
      } else {
        //console.log("empty searchbox",search);
        // Reset the field
        ev.target.value = "";
        this.orders = this.duporders;
      }
    }
  }

  async confirmed(id) {
    console.log("confirmed item id", id);
    const obj = {
      confirm: "true",
    };
    const observable = await this.ordersService.confirmOrder(id, obj);
    observable.subscribe(
      async (data) => {
        console.log("confirmed data", data);
        this.ngOnInit();
        const msg =
          "Success! Order Confirmed Successfully. Deliver Order in time to recieve more Orders";
        this.toastService.presentpositiveToast(msg);
      },
      (err) => {
        console.log("confirm orders err", err);

        this.toastService.presentpositiveToast(err.message);
      }
    );
  }

  async cancel(id) {
    console.log("cancell item id", id);
    const obj = {
      cancel: "true",
    };
    const observable = await this.ordersService.cancelOrder(id, obj);
    observable.subscribe(
      async (data) => {
        console.log("confirmed data", data);
        this.ngOnInit();
        const msg =
          "Success! Order Cancelled Successfully. Try to confirm more Orders rather to cancel them ";
        this.toastService.presentpositiveToast(msg);
      },
      (err) => {
        console.log("cancell orders err", err);
        this.toastService.presentpositiveToast(err.message);
      }
    );
  }
  async getbuyerid(buyeremail) {
    const observable = await this.userService.getSingleUser(buyeremail);
    observable.subscribe(async (data) => {
      console.log("user ", data);
      this.buyerid = data.data._id;
      this.buyername = data.data.name;
      this.buyer_imageUrl = data.data.imageUrl;
      console.log("recieved buyer id", this.buyerid);

      (err) => {
        console.log("recieveing buyer id err", err);

        this.toastService.presentpositiveToast(err.message);
      };
    });
  }

  async getsellerid(selleremail) {
    const observable = await this.userService.getSingleUser(selleremail);
    observable.subscribe(async (data) => {
      console.log("user ", data);
      this.sellerid = data.data._id;
      this.sellername = data.data.name;
      this.seller_imageUrl = data.data.imageUrl;
      console.log("recieved seller id", this.sellerid);

      const roomid = this.sellerid + this.buyerid;
      console.log("created room id", roomid);

      const obj = {
        roomid: roomid,
        user_id: this.sellerid,
        user_name: this.sellername,
        user_imageUrl: this.seller_imageUrl,
        contacteduser_imageUrl: this.buyer_imageUrl,
        contacted_userid: this.buyerid,
        contacteduser_name: this.buyername,
        user_messages: this.usermessages,
        contacteduser_messages: this.contacteduser_messages,
      };

      this.createcontact(obj);

      //  this.socket.connect();
      //  this.socket.emit('join', this.sellerid);

      (err) => {
        console.log("recieveing seller id err", err);

        this.toastService.presentpositiveToast(err.message);
      };
    });
  }

  async createcontact(obj) {
    const observable = await this.contactsService.CreateContact(obj);
    observable.subscribe(async (data) => {
      console.log(" contact tried", data.message);
      const room = "idforchat";
      this.authService.saveTokenToStorage(room, obj);
      this.router.navigateByUrl("/chat");
      (err) => {
        console.log("  err while creating contact", err);

        this.toastService.presentpositiveToast(err.message);
      };
    });
  }
  chat(order) {
    if (this.otnum === "1") {
      this.getsellerid(order.ordertoemail);
    } else if (this.otnum === "2") {
      this.getsellerid(order.orderbyemail);
    }
  }

  async getneworders() {
    this.notfound = true;
    if (this.otnum === "1") {
      const observable = await this.ordersService.filterbuyerOrder(this.email);
      observable.subscribe(
        async (data) => {
          this.filterorder = data.data.filter((e) => e.confirm === false);
          this.filterorder = this.filterorder.filter(
            (e) => e.cancelled === false
          );
          this.hid = true;
          this.orders = this.filterorder;
          this.duporders = this.filterorder;
          console.log("Buyer Orders recieved", this.orders);
          if (this.orders.length === 0) {
            this.notfound = false;
          } else {
            this.notfound = true;
          }
        },
        (err) => {
          console.log("gett all orders err", err);
        }
      );
    } else {
      const observable = await this.ordersService.filtersellerOrder(this.email);
      observable.subscribe(
        async (data) => {
          this.filterorder = data.data.filter((e) => e.confirm === false);
          this.filterorder = this.filterorder.filter(
            (e) => e.cancelled === false
          );
          this.hid = false;
          this.orders = this.filterorder;
          this.duporders = this.filterorder;
          console.log("Seller orders recieved", this.orders);
          if (this.orders.length === 0) {
            this.notfound = false;
          } else {
            this.notfound = true;
          }
        },
        (err) => {
          console.log("gett all orders err", err);
        }
      );
    }
  }
}
