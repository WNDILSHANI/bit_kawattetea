import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './views/login/login.component';
import {MainWindowComponent} from './views/main-window/main-window.component';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import {PageNotFoundComponent} from './views/page-not-found/page-not-found.component';
import {UserTableComponent} from './views/modules/user/user-table/user-table.component';
import {UserFormComponent} from './views/modules/user/user-form/user-form.component';
import {UserDetailComponent} from './views/modules/user/user-detail/user-detail.component';
import {UserUpdateFormComponent} from './views/modules/user/user-update-form/user-update-form.component';
import {RoleTableComponent} from './views/modules/role/role-table/role-table.component';
import {RoleFormComponent} from './views/modules/role/role-form/role-form.component';
import {RoleDetailComponent} from './views/modules/role/role-detail/role-detail.component';
import {RoleUpdateFormComponent} from './views/modules/role/role-update-form/role-update-form.component';
import {ChangePasswordComponent} from './views/modules/user/change-password/change-password.component';
import {ResetPasswordComponent} from './views/modules/user/reset-password/reset-password.component';
import {ChangePhotoComponent} from './views/modules/user/change-photo/change-photo.component';
import {MyAllNotificationComponent} from './views/modules/user/my-all-notification/my-all-notification.component';
import {ProductdisposalTableComponent} from './views/modules/productdisposal/productdisposal-table/productdisposal-table.component';
import {ProductdisposalFormComponent} from './views/modules/productdisposal/productdisposal-form/productdisposal-form.component';
import {ProductdisposalDetailComponent} from './views/modules/productdisposal/productdisposal-detail/productdisposal-detail.component';
import {ProductdisposalUpdateFormComponent} from './views/modules/productdisposal/productdisposal-update-form/productdisposal-update-form.component';
import {GrindingTableComponent} from './views/modules/grinding/grinding-table/grinding-table.component';
import {GrindingFormComponent} from './views/modules/grinding/grinding-form/grinding-form.component';
import {GrindingDetailComponent} from './views/modules/grinding/grinding-detail/grinding-detail.component';
import {GrindingUpdateFormComponent} from './views/modules/grinding/grinding-update-form/grinding-update-form.component';
import {CustomerpaymentTableComponent} from './views/modules/customerpayment/customerpayment-table/customerpayment-table.component';
import {CustomerpaymentFormComponent} from './views/modules/customerpayment/customerpayment-form/customerpayment-form.component';
import {CustomerpaymentDetailComponent} from './views/modules/customerpayment/customerpayment-detail/customerpayment-detail.component';
import {CustomerpaymentUpdateFormComponent} from './views/modules/customerpayment/customerpayment-update-form/customerpayment-update-form.component';
import {PermentingTableComponent} from './views/modules/permenting/permenting-table/permenting-table.component';
import {PermentingFormComponent} from './views/modules/permenting/permenting-form/permenting-form.component';
import {PermentingDetailComponent} from './views/modules/permenting/permenting-detail/permenting-detail.component';
import {PermentingUpdateFormComponent} from './views/modules/permenting/permenting-update-form/permenting-update-form.component';
import {DistributionTableComponent} from './views/modules/distribution/distribution-table/distribution-table.component';
import {DistributionFormComponent} from './views/modules/distribution/distribution-form/distribution-form.component';
import {DistributionDetailComponent} from './views/modules/distribution/distribution-detail/distribution-detail.component';
import {DistributionUpdateFormComponent} from './views/modules/distribution/distribution-update-form/distribution-update-form.component';
import {EmployeeTableComponent} from './views/modules/employee/employee-table/employee-table.component';
import {EmployeeFormComponent} from './views/modules/employee/employee-form/employee-form.component';
import {EmployeeDetailComponent} from './views/modules/employee/employee-detail/employee-detail.component';
import {EmployeeUpdateFormComponent} from './views/modules/employee/employee-update-form/employee-update-form.component';
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
import {SupplierpaymentTableComponent} from './views/modules/supplierpayment/supplierpayment-table/supplierpayment-table.component';
import {SupplierpaymentFormComponent} from './views/modules/supplierpayment/supplierpayment-form/supplierpayment-form.component';
import {SupplierpaymentDetailComponent} from './views/modules/supplierpayment/supplierpayment-detail/supplierpayment-detail.component';
import {SupplierpaymentUpdateFormComponent} from './views/modules/supplierpayment/supplierpayment-update-form/supplierpayment-update-form.component';
import {VehicleTableComponent} from './views/modules/vehicle/vehicle-table/vehicle-table.component';
import {VehicleFormComponent} from './views/modules/vehicle/vehicle-form/vehicle-form.component';
import {VehicleDetailComponent} from './views/modules/vehicle/vehicle-detail/vehicle-detail.component';
import {VehicleUpdateFormComponent} from './views/modules/vehicle/vehicle-update-form/vehicle-update-form.component';
import {SupplierTableComponent} from './views/modules/supplier/supplier-table/supplier-table.component';
import {SupplierFormComponent} from './views/modules/supplier/supplier-form/supplier-form.component';
import {SupplierDetailComponent} from './views/modules/supplier/supplier-detail/supplier-detail.component';
import {SupplierUpdateFormComponent} from './views/modules/supplier/supplier-update-form/supplier-update-form.component';
import {ProductTableComponent} from './views/modules/product/product-table/product-table.component';
import {ProductFormComponent} from './views/modules/product/product-form/product-form.component';
import {ProductDetailComponent} from './views/modules/product/product-detail/product-detail.component';
import {ProductUpdateFormComponent} from './views/modules/product/product-update-form/product-update-form.component';
import {CustomerrefundTableComponent} from './views/modules/customerrefund/customerrefund-table/customerrefund-table.component';
import {CustomerrefundFormComponent} from './views/modules/customerrefund/customerrefund-form/customerrefund-form.component';
import {CustomerrefundDetailComponent} from './views/modules/customerrefund/customerrefund-detail/customerrefund-detail.component';
import {CustomerrefundUpdateFormComponent} from './views/modules/customerrefund/customerrefund-update-form/customerrefund-update-form.component';
import {CategorizationTableComponent} from './views/modules/categorization/categorization-table/categorization-table.component';
import {CategorizationFormComponent} from './views/modules/categorization/categorization-form/categorization-form.component';
import {CategorizationDetailComponent} from './views/modules/categorization/categorization-detail/categorization-detail.component';
import {CategorizationUpdateFormComponent} from './views/modules/categorization/categorization-update-form/categorization-update-form.component';
import {CollectionTableComponent} from './views/modules/collection/collection-table/collection-table.component';
import {CollectionFormComponent} from './views/modules/collection/collection-form/collection-form.component';
import {CollectionDetailComponent} from './views/modules/collection/collection-detail/collection-detail.component';
import {CollectionUpdateFormComponent} from './views/modules/collection/collection-update-form/collection-update-form.component';
import {PorderTableComponent} from './views/modules/porder/porder-table/porder-table.component';
import {PorderFormComponent} from './views/modules/porder/porder-form/porder-form.component';
import {PorderDetailComponent} from './views/modules/porder/porder-detail/porder-detail.component';
import {PorderUpdateFormComponent} from './views/modules/porder/porder-update-form/porder-update-form.component';
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
import {WitheringTableComponent} from './views/modules/withering/withering-table/withering-table.component';
import {WitheringFormComponent} from './views/modules/withering/withering-form/withering-form.component';
import {WitheringDetailComponent} from './views/modules/withering/withering-detail/withering-detail.component';
import {WitheringUpdateFormComponent} from './views/modules/withering/withering-update-form/withering-update-form.component';
import {TastingTableComponent} from './views/modules/tasting/tasting-table/tasting-table.component';
import {TastingFormComponent} from './views/modules/tasting/tasting-form/tasting-form.component';
import {TastingDetailComponent} from './views/modules/tasting/tasting-detail/tasting-detail.component';
import {TastingUpdateFormComponent} from './views/modules/tasting/tasting-update-form/tasting-update-form.component';
import {CustomerTableComponent} from './views/modules/customer/customer-table/customer-table.component';
import {CustomerFormComponent} from './views/modules/customer/customer-form/customer-form.component';
import {CustomerDetailComponent} from './views/modules/customer/customer-detail/customer-detail.component';
import {CustomerUpdateFormComponent} from './views/modules/customer/customer-update-form/customer-update-form.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '',
    component: MainWindowComponent,
    children: [

      {path: 'users', component: UserTableComponent},
      {path: 'users/add', component: UserFormComponent},
      {path: 'users/change-my-password', component: ChangePasswordComponent},
      {path: 'users/change-my-photo', component: ChangePhotoComponent},
      {path: 'users/my-all-notifications', component: MyAllNotificationComponent},
      {path: 'users/reset-password', component: ResetPasswordComponent},
      {path: 'users/:id', component: UserDetailComponent},
      {path: 'users/edit/:id', component: UserUpdateFormComponent},

      {path: 'roles', component: RoleTableComponent},
      {path: 'roles/add', component: RoleFormComponent},
      {path: 'roles/:id', component: RoleDetailComponent},
      {path: 'roles/edit/:id', component: RoleUpdateFormComponent},

      {path: 'productdisposals', component: ProductdisposalTableComponent},
      {path: 'productdisposals/add', component: ProductdisposalFormComponent},
      {path: 'productdisposals/:id', component: ProductdisposalDetailComponent},
      {path: 'productdisposals/edit/:id', component: ProductdisposalUpdateFormComponent},

      {path: 'grindings', component: GrindingTableComponent},
      {path: 'grindings/add', component: GrindingFormComponent},
      {path: 'grindings/:id', component: GrindingDetailComponent},
      {path: 'grindings/edit/:id', component: GrindingUpdateFormComponent},

      {path: 'customerpayments', component: CustomerpaymentTableComponent},
      {path: 'customerpayments/add', component: CustomerpaymentFormComponent},
      {path: 'customerpayments/:id', component: CustomerpaymentDetailComponent},
      {path: 'customerpayments/edit/:id', component: CustomerpaymentUpdateFormComponent},

      {path: 'permentings', component: PermentingTableComponent},
      {path: 'permentings/add', component: PermentingFormComponent},
      {path: 'permentings/:id', component: PermentingDetailComponent},
      {path: 'permentings/edit/:id', component: PermentingUpdateFormComponent},

      {path: 'distributions', component: DistributionTableComponent},
      {path: 'distributions/add', component: DistributionFormComponent},
      {path: 'distributions/:id', component: DistributionDetailComponent},
      {path: 'distributions/edit/:id', component: DistributionUpdateFormComponent},

      {path: 'employees', component: EmployeeTableComponent},
      {path: 'employees/add', component: EmployeeFormComponent},
      {path: 'employees/:id', component: EmployeeDetailComponent},
      {path: 'employees/edit/:id', component: EmployeeUpdateFormComponent},

      {path: 'inventories', component: InventoryTableComponent},
      {path: 'inventories/add', component: InventoryFormComponent},
      {path: 'inventories/:id', component: InventoryDetailComponent},
      {path: 'inventories/edit/:id', component: InventoryUpdateFormComponent},

      {path: 'packings', component: PackingTableComponent},
      {path: 'packings/add', component: PackingFormComponent},
      {path: 'packings/:id', component: PackingDetailComponent},
      {path: 'packings/edit/:id', component: PackingUpdateFormComponent},

      {path: 'disposals', component: DisposalTableComponent},
      {path: 'disposals/add', component: DisposalFormComponent},
      {path: 'disposals/:id', component: DisposalDetailComponent},
      {path: 'disposals/edit/:id', component: DisposalUpdateFormComponent},

      {path: 'categorizedmaterials', component: CategorizedmaterialTableComponent},
      {path: 'categorizedmaterials/add', component: CategorizedmaterialFormComponent},
      {path: 'categorizedmaterials/:id', component: CategorizedmaterialDetailComponent},
      {path: 'categorizedmaterials/edit/:id', component: CategorizedmaterialUpdateFormComponent},

      {path: 'supplierpayments', component: SupplierpaymentTableComponent},
      {path: 'supplierpayments/add', component: SupplierpaymentFormComponent},
      {path: 'supplierpayments/:id', component: SupplierpaymentDetailComponent},
      {path: 'supplierpayments/edit/:id', component: SupplierpaymentUpdateFormComponent},

      {path: 'vehicles', component: VehicleTableComponent},
      {path: 'vehicles/add', component: VehicleFormComponent},
      {path: 'vehicles/:id', component: VehicleDetailComponent},
      {path: 'vehicles/edit/:id', component: VehicleUpdateFormComponent},

      {path: 'suppliers', component: SupplierTableComponent},
      {path: 'suppliers/add', component: SupplierFormComponent},
      {path: 'suppliers/:id', component: SupplierDetailComponent},
      {path: 'suppliers/edit/:id', component: SupplierUpdateFormComponent},

      {path: 'products', component: ProductTableComponent},
      {path: 'products/add', component: ProductFormComponent},
      {path: 'products/:id', component: ProductDetailComponent},
      {path: 'products/edit/:id', component: ProductUpdateFormComponent},

      {path: 'customerrefunds', component: CustomerrefundTableComponent},
      {path: 'customerrefunds/add', component: CustomerrefundFormComponent},
      {path: 'customerrefunds/:id', component: CustomerrefundDetailComponent},
      {path: 'customerrefunds/edit/:id', component: CustomerrefundUpdateFormComponent},

      {path: 'categorizations', component: CategorizationTableComponent},
      {path: 'categorizations/add', component: CategorizationFormComponent},
      {path: 'categorizations/:id', component: CategorizationDetailComponent},
      {path: 'categorizations/edit/:id', component: CategorizationUpdateFormComponent},

      {path: 'collections', component: CollectionTableComponent},
      {path: 'collections/add', component: CollectionFormComponent},
      {path: 'collections/:id', component: CollectionDetailComponent},
      {path: 'collections/edit/:id', component: CollectionUpdateFormComponent},

      {path: 'porders', component: PorderTableComponent},
      {path: 'porders/add', component: PorderFormComponent},
      {path: 'porders/:id', component: PorderDetailComponent},
      {path: 'porders/edit/:id', component: PorderUpdateFormComponent},

      {path: 'dryerings', component: DryeringTableComponent},
      {path: 'dryerings/add', component: DryeringFormComponent},
      {path: 'dryerings/:id', component: DryeringDetailComponent},
      {path: 'dryerings/edit/:id', component: DryeringUpdateFormComponent},

      {path: 'gradebatches', component: GradebatchTableComponent},
      {path: 'gradebatches/add', component: GradebatchFormComponent},
      {path: 'gradebatches/:id', component: GradebatchDetailComponent},
      {path: 'gradebatches/edit/:id', component: GradebatchUpdateFormComponent},

      {path: 'sales', component: SaleTableComponent},
      {path: 'sales/add', component: SaleFormComponent},
      {path: 'sales/:id', component: SaleDetailComponent},
      {path: 'sales/edit/:id', component: SaleUpdateFormComponent},

      {path: 'materials', component: MaterialTableComponent},
      {path: 'materials/add', component: MaterialFormComponent},
      {path: 'materials/:id', component: MaterialDetailComponent},
      {path: 'materials/edit/:id', component: MaterialUpdateFormComponent},

      {path: 'witherings', component: WitheringTableComponent},
      {path: 'witherings/add', component: WitheringFormComponent},
      {path: 'witherings/:id', component: WitheringDetailComponent},
      {path: 'witherings/edit/:id', component: WitheringUpdateFormComponent},

      {path: 'tastings', component: TastingTableComponent},
      {path: 'tastings/add', component: TastingFormComponent},
      {path: 'tastings/:id', component: TastingDetailComponent},
      {path: 'tastings/edit/:id', component: TastingUpdateFormComponent},

      {path: 'customers', component: CustomerTableComponent},
      {path: 'customers/add', component: CustomerFormComponent},
      {path: 'customers/:id', component: CustomerDetailComponent},
      {path: 'customers/edit/:id', component: CustomerUpdateFormComponent},

      {path: 'dashboard', component: DashboardComponent},
      {path: '', component: DashboardComponent},
    ]
  },
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
