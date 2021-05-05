import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Porder} from '../../../../entities/porder';
import {PorderService} from '../../../../services/porder.service';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {Porderstatus} from '../../../../entities/porderstatus';
import {PorderstatusService} from '../../../../services/porderstatus.service';
import {PorderproductUpdateSubFormComponent} from './porderproduct-update-sub-form/porderproduct-update-sub-form.component';

@Component({
  selector: 'app-porder-update-form',
  templateUrl: './porder-update-form.component.html',
  styleUrls: ['./porder-update-form.component.scss']
})
export class PorderUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  porder: Porder;

  porderstatuses: Porderstatus[] = [];
  @ViewChild(PorderproductUpdateSubFormComponent) porderproductUpdateSubForm: PorderproductUpdateSubFormComponent;

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
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.porder = await this.porderService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PORDER);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.doorderedField.pristine) {
      this.doorderedField.setValue(this.porder.doordered);
    }
    if (this.dorequiredField.pristine) {
      this.dorequiredField.setValue(this.porder.dorequired);
    }
    if (this.dorecivedField.pristine) {
      this.dorecivedField.setValue(this.porder.dorecived);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.porder.description);
    }
    if (this.porderstatusField.pristine) {
      this.porderstatusField.setValue(this.porder.porderstatus.id);
    }
    if (this.porderproductsField.pristine) {
      this.porderproductsField.setValue(this.porder.porderproductList);
    }
}

  async submit(): Promise<void> {
    this.porderproductUpdateSubForm.resetForm();
    this.porderproductsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newporder: Porder = new Porder();
    newporder.doordered = DateHelper.getDateAsString(this.doorderedField.value);
    newporder.dorequired = DateHelper.getDateAsString(this.dorequiredField.value);
    newporder.dorecived = DateHelper.getDateAsString(this.dorecivedField.value);
    newporder.description = this.descriptionField.value;
    newporder.porderstatus = this.porderstatusField.value;
    newporder.porderproductList = this.porderproductsField.value;
    try{
      const resourceLink: ResourceLink = await this.porderService.update(this.selectedId, newporder);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/porders/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/porders');
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
