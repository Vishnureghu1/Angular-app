import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddattributeComponent } from './addattribute/addattribute.component';
import { AttributesComponent } from './attributes/attributes.component';
import { CatogoriesComponent } from './catogories/catogories.component';
import { CreatecategoryComponent } from './createcategory/createcategory.component';
import { CreateproductComponent } from './createproduct/createproduct.component';
import { CreatevendorComponent } from './createvendor/createvendor.component';
import { HomeComponent } from './home/home.component';
import { IndividualComponent } from './individual/individual.component';
import { RetailsaleComponent } from './retailsale/retailsale.component';
import { ReturnhistoryComponent } from './returnhistory/returnhistory.component';
import { ReturnproductComponent } from './returnproduct/returnproduct.component';
import { StockinComponent } from './stockin/stockin.component';
import { StockinhistoryComponent } from './stockinhistory/stockinhistory.component';
import { StockoutComponent } from './stockout/stockout.component';
import { StockouthistoryComponent } from './stockouthistory/stockouthistory.component';
import { UpdateattributeComponent } from './updateattribute/updateattribute.component';
import { UpdatecategoryComponent } from './updatecategory/updatecategory.component';
import { UpdateproductComponent } from './updateproduct/updateproduct.component';
import { UpdatevendorComponent } from './updatevendor/updatevendor.component';
import { VendorsComponent } from './vendors/vendors.component';

const routes: Routes = [
  { path: '', component : StockinhistoryComponent},
  { path: 'product' ,component: HomeComponent },
  { path: 'updateproduct' , component : UpdateproductComponent},
  { path: 'addproduct' , component : CreateproductComponent},
  { path: 'categories' , component : CatogoriesComponent},
  { path: 'addcategory' , component : CreatecategoryComponent},
  { path: 'updatecategory' , component : UpdatecategoryComponent},
  { path: 'vendors' , component : VendorsComponent},
  { path: 'addvendor' , component : CreatevendorComponent},
  { path: 'updatevendor' , component : UpdatevendorComponent},
  { path: 'stockin' , component : StockinComponent},
  { path: 'stockout' , component : StockoutComponent},
  { path: 'returnproduct' , component : ReturnproductComponent},  
  { path: 'stockouthistory' , component : StockouthistoryComponent},
  { path: 'returnhistory' , component : ReturnhistoryComponent}  ,
  {path:'attributes', component: AttributesComponent},
  {path:'updateattribute', component:UpdateattributeComponent},
  {path:'addattribute',component:AddattributeComponent},
  {path:'retailsale',component:RetailsaleComponent},
  { path: ':id',  component:IndividualComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
