import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Material} from '../../../../entities/material';
import {MaterialService} from '../../../../services/material.service';
import {Tealeaftype} from '../../../../entities/tealeaftype';
import {Teatreetype} from '../../../../entities/teatreetype';
import {Materialstatus} from '../../../../entities/materialstatus';
import {TealeaftypeService} from '../../../../services/tealeaftype.service';
import {TeatreetypeService} from '../../../../services/teatreetype.service';
import {MaterialstatusService} from '../../../../services/materialstatus.service';

@Component({
  selector: 'app-material-form',
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.scss']
})
export class MaterialFormComponent extends AbstractComponent implements OnInit {

  tealeaftypes: Tealeaftype[] = [];
  teatreetypes: Teatreetype[] = [];
  materialstatuses: Materialstatus[] = [];

  form = new FormGroup({
    tealeaftype: new FormControl(null, [
    ]),
    teatreetype: new FormControl(null, [
    ]),
    unitprice: new FormControl(null, [
      Validators.min(1),
      Validators.max(1000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    materialstatus: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get tealeaftypeField(): FormControl{
    return this.form.controls.tealeaftype as FormControl;
  }

  get teatreetypeField(): FormControl{
    return this.form.controls.teatreetype as FormControl;
  }

  get unitpriceField(): FormControl{
    return this.form.controls.unitprice as FormControl;
  }

  get materialstatusField(): FormControl{
    return this.form.controls.materialstatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private tealeaftypeService: TealeaftypeService,
    private teatreetypeService: TeatreetypeService,
    private materialstatusService: MaterialstatusService,
    private materialService: MaterialService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.tealeaftypeService.getAll().then((tealeaftypes) => {
      this.tealeaftypes = tealeaftypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.teatreetypeService.getAll().then((teatreetypes) => {
      this.teatreetypes = teatreetypes;
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

    this.materialstatusService.getAll().then((materialstatuses) => {
      this.materialstatuses = materialstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIAL);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const material: Material = new Material();
    material.tealeaftype = this.tealeaftypeField.value;
    material.teatreetype = this.teatreetypeField.value;
    material.unitprice = this.unitpriceField.value;
    material.materialstatus = this.materialstatusField.value;
    material.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.materialService.add(material);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/materials/' + resourceLink.id);
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
          if (msg.tealeaftype) { this.tealeaftypeField.setErrors({server: msg.tealeaftype}); knownError = true; }
          if (msg.teatreetype) { this.teatreetypeField.setErrors({server: msg.teatreetype}); knownError = true; }
          if (msg.unitprice) { this.unitpriceField.setErrors({server: msg.unitprice}); knownError = true; }
          if (msg.materialstatus) { this.materialstatusField.setErrors({server: msg.materialstatus}); knownError = true; }
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
