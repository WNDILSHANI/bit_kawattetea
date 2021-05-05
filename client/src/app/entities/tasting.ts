import {User} from './user';
import {Employee} from './employee';
import {DataPage} from '../shared/data-page';
import {Tastingstatus} from './tastingstatus';
import {Categorizedmaterial} from './categorizedmaterial';

export class Tasting {
  id: number;
  code: string;
  tostart: string;
  toend: string;
  employeeList: Employee[];
  initweight: number;
  finalweight: number;
  tastingstatus: Tastingstatus;
  categorizedmaterial: Categorizedmaterial;
  description: string;
  creator: User;
  tocreation: string;
}

export class TastingDataPage extends DataPage{
    content: Tasting[];
}
