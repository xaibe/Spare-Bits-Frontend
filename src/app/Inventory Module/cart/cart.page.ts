import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/sdk/core/auth.service";
import { cartService } from "src/sdk/custom/cart.service";
import { ProjectConfig } from "src/sdk/Project.config";
@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
})
export class CartPage implements OnInit {
  cart = [];
  emptycart;
  baseimageurl = ProjectConfig.getPath() + "//uploadproduct//";
  //baseimageurl= "http://localhost:3000//uploadproduct//";
  constructor(
    private cartService: cartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
    if (this.cart.length === 0) {
      this.emptycart = true;
    } else {
      this.emptycart = false;
    }
  }

  decreaseCartItem(product) {
    this.cartService.decreaseCart(product);
    if (this.cart.length === 0) {
      this.emptycart = true;
    } else {
      this.emptycart = false;
    }
  }

  increaseCartItem(product) {
    this.cartService.addCart(product);
  }

  removeCartItem(product) {
    this.cartService.removeCart(product);
    if (this.cart.length === 0) {
      this.emptycart = true;
    } else {
      this.emptycart = false;
    }
  }

  getTotal() {
    return this.cart.reduce((i, j) => i + j.price * j.amount, 0);
  }

  checkoutbtn() {
    const total = "total";
    const totalamount = this.getTotal();
    this.authService.saveTokenToStorage(total, totalamount);
    this.router.navigateByUrl("/checkout");
  }
  shopNow() {
    this.router.navigateByUrl("/home");
  }
}
