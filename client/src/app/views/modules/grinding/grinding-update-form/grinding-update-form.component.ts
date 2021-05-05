import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
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
import {GrindinggrindingmachineUpdateSubFormComponent} from './grindinggrindingmachine-update-sub-form/grindinggrindingmachine-update-sub-form.component';

@Component({
  selector: 'app-grinding-update-form',
  templateUrl: './grinding-update-form.component.html',
  styleUrls: ['./grinding-update-form.component.scss']
})
export class GrindingUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  grinding: Grinding;

  employees: Employee[] = [];
  grindingstatuses: Grindingstatus[] = [];
  grindingnetsizes: Grindingnetsize[] = [];
  categorizedmaterials: Categorizedmaterial[] = [];
  @ViewChild(GrindinggrindingmachineUpdateSubFormComponent) grindinggrindingmachineUpdateSubForm: GrindinggrindingmachineUpdateSubFormComponent;

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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.grinding = await this.grindingService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GRINDING);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GRINDINGS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GRINDING_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GRINDING);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GRINDING);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.tostartField.pristine) {
      this.tostartField.setValue(this.grinding.tostart);
    }
    if (this.toendField.pristine) {
      this.toendField.setValue(this.grinding.toend);
    }
    if (this.employeesField.pristine) {
      this.employeesField.setValue(this.grinding.employeeList);
    }
    if (this.initweightField.pristine) {
      this.initweightField.setValue(this.grinding.initweight);
    }
    if (this.finalweightField.pristine) {
      this.finalweightField.setValue(this.grinding.finalweight);
    }
    if (this.grindingstatusField.pristine) {
      this.grindingstatusField.setValue(this.grinding.grindingstatus.id);
    }
    if (this.grindingnetsizeField.pristine) {
      this.grindingnetsizeField.setValue(this.grinding.grindingnetsize.id);
    }
    if (this.categorizedmaterialField.pristine) {
      this.categorizedmaterialField.setValue(this.grinding.categorizedmaterial.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.grinding.description);
    }
    if (this.grindinggrindingmachinesField.pristine) {
      this.grindinggrindingmachinesField.setValue(this.grinding.grindinggrindingmachineList);
    }
}

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    this.grindinggrindingmachineUpdateSubForm.resetForm();
    this.grindinggrindingmachinesField.markAsDirty();
    if (this.form.invalid) { return; }

    const newgrinding: Grinding = new Grinding();
    newgrinding.tostart = this.tostartField.value;
    newgrinding.toend = this.toendField.value;
    newgrinding.employeeList = this.employeesField.value;
    newgrinding.initweight = this.initweightField.value;
    newgrinding.finalweight = this.finalweightField.value;
    newgrinding.grindingstatus = this.grindingstatusField.value;
    newgrinding.grindingnetsize = this.grindingnetsizeField.value;
    newgrinding.categorizedmaterial = this.categorizedmaterialField.value;
    newgrinding.description = this.descriptionField.value;
    newgrinding.grindinggrindingmachineList = this.grindinggrindingmachinesField.value;
    try{
      const resourceLink: ResourceLink = await this.grindingService.update(this.selectedId, newgrinding);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/grindings/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/grindings');
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
