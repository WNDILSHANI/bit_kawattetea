import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Disposalgradebatch} from '../../../../../entities/disposalgradebatch';
import {Gradebatch} from '../../../../../entities/gradebatch';
import {GradebatchService} from '../../../../../services/gradebatch.service';

@Component({
  selector: 'app-disposalgradebatch-update-sub-form',
  templateUrl: './disposalgradebatch-update-sub-form.component.html',
  styleUrls: ['./disposalgradebatch-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DisposalgradebatchUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DisposalgradebatchUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class DisposalgradebatchUpdateSubFormComponent extends AbstractSubFormComponent<Disposalgradebatch> implements OnInit{

  gradebatches: Gradebatch[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    gradebatch: new FormControl(),
    weight: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get gradebatchField(): FormControl{
    return this.form.controls.gradebatch as FormControl;
  }

  get weightField(): FormControl{
    return this.form.controls.weight as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.gradebatchField)
      &&   this.isEmptyField(this.weightField);
  }

  constructor(
    private gradebatchService: GradebatchService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.gradebatchService.getAllBasic(new PageRequest()).then((gradebatchDataPage) => {
      this.gradebatches = gradebatchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.gradebatchField.setValidators([Validators.required]);
    this.weightField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
      Validators.max(100),
      Validators.min(1),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.gradebatchField.clearValidators();
    this.weightField.clearValidators();
  }

  fillForm(dataItem: Disposalgradebatch): void {
    this.idField.patchValue(dataItem.id);
    this.gradebatchField.patchValue(dataItem.gradebatch.id);
    this.weightField.patchValue(dataItem.weight);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(disposalgradebatch: Disposalgradebatch): string {
    return 'Are you sure to remove \u201C ' + disposalgradebatch.gradebatch.code + ' \u201D from disposal gradebatch?';
  }

  getUpdateConfirmMessage(disposalgradebatch: Disposalgradebatch): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + disposalgradebatch.gradebatch.code + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + disposalgradebatch.gradebatch.code + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Disposalgradebatch = new Disposalgradebatch();
    dataItem.id = this.idField.value;

    for (const gradebatch of this.gradebatches){
      if (this.gradebatchField.value === gradebatch.id) {
        dataItem.gradebatch = gradebatch;
        break;
      }
    }

    dataItem.weight = this.weightField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
