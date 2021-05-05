import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Inventory} from '../../../../entities/inventory';
import {InventoryService} from '../../../../services/inventory.service';
import {Porder} from '../../../../entities/porder';
import {Product} from '../../../../entities/product';
import {DateHelper} from '../../../../shared/date-helper';
import {PorderService} from '../../../../services/porder.service';
import {ProductService} from '../../../../services/product.service';

@Component({
  selector: 'app-inventory-update-form',
  templateUrl: './inventory-update-form.component.html',
  styleUrls: ['./inventory-update-form.component.scss']
})
export class InventoryUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  inventory: Inventory;

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
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.inventory = await this.inventoryService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_INVENTORY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_INVENTORIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_INVENTORY_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_INVENTORY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_INVENTORY);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.qtyField.pristine) {
      this.qtyField.setValue(this.inventory.qty);
    }
    if (this.initqtyField.pristine) {
      this.initqtyField.setValue(this.inventory.initqty);
    }
    if (this.domanufacturedField.pristine) {
      this.domanufacturedField.setValue(this.inventory.domanufactured);
    }
    if (this.doexpireField.pristine) {
      this.doexpireField.setValue(this.inventory.doexpire);
    }
    if (this.porderField.pristine) {
      this.porderField.setValue(this.inventory.porder.id);
    }
    if (this.productField.pristine) {
      this.productField.setValue(this.inventory.product.id);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newinventory: Inventory = new Inventory();
    newinventory.qty = this.qtyField.value;
    newinventory.initqty = this.initqtyField.value;
    newinventory.domanufactured = this.domanufacturedField.value ? DateHelper.getDateAsString(this.domanufacturedField.value) : null;
    newinventory.doexpire = this.doexpireField.value ? DateHelper.getDateAsString(this.doexpireField.value) : null;
    newinventory.porder = this.porderField.value;
    newinventory.product = this.productField.value;
    try{
      const resourceLink: ResourceLink = await this.inventoryService.update(this.selectedId, newinventory);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/inventories/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/inventories');
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
