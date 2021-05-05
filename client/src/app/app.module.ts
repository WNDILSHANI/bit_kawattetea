import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './views/login/login.component';
import { MainWindowComponent } from './views/main-window/main-window.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { PageHeaderComponent } from './shared/views/page-header/page-header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Interceptor} from './shared/interceptor';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTreeModule} from '@angular/material/tree';
import { NavigationComponent } from './shared/views/navigation/navigation.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { RoleDetailComponent } from './views/modules/role/role-detail/role-detail.component';
import { RoleFormComponent } from './views/modules/role/role-form/role-form.component';
import { RoleTableComponent } from './views/modules/role/role-table/role-table.component';
import { RoleUpdateFormComponent } from './views/modules/role/role-update-form/role-update-form.component';
import { UserDetailComponent } from './views/modules/user/user-detail/user-detail.component';
import { UserFormComponent } from './views/modules/user/user-form/user-form.component';
import { UserTableComponent } from './views/modules/user/user-table/user-table.component';
import { UserUpdateFormComponent } from './views/modules/user/user-update-form/user-update-form.component';
import { ChangePasswordComponent } from './views/modules/user/change-password/change-password.component';
import { ResetPasswordComponent } from './views/modules/user/reset-password/reset-password.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from './shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { EmptyDataTableComponent } from './shared/views/empty-data-table/empty-data-table.component';
import { LoginTimeOutDialogComponent } from './shared/views/login-time-out-dialog/login-time-out-dialog.component';
import { Nl2brPipe } from './shared/nl2br.pipe';
import { NoPrivilegeComponent } from './shared/views/no-privilege/no-privilege.component';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { AdminConfigurationComponent } from './views/admin-configuration/admin-configuration.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ObjectNotFoundComponent } from './shared/views/object-not-found/object-not-found.component';
import { LoadingComponent } from './shared/views/loading/loading.component';
import { ConfirmDialogComponent } from './shared/views/confirm-dialog/confirm-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';
import { DualListboxComponent } from './shared/ui-components/dual-listbox/dual-listbox.component';
import {FileChooserComponent} from './shared/ui-components/file-chooser/file-chooser.component';
import { ChangePhotoComponent } from './views/modules/user/change-photo/change-photo.component';
import { MyAllNotificationComponent } from './views/modules/user/my-all-notification/my-all-notification.component';
import {DeductionUpdateSubFormComponent} from './views/modules/supplierpayment/supplierpayment-update-form/deduction-update-sub-form/deduction-update-sub-form.component';
import {ProductmaterialUpdateSubFormComponent} from './views/modules/product/product-update-form/productmaterial-update-sub-form/productmaterial-update-sub-form.component';
import {CustomerpaymentTableComponent} from './views/modules/customerpayment/customerpayment-table/customerpayment-table.component';
import {CustomerpaymentFormComponent} from './views/modules/customerpayment/customerpayment-form/customerpayment-form.component';
import {CustomerpaymentDetailComponent} from './views/modules/customerpayment/customerpayment-detail/customerpayment-detail.component';
import {CustomerpaymentUpdateFormComponent} from './views/modules/customerpayment/customerpayment-update-form/customerpayment-update-form.component';
import {PermentingTableComponent} from './views/modules/permenting/permenting-table/permenting-table.component';
import {PermentingFormComponent} from './views/modules/permenting/permenting-form/permenting-form.component';
import {PermentingDetailComponent} from './views/modules/permenting/permenting-detail/permenting-detail.component';
import {PermentingUpdateFormComponent} from './views/modules/permenting/permenting-update-form/permenting-update-form.component';
import {EmployeeTableComponent} from './views/modules/employee/employee-table/employee-table.component';
import {EmployeeFormComponent} from './views/modules/employee/employee-form/employee-form.component';
import {EmployeeDetailComponent} from './views/modules/employee/employee-detail/employee-detail.component';
import {EmployeeUpdateFormComponent} from './views/modules/employee/employee-update-form/employee-update-form.component';
import {SupplierTableComponent} from './views/modules/supplier/supplier-table/supplier-table.component';
import {SupplierFormComponent} from './views/modules/supplier/supplier-form/supplier-form.component';
import {SupplierDetailComponent} from './views/modules/supplier/supplier-detail/supplier-detail.component';
import {SupplierUpdateFormComponent} from './views/modules/supplier/supplier-update-form/supplier-update-form.component';
import {DryeringdryeringlineSubFormComponent} from './views/modules/dryering/dryering-form/dryeringdryeringline-sub-form/dryeringdryeringline-sub-form.component';
import {ProductdisposalinventorySubFormComponent} from './views/modules/productdisposal/productdisposal-form/productdisposalinventory-sub-form/productdisposalinventory-sub-form.component';
import {WitheringwitherlineSubFormComponent} from './views/modules/withering/withering-form/witheringwitherline-sub-form/witheringwitherline-sub-form.component';
import {GrindinggrindingmachineSubFormComponent} from './views/modules/grinding/grinding-form/grindinggrindingmachine-sub-form/grindinggrindingmachine-sub-form.component';
import {ProductmaterialSubFormComponent} from './views/modules/product/product-form/productmaterial-sub-form/productmaterial-sub-form.component';
import {CollectionTableComponent} from './views/modules/collection/collection-table/collection-table.component';
import {CollectionFormComponent} from './views/modules/collection/collection-form/collection-form.component';
import {CollectionDetailComponent} from './views/modules/collection/collection-detail/collection-detail.component';
import {CollectionUpdateFormComponent} from './views/modules/collection/collection-update-form/collection-update-form.component';
import {PermentingpermentingmachineUpdateSubFormComponent} from './views/modules/permenting/permenting-update-form/permentingpermentingmachine-update-sub-form/permentingpermentingmachine-update-sub-form.component';
import {PorderTableComponent} from './views/modules/porder/porder-table/porder-table.component';
import {PorderFormComponent} from './views/modules/porder/porder-form/porder-form.component';
import {PorderDetailComponent} from './views/modules/porder/porder-detail/porder-detail.component';
import {PorderUpdateFormComponent} from './views/modules/porder/porder-update-form/porder-update-form.component';
import {WitheringwitherlineUpdateSubFormComponent} from './views/modules/withering/withering-update-form/witheringwitherline-update-sub-form/witheringwitherline-update-sub-form.component';
import {WitheringTableComponent} from './views/modules/withering/withering-table/withering-table.component';
import {WitheringFormComponent} from './views/modules/withering/withering-form/withering-form.component';
import {WitheringDetailComponent} from './views/modules/withering/withering-detail/withering-detail.component';
import {WitheringUpdateFormComponent} from './views/modules/withering/withering-update-form/withering-update-form.component';
import {DisposalgradebatchUpdateSubFormComponent} from './views/modules/disposal/disposal-update-form/disposalgradebatch-update-sub-form/disposalgradebatch-update-sub-form.component';
import {PorderproductSubFormComponent} from './views/modules/porder/porder-form/porderproduct-sub-form/porderproduct-sub-form.component';
import {ProductdisposalinventoryUpdateSubFormComponent} from './views/modules/productdisposal/productdisposal-update-form/productdisposalinventory-update-sub-form/productdisposalinventory-update-sub-form.component';
import {ProductdisposalTableComponent} from './views/modules/productdisposal/productdisposal-table/productdisposal-table.component';
import {ProductdisposalFormComponent} from './views/modules/productdisposal/productdisposal-form/productdisposal-form.component';
import {ProductdisposalDetailComponent} from './views/modules/productdisposal/productdisposal-detail/productdisposal-detail.component';
import {ProductdisposalUpdateFormComponent} from './views/modules/productdisposal/productdisposal-update-form/productdisposal-update-form.component';
import {PackingproductSubFormComponent} from './views/modules/packing/packing-form/packingproduct-sub-form/packingproduct-sub-form.component';
import {GrindingTableComponent} from './views/modules/grinding/grinding-table/grinding-table.component';
import {GrindingFormComponent} from './views/modules/grinding/grinding-form/grinding-form.component';
import {GrindingDetailComponent} from './views/modules/grinding/grinding-detail/grinding-detail.component';
import {GrindingUpdateFormComponent} from './views/modules/grinding/grinding-update-form/grinding-update-form.component';
import {DistributionTableComponent} from './views/modules/distribution/distribution-table/distribution-table.component';
import {DistributionFormComponent} from './views/modules/distribution/distribution-form/distribution-form.component';
import {DistributionDetailComponent} from './views/modules/distribution/distribution-detail/distribution-detail.component';
import {DistributionUpdateFormComponent} from './views/modules/distribution/distribution-update-form/distribution-update-form.component';
import {InventoryTableComponent} from './views/modules/inventory/inventory-table/inventory-table.component';
import {InventoryFormComponent} from './views/modules/inventory/inventory-form/inventory-form.component';
import {InventoryDetailComponent} from './views/modules/inventory/inventory-detail/inventory-detail.component';
import {InventoryUpdateFormComponent} from './views/modules/inventory/inventory-update-form/inventory-update-form.component';
import {PackingTableComponent} from './views/modules/packing/packing-table/packing-table.component';
import {PackingFormComponent} from './views/modules/packing/packing-form/packing-form.component';
import {PackingDetailComponent} from './views/modules/packing/packing-detail/packing-detail.component';
import {PackingUpdateFormComponent} from './views/modules/packing/packing-update-form/packing-update-form.component';
import {DisposalTableComponent} from './views/modules/disposal/disposal-table/disposal-table.component';
import {DisposalFormComponent} from './views/modules/disposal/disposal-form/disposal-form.component';
import {DisposalDetailComponent} from './views/modules/disposal/disposal-detail/disposal-detail.component';
import {DisposalUpdateFormComponent} from './views/modules/disposal/disposal-update-form/disposal-update-form.component';
import {CategorizedmaterialTableComponent} from './views/modules/categorizedmaterial/categorizedmaterial-table/categorizedmaterial-table.component';
import {CategorizedmaterialFormComponent} from './views/modules/categorizedmaterial/categorizedmaterial-form/categorizedmaterial-form.component';
import {CategorizedmaterialDetailComponent} from './views/modules/categorizedmaterial/categorizedmaterial-detail/categorizedmaterial-detail.component';
import {CategorizedmaterialUpdateFormComponent} from './views/modules/categorizedmaterial/categorizedmaterial-update-form/categorizedmaterial-update-form.component';
import {PermentingpermentingmachineSubFormComponent} from './views/modules/permenting/permenting-form/permentingpermentingmachine-sub-form/permentingpermentingmachine-sub-form.component';
import {SupplierpaymentTableComponent} from './views/modules/supplierpayment/supplierpayment-table/supplierpayment-table.component';
import {SupplierpaymentFormComponent} from './views/modules/supplierpayment/supplierpayment-form/supplierpayment-form.component';
import {SupplierpaymentDetailComponent} from './views/modules/supplierpayment/supplierpayment-detail/supplierpayment-detail.component';
import {SupplierpaymentUpdateFormComponent} from './views/modules/supplierpayment/supplierpayment-update-form/supplierpayment-update-form.component';
import {VehicleTableComponent} from './views/modules/vehicle/vehicle-table/vehicle-table.component';
import {VehicleFormComponent} from './views/modules/vehicle/vehicle-form/vehicle-form.component';
import {VehicleDetailComponent} from './views/modules/vehicle/vehicle-detail/vehicle-detail.component';
import {VehicleUpdateFormComponent} from './views/modules/vehicle/vehicle-update-form/vehicle-update-form.component';
import {GrindinggrindingmachineUpdateSubFormComponent} from './views/modules/grinding/grinding-update-form/grindinggrindingmachine-update-sub-form/grindinggrindingmachine-update-sub-form.component';
import {ProductTableComponent} from './views/modules/product/product-table/product-table.component';
import {ProductFormComponent} from './views/modules/product/product-form/product-form.component';
import {ProductDetailComponent} from './views/modules/product/product-detail/product-detail.component';
import {ProductUpdateFormComponent} from './views/modules/product/product-update-form/product-update-form.component';
import {CustomerrefundTableComponent} from './views/modules/customerrefund/customerrefund-table/customerrefund-table.component';
import {CustomerrefundFormComponent} from './views/modules/customerrefund/customerrefund-form/customerrefund-form.component';
import {CustomerrefundDetailComponent} from './views/modules/customerrefund/customerrefund-detail/customerrefund-detail.component';
import {CustomerrefundUpdateFormComponent} from './views/modules/customerrefund/customerrefund-update-form/customerrefund-update-form.component';
import {SaleinventoryUpdateSubFormComponent} from './views/modules/sale/sale-update-form/saleinventory-update-sub-form/saleinventory-update-sub-form.component';
import {CategorizationTableComponent} from './views/modules/categorization/categorization-table/categorization-table.component';
import {CategorizationFormComponent} from './views/modules/categorization/categorization-form/categorization-form.component';
import {CategorizationDetailComponent} from './views/modules/categorization/categorization-detail/categorization-detail.component';
import {CategorizationUpdateFormComponent} from './views/modules/categorization/categorization-update-form/categorization-update-form.component';
import {CustomerrefundproductSubFormComponent} from './views/modules/customerrefund/customerrefund-form/customerrefundproduct-sub-form/customerrefundproduct-sub-form.component';
import {DryeringdryeringlineUpdateSubFormComponent} from './views/modules/dryering/dryering-update-form/dryeringdryeringline-update-sub-form/dryeringdryeringline-update-sub-form.component';
import {DeductionSubFormComponent} from './views/modules/supplierpayment/supplierpayment-form/deduction-sub-form/deduction-sub-form.component';
import {PorderproductUpdateSubFormComponent} from './views/modules/porder/porder-update-form/porderproduct-update-sub-form/porderproduct-update-sub-form.component';
import {DryeringTableComponent} from './views/modules/dryering/dryering-table/dryering-table.component';
import {DryeringFormComponent} from './views/modules/dryering/dryering-form/dryering-form.component';
import {DryeringDetailComponent} from './views/modules/dryering/dryering-detail/dryering-detail.component';
import {DryeringUpdateFormComponent} from './views/modules/dryering/dryering-update-form/dryering-update-form.component';
import {GradebatchTableComponent} from './views/modules/gradebatch/gradebatch-table/gradebatch-table.component';
import {GradebatchFormComponent} from './views/modules/gradebatch/gradebatch-form/gradebatch-form.component';
import {GradebatchDetailComponent} from './views/modules/gradebatch/gradebatch-detail/gradebatch-detail.component';
import {GradebatchUpdateFormComponent} from './views/modules/gradebatch/gradebatch-update-form/gradebatch-update-form.component';
import {SaleTableComponent} from './views/modules/sale/sale-table/sale-table.component';
import {SaleFormComponent} from './views/modules/sale/sale-form/sale-form.component';
import {SaleDetailComponent} from './views/modules/sale/sale-detail/sale-detail.component';
import {SaleUpdateFormComponent} from './views/modules/sale/sale-update-form/sale-update-form.component';
import {MaterialTableComponent} from './views/modules/material/material-table/material-table.component';
import {MaterialFormComponent} from './views/modules/material/material-form/material-form.component';
import {MaterialDetailComponent} from './views/modules/material/material-detail/material-detail.component';
import {MaterialUpdateFormComponent} from './views/modules/material/material-update-form/material-update-form.component';
import {CustomerrefundproductUpdateSubFormComponent} from './views/modules/customerrefund/customerrefund-update-form/customerrefundproduct-update-sub-form/customerrefundproduct-update-sub-form.component';
import {TastingTableComponent} from './views/modules/tasting/tasting-table/tasting-table.component';
import {TastingFormComponent} from './views/modules/tasting/tasting-form/tasting-form.component';
import {TastingDetailComponent} from './views/modules/tasting/tasting-detail/tasting-detail.component';
import {TastingUpdateFormComponent} from './views/modules/tasting/tasting-update-form/tasting-update-form.component';
import {SaleinventorySubFormComponent} from './views/modules/sale/sale-form/saleinventory-sub-form/saleinventory-sub-form.component';
import {DisposalgradebatchSubFormComponent} from './views/modules/disposal/disposal-form/disposalgradebatch-sub-form/disposalgradebatch-sub-form.component';
import {PackingproductUpdateSubFormComponent} from './views/modules/packing/packing-update-form/packingproduct-update-sub-form/packingproduct-update-sub-form.component';
import {CustomerTableComponent} from './views/modules/customer/customer-table/customer-table.component';
import {CustomerFormComponent} from './views/modules/customer/customer-form/customer-form.component';
import {CustomerDetailComponent} from './views/modules/customer/customer-detail/customer-detail.component';
import {CustomerUpdateFormComponent} from './views/modules/customer/customer-update-form/customer-update-form.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainWindowComponent,
        DashboardComponent,
        PageNotFoundComponent,
        PageHeaderComponent,
        NavigationComponent,
        RoleDetailComponent,
        RoleFormComponent,
        RoleTableComponent,
        RoleUpdateFormComponent,
        UserDetailComponent,
        UserFormComponent,
        UserTableComponent,
        UserUpdateFormComponent,
        ChangePasswordComponent,
        ResetPasswordComponent,
        DeleteConfirmDialogComponent,
        EmptyDataTableComponent,
        LoginTimeOutDialogComponent,
        Nl2brPipe,
        NoPrivilegeComponent,
        AdminConfigurationComponent,
        FileChooserComponent,
        ObjectNotFoundComponent,
        LoadingComponent,
        ConfirmDialogComponent,
        DualListboxComponent,
        ChangePhotoComponent,
        MyAllNotificationComponent,
        DeductionUpdateSubFormComponent,
        ProductmaterialUpdateSubFormComponent,
        CustomerpaymentTableComponent,
        CustomerpaymentFormComponent,
        CustomerpaymentDetailComponent,
        CustomerpaymentUpdateFormComponent,
        PermentingTableComponent,
        PermentingFormComponent,
        PermentingDetailComponent,
        PermentingUpdateFormComponent,
        EmployeeTableComponent,
        EmployeeFormComponent,
        EmployeeDetailComponent,
        EmployeeUpdateFormComponent,
        SupplierTableComponent,
        SupplierFormComponent,
        SupplierDetailComponent,
        SupplierUpdateFormComponent,
        DryeringdryeringlineSubFormComponent,
        ProductdisposalinventorySubFormComponent,
        WitheringwitherlineSubFormComponent,
        GrindinggrindingmachineSubFormComponent,
        ProductmaterialSubFormComponent,
        CollectionTableComponent,
        CollectionFormComponent,
        CollectionDetailComponent,
        CollectionUpdateFormComponent,
        PermentingpermentingmachineUpdateSubFormComponent,
        PorderTableComponent,
        PorderFormComponent,
        PorderDetailComponent,
        PorderUpdateFormComponent,
        WitheringwitherlineUpdateSubFormComponent,
        WitheringTableComponent,
        WitheringFormComponent,
        WitheringDetailComponent,
        WitheringUpdateFormComponent,
        DisposalgradebatchUpdateSubFormComponent,
        PorderproductSubFormComponent,
        ProductdisposalinventoryUpdateSubFormComponent,
        ProductdisposalTableComponent,
        ProductdisposalFormComponent,
        ProductdisposalDetailComponent,
        ProductdisposalUpdateFormComponent,
        PackingproductSubFormComponent,
        GrindingTableComponent,
        GrindingFormComponent,
        GrindingDetailComponent,
        GrindingUpdateFormComponent,
        DistributionTableComponent,
        DistributionFormComponent,
        DistributionDetailComponent,
        DistributionUpdateFormComponent,
        InventoryTableComponent,
        InventoryFormComponent,
        InventoryDetailComponent,
        InventoryUpdateFormComponent,
        PackingTableComponent,
        PackingFormComponent,
        PackingDetailComponent,
        PackingUpdateFormComponent,
        DisposalTableComponent,
        DisposalFormComponent,
        DisposalDetailComponent,
        DisposalUpdateFormComponent,
        CategorizedmaterialTableComponent,
        CategorizedmaterialFormComponent,
        CategorizedmaterialDetailComponent,
        CategorizedmaterialUpdateFormComponent,
        PermentingpermentingmachineSubFormComponent,
        SupplierpaymentTableComponent,
        SupplierpaymentFormComponent,
        SupplierpaymentDetailComponent,
        SupplierpaymentUpdateFormComponent,
        VehicleTableComponent,
        VehicleFormComponent,
        VehicleDetailComponent,
        VehicleUpdateFormComponent,
        GrindinggrindingmachineUpdateSubFormComponent,
        ProductTableComponent,
        ProductFormComponent,
        ProductDetailComponent,
        ProductUpdateFormComponent,
        CustomerrefundTableComponent,
        CustomerrefundFormComponent,
        CustomerrefundDetailComponent,
        CustomerrefundUpdateFormComponent,
        SaleinventoryUpdateSubFormComponent,
        CategorizationTableComponent,
        CategorizationFormComponent,
        CategorizationDetailComponent,
        CategorizationUpdateFormComponent,
        CustomerrefundproductSubFormComponent,
        DryeringdryeringlineUpdateSubFormComponent,
        DeductionSubFormComponent,
        PorderproductUpdateSubFormComponent,
        DryeringTableComponent,
        DryeringFormComponent,
        DryeringDetailComponent,
        DryeringUpdateFormComponent,
        GradebatchTableComponent,
        GradebatchFormComponent,
        GradebatchDetailComponent,
        GradebatchUpdateFormComponent,
        SaleTableComponent,
        SaleFormComponent,
        SaleDetailComponent,
        SaleUpdateFormComponent,
        MaterialTableComponent,
        MaterialFormComponent,
        MaterialDetailComponent,
        MaterialUpdateFormComponent,
        CustomerrefundproductUpdateSubFormComponent,
        TastingTableComponent,
        TastingFormComponent,
        TastingDetailComponent,
        TastingUpdateFormComponent,
        SaleinventorySubFormComponent,
        DisposalgradebatchSubFormComponent,
        PackingproductUpdateSubFormComponent,
        CustomerTableComponent,
        CustomerFormComponent,
        CustomerDetailComponent,
        CustomerUpdateFormComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    HttpClientModule,
    MatSidenavModule,
    MatBadgeModule,
    MatTooltipModule,
    MatListModule,
    MatExpansionModule,
    MatGridListModule,
    MatTreeModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
