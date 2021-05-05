import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Tasting} from '../../../../entities/tasting';
import {TastingService} from '../../../../services/tasting.service';
import {Employee} from '../../../../entities/employee';
import {Tastingstatus} from '../../../../entities/tastingstatus';
import {EmployeeService} from '../../../../services/employee.service';
import {Categorizedmaterial} from '../../../../entities/categorizedmaterial';
import {TastingstatusService} from '../../../../services/tastingstatus.service';
import {CategorizedmaterialService} from '../../../../services/categorizedmaterial.service';

@Component({
  selector: 'app-tasting-form',
  templateUrl: './tasting-form.component.html',
  styleUrls: ['./tasting-form.component.scss']
})
export class TastingFormComponent extends AbstractComponent implements OnInit {

  employees: Employee[] = [];
  tastingstatuses: Tastingstatus[] = [];
  categorizedmaterials: Categorizedmaterial[] = [];

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
    tastingstatus: new FormControl(null, [
    ]),
    categorizedmaterial: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
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

  get tastingstatusField(): FormControl{
    return this.form.controls.tastingstatus as FormControl;
  }

  get categorizedmaterialField(): FormControl{
    return this.form.controls.categorizedmaterial as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private employeeService: EmployeeService,
    private tastingstatusService: TastingstatusService,
    private categorizedmaterialService: CategorizedmaterialService,
    private tastingService: TastingService,
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
    this.tastingstatusService.getAll().then((tastingstatuses) => {
      this.tastingstatuses = tastingstatuses;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_TASTING);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_TASTINGS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_TASTING_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_TASTING);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_TASTING);
  }

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    if (this.form.invalid) { return; }

    const tasting: Tasting = new Tasting();
    tasting.tostart = this.tostartField.value;
    tasting.toend = this.toendField.value;
    tasting.employeeList = this.employeesField.value;
    tasting.initweight = this.initweightField.value;
    tasting.finalweight = this.finalweightField.value;
    tasting.tastingstatus = this.tastingstatusField.value;
    tasting.categorizedmaterial = this.categorizedmaterialField.value;
    tasting.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.tastingService.add(tasting);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/tastings/' + resourceLink.id);
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
          if (msg.tastingstatus) { this.tastingstatusField.setErrors({server: msg.tastingstatus}); knownError = true; }
          if (msg.categorizedmaterial) { this.categorizedmaterialField.setErrors({server: msg.categorizedmaterial}); knownError = true; }
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
