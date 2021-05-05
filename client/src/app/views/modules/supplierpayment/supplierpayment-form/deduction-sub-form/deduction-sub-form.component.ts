import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Deduction} from '../../../../../entities/deduction';

@Component({
  selector: 'app-deduction-sub-form',
  templateUrl: './deduction-sub-form.component.html',
  styleUrls: ['./deduction-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeductionSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DeductionSubFormComponent),
      multi: true,
    }
  ]
})
export class DeductionSubFormComponent extends AbstractSubFormComponent<Deduction> implements OnInit{


  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(),
    amount: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.nameField)
      &&   this.isEmptyField(this.amountField);
  }

  constructor(
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
  }

  setValidations(): void{
    this.hasValidations = true;
    this.nameField.setValidators([
      Validators.maxLength(255),
    ]);
    this.amountField.setValidators([
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
      Validators.max(99999999),
      Validators.min(1),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.nameField.clearValidators();
    this.amountField.clearValidators();
  }

  fillForm(dataItem: Deduction): void {
    this.idField.patchValue(dataItem.id);
    this.nameField.patchValue(dataItem.name);
    this.amountField.patchValue(dataItem.amount);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(deduction: Deduction): string {
    return 'Are you sure to remove \u201C ' + deduction.name + ' \u201D from deducation?';
  }

  getUpdateConfirmMessage(deduction: Deduction): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + deduction.name + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + deduction.name + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Deduction = new Deduction();
    dataItem.id = this.idField.value;
    dataItem.name = this.nameField.value;
    dataItem.amount = this.amountField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
