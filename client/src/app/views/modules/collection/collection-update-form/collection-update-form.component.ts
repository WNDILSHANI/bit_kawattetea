import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
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
  selector: 'app-collection-update-form',
  templateUrl: './collection-update-form.component.html',
  styleUrls: ['./collection-update-form.component.scss']
})
export class CollectionUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  collection: Collection;

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
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.collection = await this.collectionService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_COLLECTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_COLLECTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_COLLECTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_COLLECTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_COLLECTION);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.dateField.pristine) {
      this.dateField.setValue(this.collection.date);
    }
    if (this.weightField.pristine) {
      this.weightField.setValue(this.collection.weight);
    }
    if (this.unitpriceField.pristine) {
      this.unitpriceField.setValue(this.collection.unitprice);
    }
    if (this.supplierField.pristine) {
      this.supplierField.setValue(this.collection.supplier.id);
    }
    if (this.materialField.pristine) {
      this.materialField.setValue(this.collection.material.id);
    }
    if (this.collectionstatusField.pristine) {
      this.collectionstatusField.setValue(this.collection.collectionstatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.collection.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newcollection: Collection = new Collection();
    newcollection.date = this.dateField.value ? DateHelper.getDateAsString(this.dateField.value) : null;
    newcollection.weight = this.weightField.value;
    newcollection.unitprice = this.unitpriceField.value;
    newcollection.supplier = this.supplierField.value;
    newcollection.material = this.materialField.value;
    newcollection.collectionstatus = this.collectionstatusField.value;
    newcollection.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.collectionService.update(this.selectedId, newcollection);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/collections/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/collections');
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
