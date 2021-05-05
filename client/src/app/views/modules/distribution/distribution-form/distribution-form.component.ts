import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Distribution} from '../../../../entities/distribution';
import {DistributionService} from '../../../../services/distribution.service';
import {Sale} from '../../../../entities/sale';
import {Vehicle} from '../../../../entities/vehicle';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {SaleService} from '../../../../services/sale.service';
import {VehicleService} from '../../../../services/vehicle.service';
import {EmployeeService} from '../../../../services/employee.service';
import {Distributionstatus} from '../../../../entities/distributionstatus';
import {DistributionstatusService} from '../../../../services/distributionstatus.service';

@Component({
  selector: 'app-distribution-form',
  templateUrl: './distribution-form.component.html',
  styleUrls: ['./distribution-form.component.scss']
})
export class DistributionFormComponent extends AbstractComponent implements OnInit {

  sales: Sale[] = [];
  vehicles: Vehicle[] = [];
  distributionstatuses: Distributionstatus[] = [];
  employees: Employee[] = [];

  form = new FormGroup({
    sale: new FormControl(null, [
    ]),
    vehicle: new FormControl(null, [
    ]),
    distributionstatus: new FormControl(null, [
    ]),
    contactpersonname: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
    ]),
    contactpersonnic: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    contactpersontel: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    date: new FormControl(null, [
    ]),
    fee: new FormControl(null, [
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    employees: new FormControl(),
  });

  get saleField(): FormControl{
    return this.form.controls.sale as FormControl;
  }

  get vehicleField(): FormControl{
    return this.form.controls.vehicle as FormControl;
  }

  get distributionstatusField(): FormControl{
    return this.form.controls.distributionstatus as FormControl;
  }

  get contactpersonnameField(): FormControl{
    return this.form.controls.contactpersonname as FormControl;
  }

  get contactpersonnicField(): FormControl{
    return this.form.controls.contactpersonnic as FormControl;
  }

  get contactpersontelField(): FormControl{
    return this.form.controls.contactpersontel as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get feeField(): FormControl{
    return this.form.controls.fee as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get employeesField(): FormControl{
    return this.form.controls.employees as FormControl;
  }

  constructor(
    private saleService: SaleService,
    private vehicleService: VehicleService,
    private distributionstatusService: DistributionstatusService,
    private employeeService: EmployeeService,
    private distributionService: DistributionService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.saleService.getAllBasic(new PageRequest()).then((saleDataPage) => {
      this.sales = saleDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.vehicleService.getAllBasic(new PageRequest()).then((vehicleDataPage) => {
      this.vehicles = vehicleDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.distributionstatusService.getAll().then((distributionstatuses) => {
      this.distributionstatuses = distributionstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DISTRIBUTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DISTRIBUTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DISTRIBUTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DISTRIBUTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DISTRIBUTION);
  }

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    if (this.form.invalid) { return; }

    const distribution: Distribution = new Distribution();
    distribution.sale = this.saleField.value;
    distribution.vehicle = this.vehicleField.value;
    distribution.distributionstatus = this.distributionstatusField.value;
    distribution.contactpersonname = this.contactpersonnameField.value;
    distribution.contactpersonnic = this.contactpersonnicField.value;
    distribution.contactpersontel = this.contactpersontelField.value;
    distribution.date = this.dateField.value ? DateHelper.getDateAsString(this.dateField.value) : null;
    distribution.fee = this.feeField.value;
    distribution.description = this.descriptionField.value;
    distribution.employeeList = this.employeesField.value;
    try{
      const resourceLink: ResourceLink = await this.distributionService.add(distribution);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/distributions/' + resourceLink.id);
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
          if (msg.sale) { this.saleField.setErrors({server: msg.sale}); knownError = true; }
          if (msg.vehicle) { this.vehicleField.setErrors({server: msg.vehicle}); knownError = true; }
          if (msg.distributionstatus) { this.distributionstatusField.setErrors({server: msg.distributionstatus}); knownError = true; }
          if (msg.contactpersonname) { this.contactpersonnameField.setErrors({server: msg.contactpersonname}); knownError = true; }
          if (msg.contactpersonnic) { this.contactpersonnicField.setErrors({server: msg.contactpersonnic}); knownError = true; }
          if (msg.contactpersontel) { this.contactpersontelField.setErrors({server: msg.contactpersontel}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.fee) { this.feeField.setErrors({server: msg.fee}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.employeeList) { this.employeesField.setErrors({server: msg.employeeList}); knownError = true; }
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
