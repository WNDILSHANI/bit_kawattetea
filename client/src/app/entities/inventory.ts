import {User} from './user';
import {Porder} from './porder';
import {Product} from './product';
import {DataPage} from '../shared/data-page';

export class Inventory {
  id: number;
  code: string;
  qty: number;
  initqty: number;
  domanufactured: string;
  doexpire: string;
  porder: Porder;
  product: Product;
  creator: User;
  tocreation: string;
}

export class InventoryDataPage extends DataPage{
    content: Inventory[];
}
