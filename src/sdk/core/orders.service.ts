import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from './auth.service';
import { ProjectConfig } from '../Project.config';
import { Injectable } from '@angular/core';
import { tokenize } from '@angular/compiler/src/ml_parser/lexer';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private http: HttpClient, private authService: AuthService) {}
  
  public async getAllOrders(): Promise<any> {
    const atoken='token';
    const url = ProjectConfig.getPath() + '/Orders/';
    const token = await this.authService.getTokenFromStorage(atoken);
    return this.http.get(url, {
      headers: new HttpHeaders().set('Authorization', token)
    });
  }

  public async filterOrder(id): Promise<any> {    
    const atoken='token';
    const token = await this.authService.getTokenFromStorage(atoken);
    const url = ProjectConfig.getPath() + '/Orders/'+ id ;
    return this.http.get(url,{
      headers: new HttpHeaders().set('Authorization', token)
    }); 
  } 


  
  public async filterbuyerOrder(email): Promise<any> {    
    const atoken='token';
    const token = await this.authService.getTokenFromStorage(atoken);
    const url = ProjectConfig.getPath() +  '/Orders/filterbuyerorder/' + email;
    return this.http.get(url,{
      headers: new HttpHeaders().set('Authorization', token)
    }); 
  } 

  public async filtersellerOrder(email): Promise<any> {    
    const atoken='token';
    const token = await this.authService.getTokenFromStorage(atoken);
    const url = ProjectConfig.getPath() +  '/Orders/filtersellerorder/' + email;
    console.log("url in service",url);
    return this.http.get(url,{
      headers: new HttpHeaders().set('Authorization', token)
    }); 
  } 
 

  public async CreateOrder(data:object): Promise<any> {
    const atoken='token';
    const url = ProjectConfig.getPath() + '/Orders/add';
    const token = await this.authService.getTokenFromStorage(atoken);
    
    return this.http.post(url, data,{
      headers: new HttpHeaders().set('Authorization', token)
    });
  }

  public async updateOrder(_id,data): Promise<any> {
    const atoken='token';
    const url = ProjectConfig.getPath() + '/Orders/'+ _id ;
     const token = await this.authService.getTokenFromStorage(atoken);
   console.log("token",token);
     return this.http.put(url, data,{
      headers: new HttpHeaders().set('Authorization', token)
    });
  }

  public async deleteProduct(id: string): Promise<any> {
    const atoken='token';
    const url = ProjectConfig.getPath() + `/Products/${id}`;
    const token = await this.authService.getTokenFromStorage(atoken);

    return this.http.delete(url, {
      headers: new HttpHeaders().set('Authorization', token)
    });
  }
  

 
}