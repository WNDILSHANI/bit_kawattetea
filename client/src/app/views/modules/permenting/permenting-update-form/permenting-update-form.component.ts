import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
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
import {PermentingpermentingmachineUpdateSubFormComponent} from './permentingpermentingmachine-update-sub-form/permentingpermentingmachine-update-sub-form.component';

@Component({
  selector: 'app-permenting-update-form',
  templateUrl: './permenting-update-form.component.html',
  styleUrls: ['./permenting-update-form.component.scss']
})
export class PermentingUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  permenting: Permenting;

  employees: Employee[] = [];
  permentingstatuses: Permentingstatus[] = [];
  categorizedmaterials: Categorizedmaterial[] = [];
  @ViewChild(PermentingpermentingmachineUpdateSubFormComponent) permentingpermentingmachineUpdateSubForm: PermentingpermentingmachineUpdateSubFormComponent;

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
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.permenting = await this.permentingService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PERMENTING);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PERMENTINGS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PERMENTING_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PERMENTING);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PERMENTING);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.tostartField.pristine) {
      this.tostartField.setValue(this.permenting.tostart);
    }
    if (this.toendField.pristine) {
      this.toendField.setValue(this.permenting.toend);
    }
    if (this.employeesField.pristine) {
      this.employeesField.setValue(this.permenting.employeeList);
    }
    if (this.initweightField.pristine) {
      this.initweightField.setValue(this.permenting.initweight);
    }
    if (this.finalweightField.pristine) {
      this.finalweightField.setValue(this.permenting.finalweight);
    }
    if (this.permentingstatusField.pristine) {
      this.permentingstatusField.setValue(this.permenting.permentingstatus.id);
    }
    if (this.categorizedmaterialField.pristine) {
      this.categorizedmaterialField.setValue(this.permenting.categorizedmaterial.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.permenting.description);
    }
    if (this.permentingpermentingmachinesField.pristine) {
      this.permentingpermentingmachinesField.setValue(this.permenting.permentingpermentingmachineList);
    }
}

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    this.permentingpermentingmachineUpdateSubForm.resetForm();
    this.permentingpermentingmachinesField.markAsDirty();
    if (this.form.invalid) { return; }

    const newpermenting: Permenting = new Permenting();
    newpermenting.tostart = this.tostartField.value;
    newpermenting.toend = this.toendField.value;
    newpermenting.employeeList = this.employeesField.value;
    newpermenting.initweight = this.initweightField.value;
    newpermenting.finalweight = this.finalweightField.value;
    newpermenting.permentingstatus = this.permentingstatusField.value;
    newpermenting.categorizedmaterial = this.categorizedmaterialField.value;
    newpermenting.description = this.descriptionField.value;
    newpermenting.permentingpermentingmachineList = this.permentingpermentingmachinesField.value;
    try{
      const resourceLink: ResourceLink = await this.permentingService.update(this.selectedId, newpermenting);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/permentings/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/permentings');
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
