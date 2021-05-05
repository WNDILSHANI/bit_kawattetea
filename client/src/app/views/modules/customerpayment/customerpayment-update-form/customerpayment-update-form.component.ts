import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Customerpayment} from '../../../../entities/customerpayment';
import {CustomerpaymentService} from '../../../../services/customerpayment.service';
import {Sale} from '../../../../entities/sale';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {SaleService} from '../../../../services/sale.service';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';

@Component({
  selector: 'app-customerpayment-update-form',
  templateUrl: './customerpayment-update-form.component.html',
  styleUrls: ['./customerpayment-update-form.component.scss']
})
export class CustomerpaymentUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  customerpayment: Customerpayment;

  paymenttypes: Paymenttype[] = [];
  paymentstatuses: Paymentstatus[] = [];
  sales: Sale[] = [];

  form = new FormGroup({
    date: new FormControl(null, [
    ]),
    amount: new FormControl(null, [
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    chequeno: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    chequebank: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    chequebranch: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    chequedate: new FormControl(null, [
    ]),
    paymenttype: new FormControl(null, [
    ]),
    paymentstatus: new FormControl(null, [
    ]),
    sale: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
  });

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get chequenoField(): FormControl{
    return this.form.controls.chequeno as FormControl;
  }

  get chequebankField(): FormControl{
    return this.form.controls.chequebank as FormControl;
  }

  get chequebranchField(): FormControl{
    return this.form.controls.chequebranch as FormControl;
  }

  get chequedateField(): FormControl{
    return this.form.controls.chequedate as FormControl;
  }

  get paymenttypeField(): FormControl{
    return this.form.controls.paymenttype as FormControl;
  }

  get paymentstatusField(): FormControl{
    return this.form.controls.paymentstatus as FormControl;
  }

  get saleField(): FormControl{
    return this.form.controls.sale as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private paymenttypeService: PaymenttypeService,
    private paymentstatusService: PaymentstatusService,
    private saleService: SaleService,
    private customerpaymentService: CustomerpaymentService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.paymenttypeService.getAll().then((paymenttypes) => {
      this.paymenttypes = paymenttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.paymentstatusService.getAll().then((paymentstatuses) => {
      this.paymentstatuses = paymentstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.saleService.getAllBasic(new PageRequest()).then((saleDataPage) => {
      this.sales = saleDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.customerpayment = await this.customerpaymentService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERPAYMENT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.dateField.pristine) {
      this.dateField.setValue(this.customerpayment.date);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.customerpayment.amount);
    }
    if (this.chequenoField.pristine) {
      this.chequenoField.setValue(this.customerpayment.chequeno);
    }
    if (this.chequebankField.pristine) {
      this.chequebankField.setValue(this.customerpayment.chequebank);
    }
    if (this.chequebranchField.pristine) {
      this.chequebranchField.setValue(this.customerpayment.chequebranch);
    }
    if (this.chequedateField.pristine) {
      this.chequedateField.setValue(this.customerpayment.chequedate);
    }
    if (this.paymenttypeField.pristine) {
      this.paymenttypeField.setValue(this.customerpayment.paymenttype.id);
    }
    if (this.paymentstatusField.pristine) {
      this.paymentstatusField.setValue(this.customerpayment.paymentstatus.id);
    }
    if (this.saleField.pristine) {
      this.saleField.setValue(this.customerpayment.sale.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.customerpayment.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newcustomerpayment: Customerpayment = new Customerpayment();
    newcustomerpayment.date = this.dateField.value ? DateHelper.getDateAsString(this.dateField.value) : null;
    newcustomerpayment.amount = this.amountField.value;
    newcustomerpayment.chequeno = this.chequenoField.value;
    newcustomerpayment.chequebank = this.chequebankField.value;
    newcustomerpayment.chequebranch = this.chequebranchField.value;
    newcustomerpayment.chequedate = this.chequedateField.value ? DateHelper.getDateAsString(this.chequedateField.value) : null;
    newcustomerpayment.paymenttype = this.paymenttypeField.value;
    newcustomerpayment.paymentstatus = this.paymentstatusField.value;
    newcustomerpayment.sale = this.saleField.value;
    newcustomerpayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.customerpaymentService.update(this.selectedId, newcustomerpayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/customerpayments/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/customerpayments');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.chequeno) { this.chequenoField.setErrors({server: msg.chequeno}); knownError = true; }
          if (msg.chequebank) { this.chequebankField.setErrors({server: msg.chequebank}); knownError = true; }
          if (msg.chequebranch) { this.chequebranchField.setErrors({server: msg.chequebranch}); knownError = true; }
          if (msg.chequedate) { this.chequedateField.setErrors({server: msg.chequedate}); knownError = true; }
          if (msg.paymenttype) { this.paymenttypeField.setErrors({server: msg.paymenttype}); knownError = true; }
          if (msg.paymentstatus) { this.paymentstatusField.setErrors({server: msg.paymentstatus}); knownError = true; }
          if (msg.sale) { this.saleField.setErrors({server: msg.sale}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
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
