import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
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
  selector: 'app-categorizedmaterial-update-form',
  templateUrl: './categorizedmaterial-update-form.component.html',
  styleUrls: ['./categorizedmaterial-update-form.component.scss']
})
export class CategorizedmaterialUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  categorizedmaterial: Categorizedmaterial;

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
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.categorizedmaterial = await this.categorizedmaterialService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CATEGORIZEDMATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CATEGORIZEDMATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CATEGORIZEDMATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CATEGORIZEDMATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CATEGORIZEDMATERIAL);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.categorizationField.pristine) {
      this.categorizationField.setValue(this.categorizedmaterial.categorization.id);
    }
    if (this.materialField.pristine) {
      this.materialField.setValue(this.categorizedmaterial.material.id);
    }
    if (this.weightField.pristine) {
      this.weightField.setValue(this.categorizedmaterial.weight);
    }
    if (this.catmaterialstatusField.pristine) {
      this.catmaterialstatusField.setValue(this.categorizedmaterial.catmaterialstatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.categorizedmaterial.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newcategorizedmaterial: Categorizedmaterial = new Categorizedmaterial();
    newcategorizedmaterial.categorization = this.categorizationField.value;
    newcategorizedmaterial.material = this.materialField.value;
    newcategorizedmaterial.weight = this.weightField.value;
    newcategorizedmaterial.catmaterialstatus = this.catmaterialstatusField.value;
    newcategorizedmaterial.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.categorizedmaterialService.update(this.selectedId, newcategorizedmaterial);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/categorizedmaterials/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/categorizedmaterials');
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
