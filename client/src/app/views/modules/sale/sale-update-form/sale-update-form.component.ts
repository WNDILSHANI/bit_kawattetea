import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Sale} from '../../../../entities/sale';
import {SaleService} from '../../../../services/sale.service';
import {ViewChild} from '@angular/core';
import {Customer} from '../../../../entities/customer';
import {Salestatus} from '../../../../entities/salestatus';
import {CustomerService} from '../../../../services/customer.service';
import {SalestatusService} from '../../../../services/salestatus.service';
import {SaleinventoryUpdateSubFormComponent} from './saleinventory-update-sub-form/saleinventory-update-sub-form.component';

@Component({
  selector: 'app-sale-update-form',
  templateUrl: './sale-update-form.component.html',
  styleUrls: ['./sale-update-form.component.scss']
})
export class SaleUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  sale: Sale;

  customers: Customer[] = [];
  salestatuses: Salestatus[] = [];
  @ViewChild(SaleinventoryUpdateSubFormComponent) saleinventoryUpdateSubForm: SaleinventoryUpdateSubFormComponent;

  form = new FormGroup({
    total: new FormControl(null, [
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    discount: new FormControl(null, [
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    customer: new FormControl(null, [
    ]),
    salestatus: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    saleinventories: new FormControl(),
  });

  get totalField(): FormControl{
    return this.form.controls.total as FormControl;
  }

  get discountField(): FormControl{
    return this.form.controls.discount as FormControl;
  }

  get customerField(): FormControl{
    return this.form.controls.customer as FormControl;
  }

  get salestatusField(): FormControl{
    return this.form.controls.salestatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get saleinventoriesField(): FormControl{
    return this.form.controls.saleinventories as FormControl;
  }

  constructor(
    private customerService: CustomerService,
    private salestatusService: SalestatusService,
    private saleService: SaleService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.customerService.getAllBasic(new PageRequest()).then((customerDataPage) => {
      this.customers = customerDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.salestatusService.getAll().then((salestatuses) => {
      this.salestatuses = salestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.sale = await this.saleService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SALE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SALES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SALE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SALE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SALE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.totalField.pristine) {
      this.totalField.setValue(this.sale.total);
    }
    if (this.discountField.pristine) {
      this.discountField.setValue(this.sale.discount);
    }
    if (this.customerField.pristine) {
      this.customerField.setValue(this.sale.customer.id);
    }
    if (this.salestatusField.pristine) {
      this.salestatusField.setValue(this.sale.salestatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.sale.description);
    }
    if (this.saleinventoriesField.pristine) {
      this.saleinventoriesField.setValue(this.sale.saleinventoryList);
    }
}

  async submit(): Promise<void> {
    this.saleinventoryUpdateSubForm.resetForm();
    this.saleinventoriesField.markAsDirty();
    if (this.form.invalid) { return; }

    const newsale: Sale = new Sale();
    newsale.total = this.totalField.value;
    newsale.discount = this.discountField.value;
    newsale.customer = this.customerField.value;
    newsale.salestatus = this.salestatusField.value;
    newsale.description = this.descriptionField.value;
    newsale.saleinventoryList = this.saleinventoriesField.value;
    try{
      const resourceLink: ResourceLink = await this.saleService.update(this.selectedId, newsale);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/sales/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/sales');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.total) { this.totalField.setErrors({server: msg.total}); knownError = true; }
          if (msg.discount) { this.discountField.setErrors({server: msg.discount}); knownError = true; }
          if (msg.customer) { this.customerField.setErrors({server: msg.customer}); knownError = true; }
          if (msg.salestatus) { this.salestatusField.setErrors({server: msg.salestatus}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.saleinventoryList) { this.saleinventoriesField.setErrors({server: msg.saleinventoryList}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }
}
