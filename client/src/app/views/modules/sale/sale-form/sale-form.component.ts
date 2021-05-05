import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Sale} from '../../../../entities/sale';
import {SaleService} from '../../../../services/sale.service';
import {ViewChild} from '@angular/core';
import {Customer} from '../../../../entities/customer';
import {Salestatus} from '../../../../entities/salestatus';
import {CustomerService} from '../../../../services/customer.service';
import {SalestatusService} from '../../../../services/salestatus.service';
import {SaleinventorySubFormComponent} from './saleinventory-sub-form/saleinventory-sub-form.component';

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss']
})
export class SaleFormComponent extends AbstractComponent implements OnInit {

  customers: Customer[] = [];
  salestatuses: Salestatus[] = [];
  @ViewChild(SaleinventorySubFormComponent) saleinventorySubForm: SaleinventorySubFormComponent;

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
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SALE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SALES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SALE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SALE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SALE);
  }

  async submit(): Promise<void> {
    this.saleinventorySubForm.resetForm();
    this.saleinventoriesField.markAsDirty();
    if (this.form.invalid) { return; }

    const sale: Sale = new Sale();
    sale.total = this.totalField.value;
    sale.discount = this.discountField.value;
    sale.customer = this.customerField.value;
    sale.salestatus = this.salestatusField.value;
    sale.description = this.descriptionField.value;
    sale.saleinventoryList = this.saleinventoriesField.value;
    try{
      const resourceLink: ResourceLink = await this.saleService.add(sale);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/sales/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
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
