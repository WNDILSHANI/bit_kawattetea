import {User} from './user';
import {Supplier} from './supplier';
import {Material} from './material';
import {DataPage} from '../shared/data-page';
import {Collectionstatus} from './collectionstatus';

export class Collection {
  id: number;
  code: string;
  date: string;
  weight: number;
  unitprice: number;
  supplier: Supplier;
  material: Material;
  collectionstatus: Collectionstatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class CollectionDataPage extends DataPage{
    content: Collection[];
}
