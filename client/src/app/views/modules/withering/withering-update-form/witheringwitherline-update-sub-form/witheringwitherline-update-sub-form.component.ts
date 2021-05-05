import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Witheringwitherline} from '../../../../../entities/witheringwitherline';
import {Witherline} from '../../../../../entities/witherline';
import {WitherlineService} from '../../../../../services/witherline.service';

@Component({
  selector: 'app-witheringwitherline-update-sub-form',
  templateUrl: './witheringwitherline-update-sub-form.component.html',
  styleUrls: ['./witheringwitherline-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WitheringwitherlineUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => WitheringwitherlineUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class WitheringwitherlineUpdateSubFormComponent extends AbstractSubFormComponent<Witheringwitherline> implements OnInit{

  witherlines: Witherline[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    witherline: new FormControl(),
    initweight: new FormControl(),
    finalweight: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get witherlineField(): FormControl{
    return this.form.controls.witherline as FormControl;
  }

  get initweightField(): FormControl{
    return this.form.controls.initweight as FormControl;
  }

  get finalweightField(): FormControl{
    return this.form.controls.finalweight as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.witherlineField)
      &&   this.isEmptyField(this.initweightField)
      &&   this.isEmptyField(this.finalweightField);
  }

  constructor(
    private witherlineService: WitherlineService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.witherlineService.getAll().then((witherlines) => {
      this.witherlines = witherlines;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.witherlineField.setValidators([Validators.required]);
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
    this.witherlineField.clearValidators();
    this.initweightField.clearValidators();
    this.finalweightField.clearValidators();
  }

  fillForm(dataItem: Witheringwitherline): void {
    this.idField.patchValue(dataItem.id);
    this.witherlineField.patchValue(dataItem.witherline.id);
    this.initweightField.patchValue(dataItem.initweight);
    this.finalweightField.patchValue(dataItem.finalweight);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(witheringwitherline: Witheringwitherline): string {
    return 'Are you sure to remove \u201C ' + witheringwitherline.witherline.name + ' \u201D from withering lines?';
  }

  getUpdateConfirmMessage(witheringwitherline: Witheringwitherline): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + witheringwitherline.witherline.name + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + witheringwitherline.witherline.name + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Witheringwitherline = new Witheringwitherline();
    dataItem.id = this.idField.value;

    for (const witherline of this.witherlines){
      if (this.witherlineField.value === witherline.id) {
        dataItem.witherline = witherline;
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
