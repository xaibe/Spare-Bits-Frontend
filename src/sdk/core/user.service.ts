import { HttpClient, HttpHeaders } from "@angular/common/http";

import { ProjectConfig } from "../Project.config";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  public userLogin(credentials: object): Observable<any> {
    // this url will be http://localhost:3000/users/login
    const url = ProjectConfig.getPath() + "/users/login";

    return this.http.post(url, credentials);
  }

  public sendNewUserMail(data): Observable<any> {
    const url = ProjectConfig.getPath() + "/users/sendNewUserMail";
    return this.http.post(url, data);
  }

  public userverifyemail(credentials, data): Observable<any> {
    // this url will be http://localhost:3000/users/login
    const url = ProjectConfig.getPath() + "/users/verifyEmail";
    const obj = { ...credentials, ...data };
    return this.http.post(url, obj);
  }

  public updatepassword(credentials, data): Observable<any> {
    // this url will be http://localhost:3000/users/login
    const url = ProjectConfig.getPath() + "/users/updatePassword";
    const obj = { ...credentials, ...data };
    return this.http.post(url, obj);
  }
  public userRegister(credentials: object): Observable<any> {
    const url = ProjectConfig.getPath() + "/users/register";

    return this.http.post(url, credentials);
  }

  public userForgotPassword(credentials: object): Observable<any> {
    const url = ProjectConfig.getPath() + "/users/sendmail";
    return this.http.post(url, credentials);
  }

  //getting single user
  public getSingleUser(email: String): Observable<any> {
    const url = ProjectConfig.getPath() + "/users/getsingleuser/" + email;
    return this.http.get(url);
  }
  public getSingleUserbyid(_id): Observable<any> {
    const url = ProjectConfig.getPath() + "/users/getsingleuserbyid/" + _id;
    return this.http.get(url);
  }

  public retrieveAvatar(avatar: String): Observable<any> {
    const url = ProjectConfig.getPath() + "/users/retrieveAvatar/" + avatar;
    console.log("url", url);
    return this.http.get(url);
  }

  //update user
  public UpdateUser(credentials: object, email: String): Observable<any> {
    const url = ProjectConfig.getPath() + "/users/updateuser/" + email;

    return this.http.put(url, credentials);
  }

  public UpdateName(credentials: any, email: String): Observable<any> {
    const url = ProjectConfig.getPath() + "/users/updatename/" + email;

    return this.http.put(url, credentials);
  }

  public uploadAvatar(
    user_info: any,
    email: any,
    image: any /* user_id: any*/
  ): Observable<any> {
    // /user/avatar/${user_id}
    var file_location;
    var url;

    url = ProjectConfig.getPath() + "/users/uploadimage/";
    file_location = `profileimage-.${email}.${user_info.extension}`;

    const formData: FormData = new FormData();
    formData.append("file", image, file_location);

    return this.http.post(url, formData);
    // return this.http.post(url, obj)
  }

  // public uploadAvatar( user_info: any, image: any, value: any, randomNumber:any ): Observable<any> {

  //   var file_location;
  //   var url;
  //   if(value == 'item'){
  //      url = ProjectConfig.getPath() + '/product/PostLostProduct';
  //      file_location = `lostproduct-${randomNumber}.${user_info.extension}`;
  //   }
  //   if(value == 'person'){
  //      url = ProjectConfig.getPath() + '/person/PostLostPerson';
  //      file_location = `lostperson-${randomNumber}.${user_info.extension}`;

  //   }
  //   const formData: FormData = new FormData();
  //   formData.append('file', image, file_location);

  //   return this.http.post(url, formData, {})
  // }
}
