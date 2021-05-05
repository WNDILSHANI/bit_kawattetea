import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
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
  selector: 'app-distribution-update-form',
  templateUrl: './distribution-update-form.component.html',
  styleUrls: ['./distribution-update-form.component.scss']
})
export class DistributionUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  distribution: Distribution;

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
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.distribution = await this.distributionService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DISTRIBUTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DISTRIBUTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DISTRIBUTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DISTRIBUTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DISTRIBUTION);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.saleField.pristine) {
      this.saleField.setValue(this.distribution.sale.id);
    }
    if (this.vehicleField.pristine) {
      this.vehicleField.setValue(this.distribution.vehicle.id);
    }
    if (this.distributionstatusField.pristine) {
      this.distributionstatusField.setValue(this.distribution.distributionstatus.id);
    }
    if (this.contactpersonnameField.pristine) {
      this.contactpersonnameField.setValue(this.distribution.contactpersonname);
    }
    if (this.contactpersonnicField.pristine) {
      this.contactpersonnicField.setValue(this.distribution.contactpersonnic);
    }
    if (this.contactpersontelField.pristine) {
      this.contactpersontelField.setValue(this.distribution.contactpersontel);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.distribution.date);
    }
    if (this.feeField.pristine) {
      this.feeField.setValue(this.distribution.fee);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.distribution.description);
    }
    if (this.employeesField.pristine) {
      this.employeesField.setValue(this.distribution.employeeList);
    }
}

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    if (this.form.invalid) { return; }

    const newdistribution: Distribution = new Distribution();
    newdistribution.sale = this.saleField.value;
    newdistribution.vehicle = this.vehicleField.value;
    newdistribution.distributionstatus = this.distributionstatusField.value;
    newdistribution.contactpersonname = this.contactpersonnameField.value;
    newdistribution.contactpersonnic = this.contactpersonnicField.value;
    newdistribution.contactpersontel = this.contactpersontelField.value;
    newdistribution.date = this.dateField.value ? DateHelper.getDateAsString(this.dateField.value) : null;
    newdistribution.fee = this.feeField.value;
    newdistribution.description = this.descriptionField.value;
    newdistribution.employeeList = this.employeesField.value;
    try{
      const resourceLink: ResourceLink = await this.distributionService.update(this.selectedId, newdistribution);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/distributions/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/distributions');
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
