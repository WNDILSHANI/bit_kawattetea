import {User} from './user';
import {Employee} from './employee';
import {Collection} from './collection';
import {DataPage} from '../shared/data-page';
import {Categorizationstatus} from './categorizationstatus';

export class Categorization {
  id: number;
  code: string;
  tostart: string;
  toend: string;
  categorizationstatus: Categorizationstatus;
  employeeList: Employee[];
  collectionList: Collection[];
  description: string;
  creator: User;
  tocreation: string;
}

export class CategorizationDataPage extends DataPage{
    content: Categorization[];
}
