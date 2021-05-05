import {Sale} from './sale';
import {User} from './user';
import {Vehicle} from './vehicle';
import {Employee} from './employee';
import {DataPage} from '../shared/data-page';
import {Distributionstatus} from './distributionstatus';

export class Distribution {
  id: number;
  code: string;
  sale: Sale;
  vehicle: Vehicle;
  distributionstatus: Distributionstatus;
  contactpersonname: string;
  contactpersonnic: string;
  contactpersontel: string;
  date: string;
  fee: number;
  description: string;
  employeeList: Employee[];
  creator: User;
  tocreation: string;
}

export class DistributionDataPage extends DataPage{
    content: Distribution[];
}
