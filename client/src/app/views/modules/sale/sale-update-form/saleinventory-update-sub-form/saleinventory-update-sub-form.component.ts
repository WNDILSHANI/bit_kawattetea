import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Saleinventory} from '../../../../../entities/saleinventory';
import {Inventory} from '../../../../../entities/inventory';
import {InventoryService} from '../../../../../services/inventory.service';

@Component({
  selector: 'app-saleinventory-update-sub-form',
  templateUrl: './saleinventory-update-sub-form.component.html',
  styleUrls: ['./saleinventory-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SaleinventoryUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SaleinventoryUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class SaleinventoryUpdateSubFormComponent extends AbstractSubFormComponent<Saleinventory> implements OnInit{

  inventories: Inventory[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    inventory: new FormControl(),
    unitprice: new FormControl(),
    qty: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get inventoryField(): FormControl{
    return this.form.controls.inventory as FormControl;
  }

  get unitpriceField(): FormControl{
    return this.form.controls.unitprice as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.inventoryField)
      &&   this.isEmptyField(this.unitpriceField)
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
    this.unitpriceField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
      Validators.max(100),
      Validators.min(1),
    ]);
    this.qtyField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]*)$'),
      Validators.max(2147483647),
      Validators.min(-2147483648),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.inventoryField.clearValidators();
    this.unitpriceField.clearValidators();
    this.qtyField.clearValidators();
  }

  fillForm(dataItem: Saleinventory): void {
    this.idField.patchValue(dataItem.id);
    this.inventoryField.patchValue(dataItem.inventory.id);
    this.unitpriceField.patchValue(dataItem.unitprice);
    this.qtyField.patchValue(dataItem.qty);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(saleinventory: Saleinventory): string {
    return 'Are you sure to remove \u201C ' + saleinventory.inventory.code + ' \u201D from sale inventory?';
  }

  getUpdateConfirmMessage(saleinventory: Saleinventory): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + saleinventory.inventory.code + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + saleinventory.inventory.code + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Saleinventory = new Saleinventory();
    dataItem.id = this.idField.value;

    for (const inventory of this.inventories){
      if (this.inventoryField.value === inventory.id) {
        dataItem.inventory = inventory;
        break;
      }
    }

    dataItem.unitprice = this.unitpriceField.value;
    dataItem.qty = this.qtyField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
