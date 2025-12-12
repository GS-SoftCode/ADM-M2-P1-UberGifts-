import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
    import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'create-account',
    loadComponent: () =>
    import('./pages/create-account/create-account.page').then((m) => m.CreateAccountPage),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./product-detail/product-detail.page').then((m) => m.ProductDetailPage),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.page').then((m) => m.CheckoutPage),
  },
  {
    path: 'order-confirmation',
    loadComponent: () =>
      import('./pages/order-confirmation/order-confirmation.page').then((m) => m.OrderConfirmationPage),
  },
  {
    path: 'tabs',
    loadChildren: () =>
    import('./tabs/tabs.routes').then((m) => m.routes),
  },  
];
