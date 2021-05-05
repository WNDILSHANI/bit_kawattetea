import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Productdisposalinventory} from '../../../../../entities/productdisposalinventory';
import {Inventory} from '../../../../../entities/inventory';
import {InventoryService} from '../../../../../services/inventory.service';

@Component({
  selector: 'app-productdisposalinventory-update-sub-form',
  templateUrl: './productdisposalinventory-update-sub-form.component.html',
  styleUrls: ['./productdisposalinventory-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductdisposalinventoryUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ProductdisposalinventoryUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class ProductdisposalinventoryUpdateSubFormComponent extends AbstractSubFormComponent<Productdisposalinventory> implements OnInit{

  inventories: Inventory[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    inventory: new FormControl(),
    qty: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get inventoryField(): FormControl{
    return this.form.controls.inventory as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.inventoryField)
      &&   this.isEmptyField(this.qtyField);
  }

  constructor(
    private inventoryService: InventoryService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.inventoryService.getAllBasic(new PageRequest()).then((inventoryDataPage) => {
      this.inventories = inventoryDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.inventoryField.setValidators([Validators.required]);
    this.qtyField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
      Validators.max(100),
      Validators.min(1),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.inventoryField.clearValidators();
    this.qtyField.clearValidators();
  }

  fillForm(dataItem: Productdisposalinventory): void {
    this.idField.patchValue(dataItem.id);
    this.inventoryField.patchValue(dataItem.inventory.id);
    this.qtyField.patchValue(dataItem.qty);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(productdisposalinventory: Productdisposalinventory): string {
    return 'Are you sure to remove \u201C ' + productdisposalinventory.inventory.code + ' \u201D from product disposal inventory?';
  }

  getUpdateConfirmMessage(productdisposalinventory: Productdisposalinventory): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + productdisposalinventory.inventory.code + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + productdisposalinventory.inventory.code + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Productdisposalinventory = new Productdisposalinventory();
    dataItem.id = this.idField.value;

    for (const inventory of this.inventories){
      if (this.inventoryField.value === inventory.id) {
        dataItem.inventory = inventory;
        break;
      }
    }

    dataItem.qty = this.qtyField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
