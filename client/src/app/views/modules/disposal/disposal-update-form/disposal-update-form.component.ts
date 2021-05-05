import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Disposal} from '../../../../entities/disposal';
import {DisposalService} from '../../../../services/disposal.service';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {DisposalgradebatchUpdateSubFormComponent} from './disposalgradebatch-update-sub-form/disposalgradebatch-update-sub-form.component';

@Component({
  selector: 'app-disposal-update-form',
  templateUrl: './disposal-update-form.component.html',
  styleUrls: ['./disposal-update-form.component.scss']
})
export class DisposalUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  disposal: Disposal;

  @ViewChild(DisposalgradebatchUpdateSubFormComponent) disposalgradebatchUpdateSubForm: DisposalgradebatchUpdateSubFormComponent;

  form = new FormGroup({
    reason: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    disposalgradebatches: new FormControl(),
  });

  get reasonField(): FormControl{
    return this.form.controls.reason as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get disposalgradebatchesField(): FormControl{
    return this.form.controls.disposalgradebatches as FormControl;
  }

  constructor(
    private disposalService: DisposalService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.disposal = await this.disposalService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DISPOSAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DISPOSALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DISPOSAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DISPOSAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DISPOSAL);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.reasonField.pristine) {
      this.reasonField.setValue(this.disposal.reason);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.disposal.date);
    }
    if (this.disposalgradebatchesField.pristine) {
      this.disposalgradebatchesField.setValue(this.disposal.disposalgradebatchList);
    }
}

  async submit(): Promise<void> {
    this.disposalgradebatchUpdateSubForm.resetForm();
    this.disposalgradebatchesField.markAsDirty();
    if (this.form.invalid) { return; }

    const newdisposal: Disposal = new Disposal();
    newdisposal.reason = this.reasonField.value;
    newdisposal.date = DateHelper.getDateAsString(this.dateField.value);
    newdisposal.disposalgradebatchList = this.disposalgradebatchesField.value;
    try{
      const resourceLink: ResourceLink = await this.disposalService.update(this.selectedId, newdisposal);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/disposals/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/disposals');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.reason) { this.reasonField.setErrors({server: msg.reason}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.disposalgradebatchList) { this.disposalgradebatchesField.setErrors({server: msg.disposalgradebatchList}); knownError = true; }
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
