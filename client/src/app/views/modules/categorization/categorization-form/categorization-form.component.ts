import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Categorization} from '../../../../entities/categorization';
import {CategorizationService} from '../../../../services/categorization.service';
import {Employee} from '../../../../entities/employee';
import {Collection} from '../../../../entities/collection';
import {EmployeeService} from '../../../../services/employee.service';
import {CollectionService} from '../../../../services/collection.service';
import {Categorizationstatus} from '../../../../entities/categorizationstatus';
import {CategorizationstatusService} from '../../../../services/categorizationstatus.service';

@Component({
  selector: 'app-categorization-form',
  templateUrl: './categorization-form.component.html',
  styleUrls: ['./categorization-form.component.scss']
})
export class CategorizationFormComponent extends AbstractComponent implements OnInit {

  categorizationstatuses: Categorizationstatus[] = [];
  employees: Employee[] = [];
  collections: Collection[] = [];

  form = new FormGroup({
    tostart: new FormControl(null, [
    ]),
    toend: new FormControl(null, [
    ]),
    categorizationstatus: new FormControl(null, [
    ]),
    employees: new FormControl(),
    collections: new FormControl(),
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

  get categorizationstatusField(): FormControl{
    return this.form.controls.categorizationstatus as FormControl;
  }

  get employeesField(): FormControl{
    return this.form.controls.employees as FormControl;
  }

  get collectionsField(): FormControl{
    return this.form.controls.collections as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private categorizationstatusService: CategorizationstatusService,
    private employeeService: EmployeeService,
    private collectionService: CollectionService,
    private categorizationService: CategorizationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.categorizationstatusService.getAll().then((categorizationstatuses) => {
      this.categorizationstatuses = categorizationstatuses;
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
    this.collectionService.getAllBasic(new PageRequest()).then((collectionDataPage) => {
      this.collections = collectionDataPage.content;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CATEGORIZATION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CATEGORIZATIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CATEGORIZATION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CATEGORIZATION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CATEGORIZATION);
  }

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    this.collectionsField.updateValueAndValidity();
    this.collectionsField.markAsTouched();
    if (this.form.invalid) { return; }

    const categorization: Categorization = new Categorization();
    categorization.tostart = this.tostartField.value;
    categorization.toend = this.toendField.value;
    categorization.categorizationstatus = this.categorizationstatusField.value;
    categorization.employeeList = this.employeesField.value;
    categorization.collectionList = this.collectionsField.value;
    categorization.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.categorizationService.add(categorization);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/categorizations/' + resourceLink.id);
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
          if (msg.categorizationstatus) { this.categorizationstatusField.setErrors({server: msg.categorizationstatus}); knownError = true; }
          if (msg.employeeList) { this.employeesField.setErrors({server: msg.employeeList}); knownError = true; }
          if (msg.collectionList) { this.collectionsField.setErrors({server: msg.collectionList}); knownError = true; }
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
