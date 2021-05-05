import {User} from './user';
import {Customer} from './customer';
import {Salestatus} from './salestatus';
import {DataPage} from '../shared/data-page';
import {Saleinventory} from './saleinventory';

export class Sale {
  id: number;
  code: string;
  total: number;
  discount: number;
  customer: Customer;
  salestatus: Salestatus;
  description: string;
  saleinventoryList: Saleinventory[];
  creator: User;
  tocreation: string;
}

export class SaleDataPage extends DataPage{
    content: Sale[];
}
