import {User} from './user';
import {Employee} from './employee';
import {DataPage} from '../shared/data-page';
import {Permentingstatus} from './permentingstatus';
import {Categorizedmaterial} from './categorizedmaterial';
import {Permentingpermentingmachine} from './permentingpermentingmachine';

export class Permenting {
  id: number;
  code: string;
  tostart: string;
  toend: string;
  employeeList: Employee[];
  initweight: number;
  finalweight: number;
  permentingstatus: Permentingstatus;
  categorizedmaterial: Categorizedmaterial;
  description: string;
  permentingpermentingmachineList: Permentingpermentingmachine[];
  creator: User;
  tocreation: string;
}

export class PermentingDataPage extends DataPage{
    content: Permenting[];
}
