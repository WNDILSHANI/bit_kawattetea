import {User} from './user';
import {Route} from './route';
import {DataPage} from '../shared/data-page';
import {Supplierstatus} from './supplierstatus';

export class Supplier {
  id: number;
  code: string;
  name: string;
  supplierstatus: Supplierstatus;
  route: Route;
  contact1: string;
  contact2: string;
  fax: string;
  email: string;
  address: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class SupplierDataPage extends DataPage{
    content: Supplier[];
}
