import {User} from './user';
import {Customertype} from './customertype';
import {DataPage} from '../shared/data-page';

export class Customer {
  id: number;
  code: string;
  customertype: Customertype;
  name: string;
  contact1: string;
  contact2: string;
  fax: string;
  email: string;
  address: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class CustomerDataPage extends DataPage{
    content: Customer[];
}
