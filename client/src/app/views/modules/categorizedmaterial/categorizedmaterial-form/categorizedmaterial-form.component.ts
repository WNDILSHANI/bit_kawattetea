import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Categorizedmaterial} from '../../../../entities/categorizedmaterial';
import {CategorizedmaterialService} from '../../../../services/categorizedmaterial.service';
import {Material} from '../../../../entities/material';
import {Categorization} from '../../../../entities/categorization';
import {MaterialService} from '../../../../services/material.service';
import {Catmaterialstatus} from '../../../../entities/catmaterialstatus';
import {CategorizationService} from '../../../../services/categorization.service';
import {CatmaterialstatusService} from '../../../../services/catmaterialstatus.service';

@Component({
  selector: 'app-categorizedmaterial-form',
  templateUrl: './categorizedmaterial-form.component.html',
  styleUrls: ['./categorizedmaterial-form.component.scss']
})
export class CategorizedmaterialFormComponent extends AbstractComponent implements OnInit {

  categorizations: Categorization[] = [];
  materials: Material[] = [];
  catmaterialstatuses: Catmaterialstatus[] = [];

  form = new FormGroup({
    categorization: new FormControl(null, [
    ]),
    material: new FormControl(null, [
    ]),
    weight: new FormControl(null, [
      Validators.min(0),
      Validators.max(9999999),
      Validators.pattern('^([0-9]{1,7}([.][0-9]{1,3})?)$'),
    ]),
    catmaterialstatus: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get categorizationField(): FormControl{
    return this.form.controls.categorization as FormControl;
  }

  get materialField(): FormControl{
    return this.form.controls.material as FormControl;
  }

  get weightField(): FormControl{
    return this.form.controls.weight as FormControl;
  }

  get catmaterialstatusField(): FormControl{
    return this.form.controls.catmaterialstatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private categorizationService: CategorizationService,
    private materialService: MaterialService,
    private catmaterialstatusService: CatmaterialstatusService,
    private categorizedmaterialService: CategorizedmaterialService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.categorizationService.getAllBasic(new PageRequest()).then((categorizationDataPage) => {
      this.categorizations = categorizationDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.materialService.getAllBasic(new PageRequest()).then((materialDataPage) => {
      this.materials = materialDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.catmaterialstatusService.getAll().then((catmaterialstatuses) => {
      this.catmaterialstatuses = catmaterialstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CATEGORIZEDMATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CATEGORIZEDMATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CATEGORIZEDMATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CATEGORIZEDMATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CATEGORIZEDMATERIAL);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const categorizedmaterial: Categorizedmaterial = new Categorizedmaterial();
    categorizedmaterial.categorization = this.categorizationField.value;
    categorizedmaterial.material = this.materialField.value;
    categorizedmaterial.weight = this.weightField.value;
    categorizedmaterial.catmaterialstatus = this.catmaterialstatusField.value;
    categorizedmaterial.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.categorizedmaterialService.add(categorizedmaterial);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/categorizedmaterials/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.categorization) { this.categorizationField.setErrors({server: msg.categorization}); knownError = true; }
          if (msg.material) { this.materialField.setErrors({server: msg.material}); knownError = true; }
          if (msg.weight) { this.weightField.setErrors({server: msg.weight}); knownError = true; }
          if (msg.catmaterialstatus) { this.catmaterialstatusField.setErrors({server: msg.catmaterialstatus}); knownError = true; }
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
