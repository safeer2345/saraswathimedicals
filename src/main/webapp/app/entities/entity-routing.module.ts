import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'customer',
        data: { pageTitle: 'saraswathimedicalsApp.customer.home.title' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'vender',
        data: { pageTitle: 'saraswathimedicalsApp.vender.home.title' },
        loadChildren: () => import('./vender/vender.module').then(m => m.VenderModule),
      },
      {
        path: 'product-category',
        data: { pageTitle: 'saraswathimedicalsApp.productCategory.home.title' },
        loadChildren: () => import('./product-category/product-category.module').then(m => m.ProductCategoryModule),
      },
      {
        path: 'product',
        data: { pageTitle: 'saraswathimedicalsApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'stock',
        data: { pageTitle: 'saraswathimedicalsApp.stock.home.title' },
        loadChildren: () => import('./stock/stock.module').then(m => m.StockModule),
      },
      {
        path: 'product-rate',
        data: { pageTitle: 'saraswathimedicalsApp.productRate.home.title' },
        loadChildren: () => import('./product-rate/product-rate.module').then(m => m.ProductRateModule),
      },
      {
        path: 'sale',
        data: { pageTitle: 'saraswathimedicalsApp.sale.home.title' },
        loadChildren: () => import('./sale/sale.module').then(m => m.SaleModule),
      },
      {
        path: 'purchase-details',
        data: { pageTitle: 'saraswathimedicalsApp.purchaseDetails.home.title' },
        loadChildren: () => import('./purchase-details/purchase-details.module').then(m => m.PurchaseDetailsModule),
      },
      {
        path: 'purchase',
        data: { pageTitle: 'saraswathimedicalsApp.purchase.home.title' },
        loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchaseModule),
      },
      {
        path: 'sales-details',
        data: { pageTitle: 'saraswathimedicalsApp.salesDetails.home.title' },
        loadChildren: () => import('./sales-details/sales-details.module').then(m => m.SalesDetailsModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
