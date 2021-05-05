import {User} from './user';
import {Tealeaftype} from './tealeaftype';
import {Teatreetype} from './teatreetype';
import {DataPage} from '../shared/data-page';
import {Materialstatus} from './materialstatus';

export class Material {
  id: number;
  code: string;
  tealeaftype: Tealeaftype;
  teatreetype: Teatreetype;
  unitprice: number;
  materialstatus: Materialstatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class MaterialDataPage extends DataPage{
    content: Material[];
}
