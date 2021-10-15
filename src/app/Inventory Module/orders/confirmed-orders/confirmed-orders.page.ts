import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/sdk/core/orders.service';
import { AuthService } from 'src/sdk/core/auth.service';
import { ProjectConfig } from 'src/sdk/Project.config';
import { ToastService } from 'src/sdk/custom/toast.service';
import { UserService } from 'src/sdk/core/user.service';
import { ContactsService } from 'src/sdk/core/contacts.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-confirmed-orders',
  templateUrl: './confirmed-orders.page.html',
  styleUrls: ['./confirmed-orders.page.scss'],
})
export class ConfirmedOrdersPage implements OnInit {
  orders: [];
  filterorder;
  otnum
  usermessages = [];
  contacteduser_messages=[];
  seller_imageUrl
  buyer_imageUrl
email
hid
sellerid
sellername
buyerid
buyername
baseimageurl  =   ProjectConfig.getPath()+"//uploadproduct//";

  constructor(
    private userService:UserService,
    private contactsService:ContactsService,
    private router:Router,
    private ordersService:OrdersService,
    private authService:AuthService,
    private toastService:ToastService

  ) { }

  ngOnInit() {
    this.getdatafromstorage();

  }
  async getbuyerid( buyeremail){
 
    const observable = await this.userService.getSingleUser(buyeremail);
    observable.subscribe(
    async data => {
        console.log('user ', data);
        this.buyerid=data.data._id;
        this.buyername=data.data.name;
     this.buyer_imageUrl=data.data.imageUrl;
        console.log('recieved buyer id', this.buyerid);
  
      err => {
        console.log('recieveing buyer id err', err);
     
        this.toastService.presentpositiveToast(err.message);
             
      }
    }
    );
  }

async getsellerid( selleremail){

const observable = await this.userService.getSingleUser(selleremail);
observable.subscribe(
async data => {
    console.log('user ', data);
    this.sellerid=data.data._id;
 this.sellername=data.data.name;
 this.seller_imageUrl=data.data.imageUrl;
    console.log('recieved seller id', this.sellerid);

 const roomid=this.sellerid+this.buyerid;
 console.log("created room id",roomid);
 
  const obj={
    roomid:roomid,
    user_id:this.sellerid,
    user_name:this.sellername,
    user_imageUrl:this.seller_imageUrl,
    contacteduser_imageUrl:this.buyer_imageUrl,
    contacted_userid:this.buyerid,
    contacteduser_name:this.buyername,
    user_messages:this.usermessages,
    contacteduser_messages:this.contacteduser_messages
  }
  
this.createcontact(obj);

//  this.socket.connect();
//  this.socket.emit('join', this.sellerid);


  err => {
    console.log('recieveing seller id err', err);
 
    this.toastService.presentpositiveToast(err.message);
         
  }
}
);
}

async createcontact( obj){

const observable = await this.contactsService.CreateContact(obj);
observable.subscribe(
async data => {
    console.log(' contact tried', data.message);
    const room="idforchat"
  this.authService.saveTokenToStorage(room,obj);
  this.router.navigateByUrl("/chat");
  err => {
    console.log('  err while creating contact', err);
 
    this.toastService.presentpositiveToast(err.message);
         
  }
}
);
}
  chat(order){

    if(this.otnum==='1'){
      this.getsellerid(order.ordertoemail);
    }
    else 
    if(this.otnum==='2'){
      this.getsellerid(order.orderbyemail);
    }
    }






  getdatafromstorage(){
    try {
     
    const ordertype='ordertype';
    this.authService.getTokenFromStorage(ordertype).then(data => {
     
     this.otnum = data;
        console.log('fetched order type number',this.otnum);
       
      })
      .catch(error => { console.log('fethching error',error) });

      const semail='email';
      this.authService.getTokenFromStorage(semail).then(data => {
       
       this.email = data;
          console.log('fetched email',this.email);
          this.getbuyerid(this.email);
          this.getneworders();
        })
        .catch(error => { console.log('fethching error',error) });
      
      
    } catch (error) {
      console.log('fethching error',error);
    }
    }

async confirmed(id){
console.log("confirmed item id",id);
const obj=
{ 
  Delivered:"true"
};
const observable = await this.ordersService.confirmOrderDelivery(id,obj);
observable.subscribe(
async data => {
    console.log('confirmed data', data);
    this.ngOnInit();
    const msg = "Success! Order Delivery Confirmed Successfully.";
                this.toastService.presentpositiveToast(msg);
    
  },
  err => {
    console.log('confirm order delivery err', err);
 
    this.toastService.presentpositiveToast(err.message);
         
  }
);
}
  
async cancel(id){
      console.log("cancell item id",id);
      const obj=
      { 
        Delivered:"false",
        cancel:"true"
      };
      const observable = await this.ordersService.cancelOrderDelivery(id,obj);
      observable.subscribe(
      async data => {
          console.log('confirmed data', data);          
          this. ngOnInit();
          const msg = "Success! Order Delivery Cancelled Successfully.";
    this.toastService.presentpositiveToast(msg);
        
        },
        err => {
          console.log('cancell orders err', err);
          this.toastService.presentpositiveToast(err.message);
         
        }
      );
      
    }
  
    async getneworders() {
if(this.otnum==='1'){   
    const observable = await this.ordersService.filterbuyerOrder(this.email);
    observable.subscribe(
   async data => {
    this.filterorder=data.data.filter(e=>e.confirm===true); 
    this.filterorder=this.filterorder.filter(e=>e.cancelled===false);   
    this.filterorder=this.filterorder.filter(e=>e.Delivered===false);
    this.hid=true;
    this.orders=this.filterorder;
  
        console.log('Buyer Orders recieved', this.orders);
        
      },
      err => {
        console.log('gett all orders err', err);
      }
    );

  }
  
  else{
    const observable = await this.ordersService.filtersellerOrder(this.email);
    observable.subscribe(
   async data => {
        this.filterorder=data.data.filter(e=>e.confirm===true); 
        this.filterorder=this.filterorder.filter(e=>e.cancelled===false);
        this.filterorder=this.filterorder.filter(e=>e.Delivered===false);   
        this.hid=false;
        this.orders=this.filterorder;
        console.log('Seller orders recieved', this.orders);
        
      },
      err => {
        console.log('gett all orders err', err);
      }
    );

}
}

}
