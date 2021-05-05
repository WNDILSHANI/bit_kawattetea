import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Grinding} from '../../../../entities/grinding';
import {GrindingService} from '../../../../services/grinding.service';
import {ViewChild} from '@angular/core';
import {Employee} from '../../../../entities/employee';
import {Grindingstatus} from '../../../../entities/grindingstatus';
import {Grindingnetsize} from '../../../../entities/grindingnetsize';
import {EmployeeService} from '../../../../services/employee.service';
import {Categorizedmaterial} from '../../../../entities/categorizedmaterial';
import {GrindingstatusService} from '../../../../services/grindingstatus.service';
import {GrindingnetsizeService} from '../../../../services/grindingnetsize.service';
import {CategorizedmaterialService} from '../../../../services/categorizedmaterial.service';
import {GrindinggrindingmachineSubFormComponent} from './grindinggrindingmachine-sub-form/grindinggrindingmachine-sub-form.component';

@Component({
  selector: 'app-grinding-form',
  templateUrl: './grinding-form.component.html',
  styleUrls: ['./grinding-form.component.scss']
})
export class GrindingFormComponent extends AbstractComponent implements OnInit {

  employees: Employee[] = [];
  grindingstatuses: Grindingstatus[] = [];
  grindingnetsizes: Grindingnetsize[] = [];
  categorizedmaterials: Categorizedmaterial[] = [];
  @ViewChild(GrindinggrindingmachineSubFormComponent) grindinggrindingmachineSubForm: GrindinggrindingmachineSubFormComponent;

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
    grindingstatus: new FormControl(null, [
    ]),
    grindingnetsize: new FormControl(null, [
    ]),
    categorizedmaterial: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    grindinggrindingmachines: new FormControl(),
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

  get grindingstatusField(): FormControl{
    return this.form.controls.grindingstatus as FormControl;
  }

  get grindingnetsizeField(): FormControl{
    return this.form.controls.grindingnetsize as FormControl;
  }

  get categorizedmaterialField(): FormControl{
    return this.form.controls.categorizedmaterial as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get grindinggrindingmachinesField(): FormControl{
    return this.form.controls.grindinggrindingmachines as FormControl;
  }

  constructor(
    private employeeService: EmployeeService,
    private grindingstatusService: GrindingstatusService,
    private grindingnetsizeService: GrindingnetsizeService,
    private categorizedmaterialService: CategorizedmaterialService,
    private grindingService: GrindingService,
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
    this.grindingstatusService.getAll().then((grindingstatuses) => {
      this.grindingstatuses = grindingstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.grindingnetsizeService.getAll().then((grindingnetsizes) => {
      this.grindingnetsizes = grindingnetsizes;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GRINDING);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GRINDINGS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GRINDING_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GRINDING);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GRINDING);
  }

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    this.grindinggrindingmachineSubForm.resetForm();
    this.grindinggrindingmachinesField.markAsDirty();
    if (this.form.invalid) { return; }

    const grinding: Grinding = new Grinding();
    grinding.tostart = this.tostartField.value;
    grinding.toend = this.toendField.value;
    grinding.employeeList = this.employeesField.value;
    grinding.initweight = this.initweightField.value;
    grinding.finalweight = this.finalweightField.value;
    grinding.grindingstatus = this.grindingstatusField.value;
    grinding.grindingnetsize = this.grindingnetsizeField.value;
    grinding.categorizedmaterial = this.categorizedmaterialField.value;
    grinding.description = this.descriptionField.value;
    grinding.grindinggrindingmachineList = this.grindinggrindingmachinesField.value;
    try{
      const resourceLink: ResourceLink = await this.grindingService.add(grinding);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/grindings/' + resourceLink.id);
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
          if (msg.grindingstatus) { this.grindingstatusField.setErrors({server: msg.grindingstatus}); knownError = true; }
          if (msg.grindingnetsize) { this.grindingnetsizeField.setErrors({server: msg.grindingnetsize}); knownError = true; }
          if (msg.categorizedmaterial) { this.categorizedmaterialField.setErrors({server: msg.categorizedmaterial}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.grindinggrindingmachineList) { this.grindinggrindingmachinesField.setErrors({server: msg.grindinggrindingmachineList}); knownError = true; }
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
