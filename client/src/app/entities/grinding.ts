import {User} from './user';
import {Employee} from './employee';
import {DataPage} from '../shared/data-page';
import {Grindingstatus} from './grindingstatus';
import {Grindingnetsize} from './grindingnetsize';
import {Categorizedmaterial} from './categorizedmaterial';
import {Grindinggrindingmachine} from './grindinggrindingmachine';

export class Grinding {
  id: number;
  code: string;
  tostart: string;
  toend: string;
  employeeList: Employee[];
  initweight: number;
  finalweight: number;
  grindingstatus: Grindingstatus;
  grindingnetsize: Grindingnetsize;
  categorizedmaterial: Categorizedmaterial;
  description: string;
  grindinggrindingmachineList: Grindinggrindingmachine[];
  creator: User;
  tocreation: string;
}

export class GrindingDataPage extends DataPage{
    content: Grinding[];
}
