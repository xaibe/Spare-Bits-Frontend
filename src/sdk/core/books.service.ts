import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from './auth.service';
import { BookyConfig } from '../booky.config';
import { Injectable } from '@angular/core';
import { tokenize } from '@angular/compiler/src/ml_parser/lexer';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  constructor(private http: HttpClient, private authService: AuthService) {}
  
  public async getAllBooks(): Promise<any> {
    const atoken='token';
    const url = BookyConfig.getPath() + '/books';
    const token = await this.authService.getTokenFromStorage(atoken);
    return this.http.get(url, {
      headers: new HttpHeaders().set('Authorization', token)
    });
  }

  public async addNewBook(data: object): Promise<any> {
    const atoken='token';
    const url = BookyConfig.getPath() + '/books/add';
    const token = await this.authService.getTokenFromStorage(atoken);

    return this.http.post(url, data, {
      headers: new HttpHeaders().set('Authorization', token)
    });
  }
  public async updateBook(data): Promise<any> {
    const atoken='token';
    const url = BookyConfig.getPath() + `/books/${data._id}`;
     const token = await this.authService.getTokenFromStorage(atoken);
    //const token = 'blabla';
    return this.http.put(url, data, {
      headers: new HttpHeaders().set('Authorization', token)
    });
  }
  public async deleteBook(id: string): Promise<any> {
    const atoken='token';
    const url = BookyConfig.getPath() + `/books/${id}`;
    const token = await this.authService.getTokenFromStorage(atoken);

    return this.http.delete(url, {
      headers: new HttpHeaders().set('Authorization', token)
    });
  }
}
