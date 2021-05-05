import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Productdisposalinventory} from './productdisposalinventory';

export class Productdisposal {
  id: number;
  code: string;
  reason: string;
  date: string;
  productdisposalinventoryList: Productdisposalinventory[];
  creator: User;
  tocreation: string;
}

export class ProductdisposalDataPage extends DataPage{
    content: Productdisposal[];
}
