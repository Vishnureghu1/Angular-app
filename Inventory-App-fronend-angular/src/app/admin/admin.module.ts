import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { CreateproductComponent } from './createproduct/createproduct.component';
import { UpdateproductComponent } from './updateproduct/updateproduct.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatogoriesComponent } from './catogories/catogories.component';
import { CreatecategoryComponent } from './createcategory/createcategory.component';
import { UpdatecategoryComponent } from './updatecategory/updatecategory.component';
import { VendorsComponent } from './vendors/vendors.component';
import { CreatevendorComponent } from './createvendor/createvendor.component';
import { UpdatevendorComponent } from './updatevendor/updatevendor.component';
import { StockinComponent } from './stockin/stockin.component';
import { StockoutComponent } from './stockout/stockout.component';
import { ReturnproductComponent } from './returnproduct/returnproduct.component';
import { StockinhistoryComponent } from './stockinhistory/stockinhistory.component';
import { StockouthistoryComponent } from './stockouthistory/stockouthistory.component';
import { ReturnhistoryComponent } from './returnhistory/returnhistory.component';
import { FooterComponent } from './footer/footer.component';
import { IndividualComponent } from './individual/individual.component';
import { AttributesComponent } from './attributes/attributes.component';
import { UpdateattributeComponent } from './updateattribute/updateattribute.component';
import { AddattributeComponent } from './addattribute/addattribute.component';
import { RetailsaleComponent } from './retailsale/retailsale.component';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    CreateproductComponent,
    UpdateproductComponent,
    CatogoriesComponent,
    CreatecategoryComponent,
    UpdatecategoryComponent,
    VendorsComponent,
    CreatevendorComponent,
    UpdatevendorComponent,
    StockinComponent,
    StockoutComponent,
    ReturnproductComponent,
    StockinhistoryComponent,
    StockouthistoryComponent,
    ReturnhistoryComponent,
    FooterComponent,
    IndividualComponent,
    AttributesComponent,
    UpdateattributeComponent,
    AddattributeComponent,
    RetailsaleComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
