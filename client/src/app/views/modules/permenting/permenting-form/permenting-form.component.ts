import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Permenting} from '../../../../entities/permenting';
import {PermentingService} from '../../../../services/permenting.service';
import {ViewChild} from '@angular/core';
import {Employee} from '../../../../entities/employee';
import {EmployeeService} from '../../../../services/employee.service';
import {Permentingstatus} from '../../../../entities/permentingstatus';
import {Categorizedmaterial} from '../../../../entities/categorizedmaterial';
import {PermentingstatusService} from '../../../../services/permentingstatus.service';
import {CategorizedmaterialService} from '../../../../services/categorizedmaterial.service';
import {PermentingpermentingmachineSubFormComponent} from './permentingpermentingmachine-sub-form/permentingpermentingmachine-sub-form.component';

@Component({
  selector: 'app-permenting-form',
  templateUrl: './permenting-form.component.html',
  styleUrls: ['./permenting-form.component.scss']
})
export class PermentingFormComponent extends AbstractComponent implements OnInit {

  employees: Employee[] = [];
  permentingstatuses: Permentingstatus[] = [];
  categorizedmaterials: Categorizedmaterial[] = [];
  @ViewChild(PermentingpermentingmachineSubFormComponent) permentingpermentingmachineSubForm: PermentingpermentingmachineSubFormComponent;

  form = new FormGroup({
    tostart: new FormControl(null, [
    ]),
    toend: new FormControl(null, [
    ]),
    employees: new FormControl(),
    initweight: new FormControl(null, [
      Validators.min(0),
      Validators.max(9999999),
      Validators.pattern('^([0-9]{1,7}([.][0-9]{1,3})?)$'),
    ]),
    finalweight: new FormControl(null, [
      Validators.min(0),
      Validators.max(9999999),
      Validators.pattern('^([0-9]{1,7}([.][0-9]{1,3})?)$'),
    ]),
    permentingstatus: new FormControl(null, [
    ]),
    categorizedmaterial: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    permentingpermentingmachines: new FormControl(),
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

  get initweightField(): FormControl{
    return this.form.controls.initweight as FormControl;
  }

  get finalweightField(): FormControl{
    return this.form.controls.finalweight as FormControl;
  }

  get permentingstatusField(): FormControl{
    return this.form.controls.permentingstatus as FormControl;
  }

  get categorizedmaterialField(): FormControl{
    return this.form.controls.categorizedmaterial as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get permentingpermentingmachinesField(): FormControl{
    return this.form.controls.permentingpermentingmachines as FormControl;
  }

  constructor(
    private employeeService: EmployeeService,
    private permentingstatusService: PermentingstatusService,
    private categorizedmaterialService: CategorizedmaterialService,
    private permentingService: PermentingService,
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
    this.permentingstatusService.getAll().then((permentingstatuses) => {
      this.permentingstatuses = permentingstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.categorizedmaterialService.getAllBasic(new PageRequest()).then((categorizedmaterialDataPage) => {
      this.categorizedmaterials = categorizedmaterialDataPage.content;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PERMENTING);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PERMENTINGS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PERMENTING_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PERMENTING);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PERMENTING);
  }

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    this.permentingpermentingmachineSubForm.resetForm();
    this.permentingpermentingmachinesField.markAsDirty();
    if (this.form.invalid) { return; }

    const permenting: Permenting = new Permenting();
    permenting.tostart = this.tostartField.value;
    permenting.toend = this.toendField.value;
    permenting.employeeList = this.employeesField.value;
    permenting.initweight = this.initweightField.value;
    permenting.finalweight = this.finalweightField.value;
    permenting.permentingstatus = this.permentingstatusField.value;
    permenting.categorizedmaterial = this.categorizedmaterialField.value;
    permenting.description = this.descriptionField.value;
    permenting.permentingpermentingmachineList = this.permentingpermentingmachinesField.value;
    try{
      const resourceLink: ResourceLink = await this.permentingService.add(permenting);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/permentings/' + resourceLink.id);
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
          if (msg.initweight) { this.initweightField.setErrors({server: msg.initweight}); knownError = true; }
          if (msg.finalweight) { this.finalweightField.setErrors({server: msg.finalweight}); knownError = true; }
          if (msg.permentingstatus) { this.permentingstatusField.setErrors({server: msg.permentingstatus}); knownError = true; }
          if (msg.categorizedmaterial) { this.categorizedmaterialField.setErrors({server: msg.categorizedmaterial}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.permentingpermentingmachineList) { this.permentingpermentingmachinesField.setErrors({server: msg.permentingpermentingmachineList}); knownError = true; }
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
