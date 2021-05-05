import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
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
import {PackingproductUpdateSubFormComponent} from './packingproduct-update-sub-form/packingproduct-update-sub-form.component';

@Component({
  selector: 'app-packing-update-form',
  templateUrl: './packing-update-form.component.html',
  styleUrls: ['./packing-update-form.component.scss']
})
export class PackingUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  packing: Packing;

  employees: Employee[] = [];
  packingstatuses: Packingstatus[] = [];
  porders: Porder[] = [];
  @ViewChild(PackingproductUpdateSubFormComponent) packingproductUpdateSubForm: PackingproductUpdateSubFormComponent;

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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

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
    this.packing = await this.packingService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PACKING);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PACKINGS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PACKING_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PACKING);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PACKING);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.tostartField.pristine) {
      this.tostartField.setValue(this.packing.tostart);
    }
    if (this.toendField.pristine) {
      this.toendField.setValue(this.packing.toend);
    }
    if (this.employeesField.pristine) {
      this.employeesField.setValue(this.packing.employeeList);
    }
    if (this.packingstatusField.pristine) {
      this.packingstatusField.setValue(this.packing.packingstatus.id);
    }
    if (this.porderField.pristine) {
      this.porderField.setValue(this.packing.porder.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.packing.description);
    }
    if (this.packingproductsField.pristine) {
      this.packingproductsField.setValue(this.packing.packingproductList);
    }
}

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    this.packingproductUpdateSubForm.resetForm();
    this.packingproductsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newpacking: Packing = new Packing();
    newpacking.tostart = this.tostartField.value;
    newpacking.toend = this.toendField.value;
    newpacking.employeeList = this.employeesField.value;
    newpacking.packingstatus = this.packingstatusField.value;
    newpacking.porder = this.porderField.value;
    newpacking.description = this.descriptionField.value;
    newpacking.packingproductList = this.packingproductsField.value;
    try{
      const resourceLink: ResourceLink = await this.packingService.update(this.selectedId, newpacking);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/packings/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/packings');
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
