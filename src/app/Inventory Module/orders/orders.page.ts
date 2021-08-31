import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/sdk/core/orders.service';
import { AuthService } from 'src/sdk/core/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  orders: [];
  public default:boolean= true;
  defaultLabel="MY ORDERS";
  segmentValue='1';
  constructor(
    private router:Router,
private authService:AuthService,
    private ordersService: OrdersService
  ) { }


  ngOnInit() {
    const ordertype='ordertype';
    this.authService.saveTokenToStorage(ordertype,this.segmentValue);
  }

 //to check whether customer is searching his orders or orders he have recieved by others. 
segmentChange(event){
  const value=event.target.value;
  console.log("event",value);
  if(value===1)
{
  this.default=true;
  const ordertype='ordertype';
  this.authService.saveTokenToStorage(ordertype,value);
  
}
else{
  this.default=false;
  const ordertype='ordertype';
  this.authService.saveTokenToStorage(ordertype,value);
}
}
  
Neworders(){
  this.router.navigateByUrl("/neworder");
}
Confirmedorders(){
  this.router.navigateByUrl("/confirmedorder");
}
Cancelledorders(){
  this.router.navigateByUrl("/cancelledorder");
}  
Deliveredorders(){
  this.router.navigateByUrl("/deliveredorder");
}
  

}
