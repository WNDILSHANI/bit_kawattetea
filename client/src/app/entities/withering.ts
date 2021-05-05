import {User} from './user';
import {Employee} from './employee';
import {DataPage} from '../shared/data-page';
import {Witheringstatus} from './witheringstatus';
import {Categorizedmaterial} from './categorizedmaterial';
import {Witheringwitherline} from './witheringwitherline';

export class Withering {
  id: number;
  code: string;
  tostart: string;
  toend: string;
  employeeList: Employee[];
  initweight: number;
  finalweight: number;
  witheringstatus: Witheringstatus;
  categorizedmaterial: Categorizedmaterial;
  description: string;
  witheringwitherlineList: Witheringwitherline[];
  creator: User;
  tocreation: string;
}

export class WitheringDataPage extends DataPage{
    content: Withering[];
}
