import {User} from './user';
import {Material} from './material';
import {DataPage} from '../shared/data-page';
import {Categorization} from './categorization';
import {Catmaterialstatus} from './catmaterialstatus';

export class Categorizedmaterial {
  id: number;
  code: string;
  categorization: Categorization;
  material: Material;
  weight: number;
  catmaterialstatus: Catmaterialstatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class CategorizedmaterialDataPage extends DataPage{
    content: Categorizedmaterial[];
}
