import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Dryeringdryeringline} from '../../../../../entities/dryeringdryeringline';
import {Dryeringline} from '../../../../../entities/dryeringline';
import {DryeringlineService} from '../../../../../services/dryeringline.service';

@Component({
  selector: 'app-dryeringdryeringline-sub-form',
  templateUrl: './dryeringdryeringline-sub-form.component.html',
  styleUrls: ['./dryeringdryeringline-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DryeringdryeringlineSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DryeringdryeringlineSubFormComponent),
      multi: true,
    }
  ]
})
export class DryeringdryeringlineSubFormComponent extends AbstractSubFormComponent<Dryeringdryeringline> implements OnInit{

  dryeringlines: Dryeringline[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    dryeringline: new FormControl(),
    initweight: new FormControl(),
    finalweight: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get dryeringlineField(): FormControl{
    return this.form.controls.dryeringline as FormControl;
  }

  get initweightField(): FormControl{
    return this.form.controls.initweight as FormControl;
  }

  get finalweightField(): FormControl{
    return this.form.controls.finalweight as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.dryeringlineField)
      &&   this.isEmptyField(this.initweightField)
      &&   this.isEmptyField(this.finalweightField);
  }

  constructor(
    private dryeringlineService: DryeringlineService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.dryeringlineService.getAll().then((dryeringlines) => {
      this.dryeringlines = dryeringlines;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.dryeringlineField.setValidators([Validators.required]);
    this.initweightField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]{1,7}([.][0-9]{1,3})?)$'),
      Validators.max(9999999),
      Validators.min(0),
    ]);
    this.finalweightField.setValidators([
      Validators.pattern('^([0-9]{1,7}([.][0-9]{1,3})?)$'),
      Validators.max(9999999),
      Validators.min(0),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.dryeringlineField.clearValidators();
    this.initweightField.clearValidators();
    this.finalweightField.clearValidators();
  }

  fillForm(dataItem: Dryeringdryeringline): void {
    this.idField.patchValue(dataItem.id);
    this.dryeringlineField.patchValue(dataItem.dryeringline.id);
    this.initweightField.patchValue(dataItem.initweight);
    this.finalweightField.patchValue(dataItem.finalweight);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(dryeringdryeringline: Dryeringdryeringline): string {
    return 'Are you sure to remove \u201C ' + dryeringdryeringline.dryeringline.name + ' \u201D from dryering dryeringline?';
  }

  getUpdateConfirmMessage(dryeringdryeringline: Dryeringdryeringline): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + dryeringdryeringline.dryeringline.name + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + dryeringdryeringline.dryeringline.name + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Dryeringdryeringline = new Dryeringdryeringline();
    dataItem.id = this.idField.value;

    for (const dryeringline of this.dryeringlines){
      if (this.dryeringlineField.value === dryeringline.id) {
        dataItem.dryeringline = dryeringline;
        break;
      }
    }

    dataItem.initweight = this.initweightField.value;
    dataItem.finalweight = this.finalweightField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
