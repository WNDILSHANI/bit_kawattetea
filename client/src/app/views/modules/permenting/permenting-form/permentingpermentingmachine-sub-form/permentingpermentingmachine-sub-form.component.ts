import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Permentingpermentingmachine} from '../../../../../entities/permentingpermentingmachine';
import {Permentingmachine} from '../../../../../entities/permentingmachine';
import {PermentingmachineService} from '../../../../../services/permentingmachine.service';

@Component({
  selector: 'app-permentingpermentingmachine-sub-form',
  templateUrl: './permentingpermentingmachine-sub-form.component.html',
  styleUrls: ['./permentingpermentingmachine-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PermentingpermentingmachineSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PermentingpermentingmachineSubFormComponent),
      multi: true,
    }
  ]
})
export class PermentingpermentingmachineSubFormComponent extends AbstractSubFormComponent<Permentingpermentingmachine> implements OnInit{

  permentingmachines: Permentingmachine[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    permentingmachine: new FormControl(),
    initweight: new FormControl(),
    finalweight: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get permentingmachineField(): FormControl{
    return this.form.controls.permentingmachine as FormControl;
  }

  get initweightField(): FormControl{
    return this.form.controls.initweight as FormControl;
  }

  get finalweightField(): FormControl{
    return this.form.controls.finalweight as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.permentingmachineField)
      &&   this.isEmptyField(this.initweightField)
      &&   this.isEmptyField(this.finalweightField);
  }

  constructor(
    private permentingmachineService: PermentingmachineService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.permentingmachineService.getAll().then((permentingmachines) => {
      this.permentingmachines = permentingmachines;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.permentingmachineField.setValidators([Validators.required]);
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
    this.permentingmachineField.clearValidators();
    this.initweightField.clearValidators();
    this.finalweightField.clearValidators();
  }

  fillForm(dataItem: Permentingpermentingmachine): void {
    this.idField.patchValue(dataItem.id);
    this.permentingmachineField.patchValue(dataItem.permentingmachine.id);
    this.initweightField.patchValue(dataItem.initweight);
    this.finalweightField.patchValue(dataItem.finalweight);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(permentingpermentingmachine: Permentingpermentingmachine): string {
    return 'Are you sure to remove \u201C ' + permentingpermentingmachine.permentingmachine.name + ' \u201D from permenting maching?';
  }

  getUpdateConfirmMessage(permentingpermentingmachine: Permentingpermentingmachine): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + permentingpermentingmachine.permentingmachine.name + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + permentingpermentingmachine.permentingmachine.name + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Permentingpermentingmachine = new Permentingpermentingmachine();
    dataItem.id = this.idField.value;

    for (const permentingmachine of this.permentingmachines){
      if (this.permentingmachineField.value === permentingmachine.id) {
        dataItem.permentingmachine = permentingmachine;
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
