import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Grindinggrindingmachine} from '../../../../../entities/grindinggrindingmachine';
import {Grindingmachine} from '../../../../../entities/grindingmachine';
import {GrindingmachineService} from '../../../../../services/grindingmachine.service';

@Component({
  selector: 'app-grindinggrindingmachine-sub-form',
  templateUrl: './grindinggrindingmachine-sub-form.component.html',
  styleUrls: ['./grindinggrindingmachine-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GrindinggrindingmachineSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GrindinggrindingmachineSubFormComponent),
      multi: true,
    }
  ]
})
export class GrindinggrindingmachineSubFormComponent extends AbstractSubFormComponent<Grindinggrindingmachine> implements OnInit{

  grindingmachines: Grindingmachine[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    grindingmachine: new FormControl(),
    initweight: new FormControl(),
    finalweight: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get grindingmachineField(): FormControl{
    return this.form.controls.grindingmachine as FormControl;
  }

  get initweightField(): FormControl{
    return this.form.controls.initweight as FormControl;
  }

  get finalweightField(): FormControl{
    return this.form.controls.finalweight as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.grindingmachineField)
      &&   this.isEmptyField(this.initweightField)
      &&   this.isEmptyField(this.finalweightField);
  }

  constructor(
    private grindingmachineService: GrindingmachineService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.grindingmachineService.getAll().then((grindingmachines) => {
      this.grindingmachines = grindingmachines;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.grindingmachineField.setValidators([Validators.required]);
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
    this.grindingmachineField.clearValidators();
    this.initweightField.clearValidators();
    this.finalweightField.clearValidators();
  }

  fillForm(dataItem: Grindinggrindingmachine): void {
    this.idField.patchValue(dataItem.id);
    this.grindingmachineField.patchValue(dataItem.grindingmachine.id);
    this.initweightField.patchValue(dataItem.initweight);
    this.finalweightField.patchValue(dataItem.finalweight);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(grindinggrindingmachine: Grindinggrindingmachine): string {
    return 'Are you sure to remove \u201C ' + grindinggrindingmachine.grindingmachine.name + ' \u201D from grinding machine?';
  }

  getUpdateConfirmMessage(grindinggrindingmachine: Grindinggrindingmachine): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + grindinggrindingmachine.grindingmachine.name + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + grindinggrindingmachine.grindingmachine.name + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Grindinggrindingmachine = new Grindinggrindingmachine();
    dataItem.id = this.idField.value;

    for (const grindingmachine of this.grindingmachines){
      if (this.grindingmachineField.value === grindingmachine.id) {
        dataItem.grindingmachine = grindingmachine;
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
