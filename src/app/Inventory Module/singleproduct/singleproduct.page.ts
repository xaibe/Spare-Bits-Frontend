import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../sdk/core/products.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/sdk/core/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { cartService } from 'src/sdk/custom/cart.service';
import { BehaviorSubject } from 'rxjs';
import { ProjectConfig } from 'src/sdk/Project.config';
@Component({
  selector: 'app-singleproduct',
  templateUrl: './singleproduct.page.html',
  styleUrls: ['./singleproduct.page.scss'],
})
export class SingleproductPage implements OnInit {
cart=[];
cartItemCount:BehaviorSubject<number>;

disableBtn: boolean;
  loading = false;
  deleteLoading = false;
  products:Products[] = [];
  productsBackup: Products[] = [];
  totalstock;
  // fedbackarray: MyObject[] = [];
  searchArray: any[] = [];
  picture: String[] = [];
  emptyarray;
  avail;
  email;
  name;
  feeddub:any[]=[];
  proname;
  //someArray: Array<{ id: number, name: string }> = [];
  //fedback:any[]=[];
//  baseimageurl= "http://localhost:3000//uploadproduct//"; 
baseimageurl  =   ProjectConfig.getPath()+"//uploadproduct//";
image;
FeedbackForm: FormGroup;
sliderConfig={
 

};
  constructor(private route: ActivatedRoute,private cartService:cartService,private productsService:ProductsService,    
    private formBuilder: FormBuilder,private authService:AuthService) { }
  
  ngOnInit() {
    try{
      console.log('before gett all');
this.disableBtn=false;
      this.getAll();
  this.formInitializer();
  this.getdatafromstorage();
    this.cart=this.cartService.getCart();
    this.cartItemCount=this.cartService.getCartItemCount();
}
  
    catch ( ERROR)
  {
console.log("error in products fetching", Error);
  }

  }
 
  formInitializer() {
    this.FeedbackForm = this.formBuilder.group({
       Feedback: [null, [Validators.required]]
    });
  }

  getdatafromstorage(){
    const semail='email';
    this.authService.getTokenFromStorage(semail).then(data => {
       this.email = data;
        console.log('fetched profile email',this.email);

      })
        .catch(error => { console.log('fethching error',error) });

        const sname='name';
        this.authService.getTokenFromStorage(sname).then(data => {
           this.name = data;
            console.log('fetched profile name',this.name);
    
          })
            .catch(error => { console.log('fethching error',error) });
    
      }
addToCart(pro){
this.cartService.addCart(pro);
this.totalstock=this.totalstock-1;
console.log("total stock after add to cart",this.totalstock);
if(this.totalstock==0||this.totalstock<0){
  this.disableBtn=true;
  this.avail="Out Of Stock";
}

}
readCart(){
this.cartService.readCart();
}
 
      filter() {
  this.route.paramMap.subscribe(paramMap => {
    const val = paramMap.get('_id');
console.log("value",val);
console.log("Products before filter",this.products);
this.productsBackup=this.products;

this.searchArray=this.products.filter(e=> e._id== val);
if (this.searchArray.length == 0) {
console.log("empty array",this.searchArray);

}else{
this.products=this.searchArray;
//loop for availability check
for(let pro of this.products){
  this.proname=pro.name;
  this.feeddub=pro.Feedback;
if(pro.stock>=1){
  this.avail="Available";
  this.totalstock=pro.stock;
console.log("total stock",this.totalstock);
}
else{
  this.avail="Out Of Stock";
  this.disableBtn=true;
}
}
console.log("after product name",this.proname);

console.log("after filtering product feedback",this.feeddub);

console.log("after onselect",this.products);
}

    // this.searchArray = this.products.find(obj => {
    //   return obj._id.includes(val);
  //  });
  
  });

 }

 async sendfeedback() 
 {
  console.log("send feedback name",this.name);
  console.log("send feedback email",this.email);

  console.log("send feedback text area value",this.FeedbackForm.controls['Feedback'].value);
  
  
 let fedbackarray: MyObject[] = [
 {  "name":this.name,"email":this.email,"feed":this.FeedbackForm.controls['Feedback'].value}
 ];
// this.fedobject.name=this.name;
// this.fedobject.email=this.email;
// this.fedobject.feedback=this.FeedbackForm.controls['Feedback'].value;
// fedback.push(this.fedobject);
  console.log("this.fedback array",fedbackarray);


  console.log(' send feedback entered');
  //this.loading = true;

  const observable = await this.productsService.feedback(this.proname,fedbackarray);
  observable.subscribe(
    data => {
      console.log("feedback added",data.message);
     this.getAll();
    },
    err => {
      console.log('gett all err', err);
    }
  );
}


  
  async getAll() {
    console.log('gett all entered');
    //this.loading = true;

    const observable = await this.productsService.getAllProducts();
    observable.subscribe(
      data => {
        this.products = data.data.docs;
        this.loading = false;
        console.log('data', data);
this.productsBackup=this.products;
        console.log('Data received', this.products);
        console.log('Data received', this.products);
        //console.log("this.singleproduct",this.singleproduct);
        //  this.image = 'http://localhost:3000' + '/uploadproduct/' + data.name;  
        //  console.log('imageurl:', this.image);
        this.filter();
      },
      err => {
        console.log('gett all err', err);
      }
    );
  }

}

interface Products {
  name: string;
  price: number;
  _id?: string;
  discription: string;
  mainimage:string;
  stock:number;
  image_url:[];
  Feedback:[{}];
  catageory:string;
  subCatageory:string,
  is_deleted: boolean;
  email:string;
}

interface MyObject { // define the object (singular)
  name: string;
  email:string;
  feed:string;
}
