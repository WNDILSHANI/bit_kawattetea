import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Withering} from '../../../../entities/withering';
import {WitheringService} from '../../../../services/withering.service';
import {ViewChild} from '@angular/core';
import {Employee} from '../../../../entities/employee';
import {Witheringstatus} from '../../../../entities/witheringstatus';
import {EmployeeService} from '../../../../services/employee.service';
import {Categorizedmaterial} from '../../../../entities/categorizedmaterial';
import {WitheringstatusService} from '../../../../services/witheringstatus.service';
import {CategorizedmaterialService} from '../../../../services/categorizedmaterial.service';
import {WitheringwitherlineUpdateSubFormComponent} from './witheringwitherline-update-sub-form/witheringwitherline-update-sub-form.component';

@Component({
  selector: 'app-withering-update-form',
  templateUrl: './withering-update-form.component.html',
  styleUrls: ['./withering-update-form.component.scss']
})
export class WitheringUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  withering: Withering;

  employees: Employee[] = [];
  witheringstatuses: Witheringstatus[] = [];
  categorizedmaterials: Categorizedmaterial[] = [];
  @ViewChild(WitheringwitherlineUpdateSubFormComponent) witheringwitherlineUpdateSubForm: WitheringwitherlineUpdateSubFormComponent;

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
    witheringstatus: new FormControl(null, [
    ]),
    categorizedmaterial: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    witheringwitherlines: new FormControl(),
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

  get witheringstatusField(): FormControl{
    return this.form.controls.witheringstatus as FormControl;
  }

  get categorizedmaterialField(): FormControl{
    return this.form.controls.categorizedmaterial as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get witheringwitherlinesField(): FormControl{
    return this.form.controls.witheringwitherlines as FormControl;
  }

  constructor(
    private employeeService: EmployeeService,
    private witheringstatusService: WitheringstatusService,
    private categorizedmaterialService: CategorizedmaterialService,
    private witheringService: WitheringService,
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
    this.witheringstatusService.getAll().then((witheringstatuses) => {
      this.witheringstatuses = witheringstatuses;
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

    this.withering = await this.witheringService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_WITHERING);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_WITHERINGS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_WITHERING_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_WITHERING);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_WITHERING);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.tostartField.pristine) {
      this.tostartField.setValue(this.withering.tostart);
    }
    if (this.toendField.pristine) {
      this.toendField.setValue(this.withering.toend);
    }
    if (this.employeesField.pristine) {
      this.employeesField.setValue(this.withering.employeeList);
    }
    if (this.initweightField.pristine) {
      this.initweightField.setValue(this.withering.initweight);
    }
    if (this.finalweightField.pristine) {
      this.finalweightField.setValue(this.withering.finalweight);
    }
    if (this.witheringstatusField.pristine) {
      this.witheringstatusField.setValue(this.withering.witheringstatus.id);
    }
    if (this.categorizedmaterialField.pristine) {
      this.categorizedmaterialField.setValue(this.withering.categorizedmaterial.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.withering.description);
    }
    if (this.witheringwitherlinesField.pristine) {
      this.witheringwitherlinesField.setValue(this.withering.witheringwitherlineList);
    }
}

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    this.witheringwitherlineUpdateSubForm.resetForm();
    this.witheringwitherlinesField.markAsDirty();
    if (this.form.invalid) { return; }

    const newwithering: Withering = new Withering();
    newwithering.tostart = this.tostartField.value;
    newwithering.toend = this.toendField.value;
    newwithering.employeeList = this.employeesField.value;
    newwithering.initweight = this.initweightField.value;
    newwithering.finalweight = this.finalweightField.value;
    newwithering.witheringstatus = this.witheringstatusField.value;
    newwithering.categorizedmaterial = this.categorizedmaterialField.value;
    newwithering.description = this.descriptionField.value;
    newwithering.witheringwitherlineList = this.witheringwitherlinesField.value;
    try{
      const resourceLink: ResourceLink = await this.witheringService.update(this.selectedId, newwithering);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/witherings/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/witherings');
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
          if (msg.witheringstatus) { this.witheringstatusField.setErrors({server: msg.witheringstatus}); knownError = true; }
          if (msg.categorizedmaterial) { this.categorizedmaterialField.setErrors({server: msg.categorizedmaterial}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.witheringwitherlineList) { this.witheringwitherlinesField.setErrors({server: msg.witheringwitherlineList}); knownError = true; }
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
