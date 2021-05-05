import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
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
  selector: 'app-categorization-update-form',
  templateUrl: './categorization-update-form.component.html',
  styleUrls: ['./categorization-update-form.component.scss']
})
export class CategorizationUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  categorization: Categorization;

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
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.categorization = await this.categorizationService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CATEGORIZATION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CATEGORIZATIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CATEGORIZATION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CATEGORIZATION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CATEGORIZATION);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.tostartField.pristine) {
      this.tostartField.setValue(this.categorization.tostart);
    }
    if (this.toendField.pristine) {
      this.toendField.setValue(this.categorization.toend);
    }
    if (this.categorizationstatusField.pristine) {
      this.categorizationstatusField.setValue(this.categorization.categorizationstatus.id);
    }
    if (this.employeesField.pristine) {
      this.employeesField.setValue(this.categorization.employeeList);
    }
    if (this.collectionsField.pristine) {
      this.collectionsField.setValue(this.categorization.collectionList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.categorization.description);
    }
}

  async submit(): Promise<void> {
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    this.collectionsField.updateValueAndValidity();
    this.collectionsField.markAsTouched();
    if (this.form.invalid) { return; }

    const newcategorization: Categorization = new Categorization();
    newcategorization.tostart = this.tostartField.value;
    newcategorization.toend = this.toendField.value;
    newcategorization.categorizationstatus = this.categorizationstatusField.value;
    newcategorization.employeeList = this.employeesField.value;
    newcategorization.collectionList = this.collectionsField.value;
    newcategorization.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.categorizationService.update(this.selectedId, newcategorization);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/categorizations/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/categorizations');
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
