import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Inventory} from '../../../../entities/inventory';
import {InventoryService} from '../../../../services/inventory.service';
import {Porder} from '../../../../entities/porder';
import {Product} from '../../../../entities/product';
import {DateHelper} from '../../../../shared/date-helper';
import {PorderService} from '../../../../services/porder.service';
import {ProductService} from '../../../../services/product.service';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent extends AbstractComponent implements OnInit {

  porders: Porder[] = [];
  products: Product[] = [];

  form = new FormGroup({
    qty: new FormControl(null, [
      Validators.min(-2147483648),
      Validators.max(2147483647),
      Validators.pattern('^([0-9]*)$'),
    ]),
    initqty: new FormControl(null, [
      Validators.min(-2147483648),
      Validators.max(2147483647),
      Validators.pattern('^([0-9]*)$'),
    ]),
    domanufactured: new FormControl(null, [
    ]),
    doexpire: new FormControl(null, [
    ]),
    porder: new FormControl(null, [
    ]),
    product: new FormControl(null, [
    ]),
  });

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get initqtyField(): FormControl{
    return this.form.controls.initqty as FormControl;
  }

  get domanufacturedField(): FormControl{
    return this.form.controls.domanufactured as FormControl;
  }

  get doexpireField(): FormControl{
    return this.form.controls.doexpire as FormControl;
  }

  get porderField(): FormControl{
    return this.form.controls.porder as FormControl;
  }

  get productField(): FormControl{
    return this.form.controls.product as FormControl;
  }

  constructor(
    private porderService: PorderService,
    private productService: ProductService,
    private inventoryService: InventoryService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.porderService.getAllBasic(new PageRequest()).then((porderDataPage) => {
      this.porders = porderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.productService.getAllBasic(new PageRequest()).then((productDataPage) => {
      this.products = productDataPage.content;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_INVENTORY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_INVENTORIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_INVENTORY_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_INVENTORY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_INVENTORY);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const inventory: Inventory = new Inventory();
    inventory.qty = this.qtyField.value;
    inventory.initqty = this.initqtyField.value;
    inventory.domanufactured = this.domanufacturedField.value ? DateHelper.getDateAsString(this.domanufacturedField.value) : null;
    inventory.doexpire = this.doexpireField.value ? DateHelper.getDateAsString(this.doexpireField.value) : null;
    inventory.porder = this.porderField.value;
    inventory.product = this.productField.value;
    try{
      const resourceLink: ResourceLink = await this.inventoryService.add(inventory);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/inventories/' + resourceLink.id);
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
          if (msg.qty) { this.qtyField.setErrors({server: msg.qty}); knownError = true; }
          if (msg.initqty) { this.initqtyField.setErrors({server: msg.initqty}); knownError = true; }
          if (msg.domanufactured) { this.domanufacturedField.setErrors({server: msg.domanufactured}); knownError = true; }
          if (msg.doexpire) { this.doexpireField.setErrors({server: msg.doexpire}); knownError = true; }
          if (msg.porder) { this.porderField.setErrors({server: msg.porder}); knownError = true; }
          if (msg.product) { this.productField.setErrors({server: msg.product}); knownError = true; }
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
