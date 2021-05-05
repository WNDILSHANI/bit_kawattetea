import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Dryering} from '../../../../entities/dryering';
import {DryeringService} from '../../../../services/dryering.service';
import {ViewChild} from '@angular/core';
import {Employee} from '../../../../entities/employee';
import {Dryeringstatus} from '../../../../entities/dryeringstatus';
import {EmployeeService} from '../../../../services/employee.service';
import {Categorizedmaterial} from '../../../../entities/categorizedmaterial';
import {DryeringstatusService} from '../../../../services/dryeringstatus.service';
import {CategorizedmaterialService} from '../../../../services/categorizedmaterial.service';
import {DryeringdryeringlineSubFormComponent} from './dryeringdryeringline-sub-form/dryeringdryeringline-sub-form.component';

@Component({
  selector: 'app-dryering-form',
  templateUrl: './dryering-form.component.html',
  styleUrls: ['./dryering-form.component.scss']
})
export class DryeringFormComponent extends AbstractComponent implements OnInit {

  employees: Employee[] = [];
  dryeringstatuses: Dryeringstatus[] = [];
  categorizedmaterials: Categorizedmaterial[] = [];
  @ViewChild(DryeringdryeringlineSubFormComponent) dryeringdryeringlineSubForm: DryeringdryeringlineSubFormComponent;

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
    dryeringstatus: new FormControl(null, [
    ]),
    categorizedmaterial: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    dryeringdryeringlines: new FormControl(),
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

  get dryeringstatusField(): FormControl{
    return this.form.controls.dryeringstatus as FormControl;
  }

  get categorizedmaterialField(): FormControl{
    return this.form.controls.categorizedmaterial as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get dryeringdryeringlinesField(): FormControl{
    return this.form.controls.dryeringdryeringlines as FormControl;
  }

  constructor(
    private employeeService: EmployeeService,
    private dryeringstatusService: DryeringstatusService,
    private categorizedmaterialService: CategorizedmaterialService,
    private dryeringService: DryeringService,
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
    this.dryeringstatusService.getAll().then((dryeringstatuses) => {
      this.dryeringstatuses = dryeringstatuses;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DRYERING);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DRYERINGS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DRYERING_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DRYERING);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DRYERING);
  }

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    this.dryeringdryeringlineSubForm.resetForm();
    this.dryeringdryeringlinesField.markAsDirty();
    if (this.form.invalid) { return; }

    const dryering: Dryering = new Dryering();
    dryering.tostart = this.tostartField.value;
    dryering.toend = this.toendField.value;
    dryering.employeeList = this.employeesField.value;
    dryering.initweight = this.initweightField.value;
    dryering.finalweight = this.finalweightField.value;
    dryering.dryeringstatus = this.dryeringstatusField.value;
    dryering.categorizedmaterial = this.categorizedmaterialField.value;
    dryering.description = this.descriptionField.value;
    dryering.dryeringdryeringlineList = this.dryeringdryeringlinesField.value;
    try{
      const resourceLink: ResourceLink = await this.dryeringService.add(dryering);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/dryerings/' + resourceLink.id);
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
          if (msg.dryeringstatus) { this.dryeringstatusField.setErrors({server: msg.dryeringstatus}); knownError = true; }
          if (msg.categorizedmaterial) { this.categorizedmaterialField.setErrors({server: msg.categorizedmaterial}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.dryeringdryeringlineList) { this.dryeringdryeringlinesField.setErrors({server: msg.dryeringdryeringlineList}); knownError = true; }
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
