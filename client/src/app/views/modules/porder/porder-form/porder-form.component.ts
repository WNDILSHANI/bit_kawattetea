import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Porder} from '../../../../entities/porder';
import {PorderService} from '../../../../services/porder.service';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {Porderstatus} from '../../../../entities/porderstatus';
import {PorderstatusService} from '../../../../services/porderstatus.service';
import {PorderproductSubFormComponent} from './porderproduct-sub-form/porderproduct-sub-form.component';

@Component({
  selector: 'app-porder-form',
  templateUrl: './porder-form.component.html',
  styleUrls: ['./porder-form.component.scss']
})
export class PorderFormComponent extends AbstractComponent implements OnInit {

  porderstatuses: Porderstatus[] = [];
  @ViewChild(PorderproductSubFormComponent) porderproductSubForm: PorderproductSubFormComponent;

  form = new FormGroup({
    doordered: new FormControl(null, [
      Validators.required,
    ]),
    dorequired: new FormControl(null, [
      Validators.required,
    ]),
    dorecived: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    porderstatus: new FormControl(null, [
      Validators.required,
    ]),
    porderproducts: new FormControl(),
  });

  get doorderedField(): FormControl{
    return this.form.controls.doordered as FormControl;
  }

  get dorequiredField(): FormControl{
    return this.form.controls.dorequired as FormControl;
  }

  get dorecivedField(): FormControl{
    return this.form.controls.dorecived as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get porderstatusField(): FormControl{
    return this.form.controls.porderstatus as FormControl;
  }

  get porderproductsField(): FormControl{
    return this.form.controls.porderproducts as FormControl;
  }

  constructor(
    private porderstatusService: PorderstatusService,
    private porderService: PorderService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.porderstatusService.getAll().then((porderstatuses) => {
      this.porderstatuses = porderstatuses;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PORDER);
  }

  async submit(): Promise<void> {
    this.porderproductSubForm.resetForm();
    this.porderproductsField.markAsDirty();
    if (this.form.invalid) { return; }

    const porder: Porder = new Porder();
    porder.doordered = DateHelper.getDateAsString(this.doorderedField.value);
    porder.dorequired = DateHelper.getDateAsString(this.dorequiredField.value);
    porder.dorecived = DateHelper.getDateAsString(this.dorecivedField.value);
    porder.description = this.descriptionField.value;
    porder.porderstatus = this.porderstatusField.value;
    porder.porderproductList = this.porderproductsField.value;
    try{
      const resourceLink: ResourceLink = await this.porderService.add(porder);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/porders/' + resourceLink.id);
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
          if (msg.doordered) { this.doorderedField.setErrors({server: msg.doordered}); knownError = true; }
          if (msg.dorequired) { this.dorequiredField.setErrors({server: msg.dorequired}); knownError = true; }
          if (msg.dorecived) { this.dorecivedField.setErrors({server: msg.dorecived}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.porderstatus) { this.porderstatusField.setErrors({server: msg.porderstatus}); knownError = true; }
          if (msg.porderproductList) { this.porderproductsField.setErrors({server: msg.porderproductList}); knownError = true; }
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
