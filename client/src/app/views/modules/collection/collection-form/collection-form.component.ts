import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Collection} from '../../../../entities/collection';
import {CollectionService} from '../../../../services/collection.service';
import {Supplier} from '../../../../entities/supplier';
import {Material} from '../../../../entities/material';
import {DateHelper} from '../../../../shared/date-helper';
import {SupplierService} from '../../../../services/supplier.service';
import {MaterialService} from '../../../../services/material.service';
import {Collectionstatus} from '../../../../entities/collectionstatus';
import {CollectionstatusService} from '../../../../services/collectionstatus.service';

@Component({
  selector: 'app-collection-form',
  templateUrl: './collection-form.component.html',
  styleUrls: ['./collection-form.component.scss']
})
export class CollectionFormComponent extends AbstractComponent implements OnInit {

  suppliers: Supplier[] = [];
  materials: Material[] = [];
  collectionstatuses: Collectionstatus[] = [];

  form = new FormGroup({
    date: new FormControl(null, [
    ]),
    weight: new FormControl(null, [
      Validators.min(0),
      Validators.max(9999999),
      Validators.pattern('^([0-9]{1,7}([.][0-9]{1,3})?)$'),
    ]),
    unitprice: new FormControl(null, [
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    supplier: new FormControl(null, [
    ]),
    material: new FormControl(null, [
    ]),
    collectionstatus: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get weightField(): FormControl{
    return this.form.controls.weight as FormControl;
  }

  get unitpriceField(): FormControl{
    return this.form.controls.unitprice as FormControl;
  }

  get supplierField(): FormControl{
    return this.form.controls.supplier as FormControl;
  }

  get materialField(): FormControl{
    return this.form.controls.material as FormControl;
  }

  get collectionstatusField(): FormControl{
    return this.form.controls.collectionstatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private supplierService: SupplierService,
    private materialService: MaterialService,
    private collectionstatusService: CollectionstatusService,
    private collectionService: CollectionService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.supplierService.getAllBasic(new PageRequest()).then((supplierDataPage) => {
      this.suppliers = supplierDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.materialService.getAllBasic(new PageRequest()).then((materialDataPage) => {
      this.materials = materialDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.collectionstatusService.getAll().then((collectionstatuses) => {
      this.collectionstatuses = collectionstatuses;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_COLLECTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_COLLECTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_COLLECTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_COLLECTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_COLLECTION);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const collection: Collection = new Collection();
    collection.date = this.dateField.value ? DateHelper.getDateAsString(this.dateField.value) : null;
    collection.weight = this.weightField.value;
    collection.unitprice = this.unitpriceField.value;
    collection.supplier = this.supplierField.value;
    collection.material = this.materialField.value;
    collection.collectionstatus = this.collectionstatusField.value;
    collection.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.collectionService.add(collection);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/collections/' + resourceLink.id);
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
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.weight) { this.weightField.setErrors({server: msg.weight}); knownError = true; }
          if (msg.unitprice) { this.unitpriceField.setErrors({server: msg.unitprice}); knownError = true; }
          if (msg.supplier) { this.supplierField.setErrors({server: msg.supplier}); knownError = true; }
          if (msg.material) { this.materialField.setErrors({server: msg.material}); knownError = true; }
          if (msg.collectionstatus) { this.collectionstatusField.setErrors({server: msg.collectionstatus}); knownError = true; }
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
