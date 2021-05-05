import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Packing} from '../../../../entities/packing';
import {PackingService} from '../../../../services/packing.service';
import {ViewChild} from '@angular/core';
import {Porder} from '../../../../entities/porder';
import {Employee} from '../../../../entities/employee';
import {Packingstatus} from '../../../../entities/packingstatus';
import {PorderService} from '../../../../services/porder.service';
import {EmployeeService} from '../../../../services/employee.service';
import {PackingstatusService} from '../../../../services/packingstatus.service';
import {PackingproductSubFormComponent} from './packingproduct-sub-form/packingproduct-sub-form.component';

@Component({
  selector: 'app-packing-form',
  templateUrl: './packing-form.component.html',
  styleUrls: ['./packing-form.component.scss']
})
export class PackingFormComponent extends AbstractComponent implements OnInit {

  employees: Employee[] = [];
  packingstatuses: Packingstatus[] = [];
  porders: Porder[] = [];
  @ViewChild(PackingproductSubFormComponent) packingproductSubForm: PackingproductSubFormComponent;

  form = new FormGroup({
    tostart: new FormControl(null, [
    ]),
    toend: new FormControl(null, [
    ]),
    employees: new FormControl(),
    packingstatus: new FormControl(null, [
    ]),
    porder: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    packingproducts: new FormControl(),
  });

  get tostartField(): FormControl{
    return this.form.controls.tostart as FormControl;
  }

  get toendField(): FormControl{
    return this.form.controls.toend as FormControl;
  }

  get employeesField(): FormControl{
    return this.form.controls.employees as FormControl;
  }

  get packingstatusField(): FormControl{
    return this.form.controls.packingstatus as FormControl;
  }

  get porderField(): FormControl{
    return this.form.controls.porder as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get packingproductsField(): FormControl{
    return this.form.controls.packingproducts as FormControl;
  }

  constructor(
    private employeeService: EmployeeService,
    private packingstatusService: PackingstatusService,
    private porderService: PorderService,
    private packingService: PackingService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
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

    this.packingstatusService.getAll().then((packingstatuses) => {
      this.packingstatuses = packingstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.porderService.getAllBasic(new PageRequest()).then((porderDataPage) => {
      this.porders = porderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PACKING);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PACKINGS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PACKING_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PACKING);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PACKING);
  }

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    this.packingproductSubForm.resetForm();
    this.packingproductsField.markAsDirty();
    if (this.form.invalid) { return; }

    const packing: Packing = new Packing();
    packing.tostart = this.tostartField.value;
    packing.toend = this.toendField.value;
    packing.employeeList = this.employeesField.value;
    packing.packingstatus = this.packingstatusField.value;
    packing.porder = this.porderField.value;
    packing.description = this.descriptionField.value;
    packing.packingproductList = this.packingproductsField.value;
    try{
      const resourceLink: ResourceLink = await this.packingService.add(packing);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/packings/' + resourceLink.id);
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
          if (msg.tostart) { this.tostartField.setErrors({server: msg.tostart}); knownError = true; }
          if (msg.toend) { this.toendField.setErrors({server: msg.toend}); knownError = true; }
          if (msg.employeeList) { this.employeesField.setErrors({server: msg.employeeList}); knownError = true; }
          if (msg.packingstatus) { this.packingstatusField.setErrors({server: msg.packingstatus}); knownError = true; }
          if (msg.porder) { this.porderField.setErrors({server: msg.porder}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.packingproductList) { this.packingproductsField.setErrors({server: msg.packingproductList}); knownError = true; }
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
