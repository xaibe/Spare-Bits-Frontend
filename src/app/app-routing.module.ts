import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { IsLoginGuard } from './../sdk/custom/guards/islogin.guard';
import { NgModule } from '@angular/core';
import { RedirectLoginGuard } from './../sdk/custom/guards/redirectlogin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: ':_id',
         
        loadChildren: () => import('./Inventory Module/singleproduct/singleproduct.module').then(m => m.SingleproductPageModule)
      }
    ]
  },

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'login',
    canActivate: [RedirectLoginGuard],
    loadChildren: () =>
      import('./Manage Profile Module/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then(m => m.RegisterPageModule)
   },
  {
    path: 'forgotpassword',
    loadChildren: () => 
    import('./Manage Profile Module/password reset/forgotpassword/forgotpassword.module').then( m => m.ForgotpasswordPageModule)
  },
  {
    path: 'changepassword',
    loadChildren: () => 
    import('./Manage Profile Module/password reset/changepassword/changepassword.module').then( m => m.ChangepasswordPageModule)
  },
  {
    path: 'verifyEmail',
    loadChildren: () => 
    import('./Manage Profile Module/password reset/verifyemail/verifyemail.module').then( m => m.VerifyemailPageModule)
  },
  {
    path: 'profile',
    canActivate: [IsLoginGuard],
    loadChildren: () => import('./Manage Profile Module/profile/profile.module').then( m => m.ProfilePageModule)
  },   {
    path: 'profile-pic',
    loadChildren: () => import('./profile-pic/profile-pic.module').then( m => m.ProfilePicPageModule)
  },
  {
    path: 'products',
    canActivate: [IsLoginGuard],
    loadChildren: () => 
    import('./Inventory Module/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'singleproduct',
    loadChildren: () => import('./Inventory Module/singleproduct/singleproduct.module').then( m => m.SingleproductPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./Inventory Module/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./Checkout Module/checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'easypaisa',
    loadChildren: () => import('./Checkout Module/easypaisa-page/easypaisa-page.module').then( m => m.EasypaisaPagePageModule)
  },
  {
    path: 'finalpage',
    loadChildren: () => import('./Checkout Module/finalpage/finalpage.module').then( m => m.FinalpagePageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./Inventory Module/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'neworder',
    loadChildren: () => import('./Inventory Module/orders/new-orders/new-orders.module').then( m => m.NewOrdersPageModule)
  },
  {
    path: 'confirmedorder',
    loadChildren: () => import('./Inventory Module/orders/confirmed-orders/confirmed-orders.module').then( m => m.ConfirmedOrdersPageModule)
  },
  {
    path: 'cancelledorder',
    loadChildren: () => import('./Inventory Module/orders/cancelled-orders/cancelled-orders.module').then( m => m.CancelledOrdersPageModule)
  },
  {
    path: 'deliveredorder',
    loadChildren: () => import('./Inventory Module/orders/delivered-orders/delivered-orders.module').then( m => m.DeliveredOrdersPageModule)
  }

// {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  // //{
  //   //path: 'home',
  //   //loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  // //},
  // {
  //   path: 'login',
  //   canActivate: [RedirectLoginGuard],
  //   loadChildren: () =>
  //     import('./login/login.module').then(m => m.LoginPageModule)
  // },
  // {
  //   path: 'register',
  //   loadChildren: () =>
  //     import('./register/register.module').then(m => m.RegisterPageModule)
  // },
  // {
  //   path: 'books',
  //   canActivate: [IsLoginGuard],
  //   loadChildren: () =>
  //     import('./books/books.module').then(m => m.BooksPageModule)
  // },
  // {
  //   path: 'forgotpassword',
  //   loadChildren: () => 
  //   import('./password reset/forgotpassword/forgotpassword.module').then( m => m.ForgotpasswordPageModule)
  // },
  // {
  //   path: 'changepassword',
  //   loadChildren: () => 
  //   import('./password reset/changepassword/changepassword.module').then( m => m.ChangepasswordPageModule)
  // },
  // {
  //   path: 'verifyEmail',
  //   loadChildren: () => 
  //   import('./password reset/verifyemail/verifyemail.module').then( m => m.VerifyemailPageModule)
  // },
  // {
  //   path: 'profile',
  //   canActivate: [IsLoginGuard],
  //   loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
