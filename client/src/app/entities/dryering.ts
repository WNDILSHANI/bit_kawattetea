import {User} from './user';
import {Employee} from './employee';
import {DataPage} from '../shared/data-page';
import {Dryeringstatus} from './dryeringstatus';
import {Categorizedmaterial} from './categorizedmaterial';
import {Dryeringdryeringline} from './dryeringdryeringline';

export class Dryering {
  id: number;
  code: string;
  tostart: string;
  toend: string;
  employeeList: Employee[];
  initweight: number;
  finalweight: number;
  dryeringstatus: Dryeringstatus;
  categorizedmaterial: Categorizedmaterial;
  description: string;
  dryeringdryeringlineList: Dryeringdryeringline[];
  creator: User;
  tocreation: string;
}

export class DryeringDataPage extends DataPage{
    content: Dryering[];
}
