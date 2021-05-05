import {User} from './user';
import {Porderstatus} from './porderstatus';
import {DataPage} from '../shared/data-page';
import {Porderproduct} from './porderproduct';

export class Porder {
  id: number;
  code: string;
  doordered: string;
  dorequired: string;
  dorecived: string;
  description: string;
  porderstatus: Porderstatus;
  porderproductList: Porderproduct[];
  creator: User;
  tocreation: string;
}

export class PorderDataPage extends DataPage{
    content: Porder[];
}
