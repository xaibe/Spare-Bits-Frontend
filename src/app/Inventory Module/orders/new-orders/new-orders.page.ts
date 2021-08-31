import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/sdk/core/orders.service';
import { AuthService } from 'src/sdk/core/auth.service';
import { ProjectConfig } from 'src/sdk/Project.config';
@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.page.html',
  styleUrls: ['./new-orders.page.scss'],
})
export class NewOrdersPage implements OnInit {
  orders: [];
  filterorder;
  otnum
email
baseimageurl  =   ProjectConfig.getPath()+"//uploadproduct//";
  constructor(
    private ordersService:OrdersService,
    private authService:AuthService
    ) { }

  ngOnInit() {
    this.getdatafromstorage();
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
          this.getneworders();
        })
        .catch(error => { console.log('fethching error',error) });
      
      
    } catch (error) {
      console.log('fethching error',error);
    }
    }

async confirmed(id){
console.log("confirmed item id",id);
const confir=true;
const observable = await this.ordersService.updateOrder(id,confir);
observable.subscribe(
async data => {
    console.log('confirmed data', data);
    
  },
  err => {
    console.log('gett all orders err', err);
  }
);


}
  
    cancel(id){

    }
  
    async getneworders() {
if(this.otnum==='1'){   
    const observable = await this.ordersService.filterbuyerOrder(this.email);
    observable.subscribe(
   async data => {
    this.filterorder=data.data.filter(e=>e.confirm===false); 
    this.filterorder=this.filterorder.filter(e=>e.cancelled===false);   
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
        this.filterorder=data.data.filter(e=>e.confirm===false); 
        this.filterorder=this.filterorder.filter(e=>e.cancelled===false);   
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
