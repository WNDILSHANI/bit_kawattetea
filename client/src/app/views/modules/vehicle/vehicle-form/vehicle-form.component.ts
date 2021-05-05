import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Vehicle} from '../../../../entities/vehicle';
import {VehicleService} from '../../../../services/vehicle.service';
import {Vehicletype} from '../../../../entities/vehicletype';
import {Vehiclestatus} from '../../../../entities/vehiclestatus';
import {VehicletypeService} from '../../../../services/vehicletype.service';
import {VehiclestatusService} from '../../../../services/vehiclestatus.service';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss']
})
export class VehicleFormComponent extends AbstractComponent implements OnInit {

  vehicletypes: Vehicletype[] = [];
  vehiclestatuses: Vehiclestatus[] = [];

  form = new FormGroup({
    no: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    modal: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    brand: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    payloadwidth: new FormControl(null, [
      Validators.min(-2147483648),
      Validators.max(2147483647),
      Validators.pattern('^([0-9]*)$'),
    ]),
    payloadlength: new FormControl(null, [
      Validators.min(-2147483648),
      Validators.max(2147483647),
      Validators.pattern('^([0-9]*)$'),
    ]),
    payloadheight: new FormControl(null, [
      Validators.min(-2147483648),
      Validators.max(2147483647),
      Validators.pattern('^([0-9]*)$'),
    ]),
    vehicletype: new FormControl(null, [
      Validators.required,
    ]),
    vehiclestatus: new FormControl(null, [
      Validators.required,
    ]),
    photo: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get noField(): FormControl{
    return this.form.controls.no as FormControl;
  }

  get modalField(): FormControl{
    return this.form.controls.modal as FormControl;
  }

  get brandField(): FormControl{
    return this.form.controls.brand as FormControl;
  }

  get payloadwidthField(): FormControl{
    return this.form.controls.payloadwidth as FormControl;
  }

  get payloadlengthField(): FormControl{
    return this.form.controls.payloadlength as FormControl;
  }

  get payloadheightField(): FormControl{
    return this.form.controls.payloadheight as FormControl;
  }

  get vehicletypeField(): FormControl{
    return this.form.controls.vehicletype as FormControl;
  }

  get vehiclestatusField(): FormControl{
    return this.form.controls.vehiclestatus as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private vehicletypeService: VehicletypeService,
    private vehiclestatusService: VehiclestatusService,
    private vehicleService: VehicleService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.vehicletypeService.getAll().then((vehicletypes) => {
      this.vehicletypes = vehicletypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.vehiclestatusService.getAll().then((vehiclestatuses) => {
      this.vehiclestatuses = vehiclestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_VEHICLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_VEHICLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_VEHICLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_VEHICLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_VEHICLE);
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const vehicle: Vehicle = new Vehicle();
    vehicle.no = this.noField.value;
    vehicle.modal = this.modalField.value;
    vehicle.brand = this.brandField.value;
    vehicle.payloadwidth = this.payloadwidthField.value;
    vehicle.payloadlength = this.payloadlengthField.value;
    vehicle.payloadheight = this.payloadheightField.value;
    vehicle.vehicletype = this.vehicletypeField.value;
    vehicle.vehiclestatus = this.vehiclestatusField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      vehicle.photo = photoIds[0];
    }else{
      vehicle.photo = null;
    }
    vehicle.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.vehicleService.add(vehicle);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/vehicles/' + resourceLink.id);
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
          if (msg.no) { this.noField.setErrors({server: msg.no}); knownError = true; }
          if (msg.modal) { this.modalField.setErrors({server: msg.modal}); knownError = true; }
          if (msg.brand) { this.brandField.setErrors({server: msg.brand}); knownError = true; }
          if (msg.payloadwidth) { this.payloadwidthField.setErrors({server: msg.payloadwidth}); knownError = true; }
          if (msg.payloadlength) { this.payloadlengthField.setErrors({server: msg.payloadlength}); knownError = true; }
          if (msg.payloadheight) { this.payloadheightField.setErrors({server: msg.payloadheight}); knownError = true; }
          if (msg.vehicletype) { this.vehicletypeField.setErrors({server: msg.vehicletype}); knownError = true; }
          if (msg.vehiclestatus) { this.vehiclestatusField.setErrors({server: msg.vehiclestatus}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
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
