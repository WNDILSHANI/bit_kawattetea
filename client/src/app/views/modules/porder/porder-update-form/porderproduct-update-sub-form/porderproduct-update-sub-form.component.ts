import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Porderproduct} from '../../../../../entities/porderproduct';
import {Product} from '../../../../../entities/product';
import {ProductService} from '../../../../../services/product.service';

@Component({
  selector: 'app-porderproduct-update-sub-form',
  templateUrl: './porderproduct-update-sub-form.component.html',
  styleUrls: ['./porderproduct-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PorderproductUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PorderproductUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class PorderproductUpdateSubFormComponent extends AbstractSubFormComponent<Porderproduct> implements OnInit{

  products: Product[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    product: new FormControl(),
    qty: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get productField(): FormControl{
    return this.form.controls.product as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.productField)
      &&   this.isEmptyField(this.qtyField);
  }

  constructor(
    private productService: ProductService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.productService.getAllBasic(new PageRequest()).then((productDataPage) => {
      this.products = productDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.productField.setValidators([Validators.required]);
    this.qtyField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
      Validators.max(100),
      Validators.min(1),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.productField.clearValidators();
    this.qtyField.clearValidators();
  }

  fillForm(dataItem: Porderproduct): void {
    this.idField.patchValue(dataItem.id);
    this.productField.patchValue(dataItem.product.id);
    this.qtyField.patchValue(dataItem.qty);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(porderproduct: Porderproduct): string {
    return 'Are you sure to remove \u201C ' + porderproduct.product.name + ' \u201D from order product?';
  }

  getUpdateConfirmMessage(porderproduct: Porderproduct): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + porderproduct.product.name + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + porderproduct.product.name + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Porderproduct = new Porderproduct();
    dataItem.id = this.idField.value;

    for (const product of this.products){
      if (this.productField.value === product.id) {
        dataItem.product = product;
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
