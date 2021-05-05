import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Gradebatch} from '../../../../entities/gradebatch';
import {GradebatchService} from '../../../../services/gradebatch.service';
import {Grade} from '../../../../entities/grade';
import {DateHelper} from '../../../../shared/date-helper';
import {GradeService} from '../../../../services/grade.service';
import {Categorizedmaterial} from '../../../../entities/categorizedmaterial';
import {CategorizedmaterialService} from '../../../../services/categorizedmaterial.service';

@Component({
  selector: 'app-gradebatch-update-form',
  templateUrl: './gradebatch-update-form.component.html',
  styleUrls: ['./gradebatch-update-form.component.scss']
})
export class GradebatchUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  gradebatch: Gradebatch;

  grades: Grade[] = [];
  categorizedmaterials: Categorizedmaterial[] = [];

  form = new FormGroup({
    grade: new FormControl(null, [
      Validators.required,
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    categorizedmaterial: new FormControl(null, [
    ]),
    weight: new FormControl(null, [
      Validators.min(0),
      Validators.max(9999999),
      Validators.pattern('^([0-9]{1,7}([.][0-9]{1,3})?)$'),
    ]),
    domanufactured: new FormControl(null, [
    ]),
    doexpire: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
  });

  get gradeField(): FormControl{
    return this.form.controls.grade as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get categorizedmaterialField(): FormControl{
    return this.form.controls.categorizedmaterial as FormControl;
  }

  get weightField(): FormControl{
    return this.form.controls.weight as FormControl;
  }

  get domanufacturedField(): FormControl{
    return this.form.controls.domanufactured as FormControl;
  }

  get doexpireField(): FormControl{
    return this.form.controls.doexpire as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private gradeService: GradeService,
    private categorizedmaterialService: CategorizedmaterialService,
    private gradebatchService: GradebatchService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.categorizedmaterialService.getAllBasic(new PageRequest()).then((categorizedmaterialDataPage) => {
      this.categorizedmaterials = categorizedmaterialDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.gradeService.getAll().then((grades) => {
      this.grades = grades;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.gradebatch = await this.gradebatchService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GRADEBATCH);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GRADEBATCHES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GRADEBATCH_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GRADEBATCH);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GRADEBATCH);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.gradeField.pristine) {
      this.gradeField.setValue(this.gradebatch.grade.id);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.gradebatch.name);
    }
    if (this.categorizedmaterialField.pristine) {
      this.categorizedmaterialField.setValue(this.gradebatch.categorizedmaterial.id);
    }
    if (this.weightField.pristine) {
      this.weightField.setValue(this.gradebatch.weight);
    }
    if (this.domanufacturedField.pristine) {
      this.domanufacturedField.setValue(this.gradebatch.domanufactured);
    }
    if (this.doexpireField.pristine) {
      this.doexpireField.setValue(this.gradebatch.doexpire);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.gradebatch.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newgradebatch: Gradebatch = new Gradebatch();
    newgradebatch.grade = this.gradeField.value;
    newgradebatch.name = this.nameField.value;
    newgradebatch.categorizedmaterial = this.categorizedmaterialField.value;
    newgradebatch.weight = this.weightField.value;
    newgradebatch.domanufactured = this.domanufacturedField.value ? DateHelper.getDateAsString(this.domanufacturedField.value) : null;
    newgradebatch.doexpire = this.doexpireField.value ? DateHelper.getDateAsString(this.doexpireField.value) : null;
    newgradebatch.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.gradebatchService.update(this.selectedId, newgradebatch);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/gradebatches/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/gradebatches');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.grade) { this.gradeField.setErrors({server: msg.grade}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.categorizedmaterial) { this.categorizedmaterialField.setErrors({server: msg.categorizedmaterial}); knownError = true; }
          if (msg.weight) { this.weightField.setErrors({server: msg.weight}); knownError = true; }
          if (msg.domanufactured) { this.domanufacturedField.setErrors({server: msg.domanufactured}); knownError = true; }
          if (msg.doexpire) { this.doexpireField.setErrors({server: msg.doexpire}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
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
