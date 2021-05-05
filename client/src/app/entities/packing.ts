import {User} from './user';
import {Porder} from './porder';
import {Employee} from './employee';
import {DataPage} from '../shared/data-page';
import {Packingstatus} from './packingstatus';
import {Packingproduct} from './packingproduct';

export class Packing {
  id: number;
  code: string;
  tostart: string;
  toend: string;
  employeeList: Employee[];
  packingstatus: Packingstatus;
  porder: Porder;
  description: string;
  packingproductList: Packingproduct[];
  creator: User;
  tocreation: string;
}

export class PackingDataPage extends DataPage{
    content: Packing[];
}
