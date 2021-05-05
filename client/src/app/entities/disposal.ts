import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Disposalgradebatch} from './disposalgradebatch';

export class Disposal {
  id: number;
  code: string;
  reason: string;
  date: string;
  disposalgradebatchList: Disposalgradebatch[];
  creator: User;
  tocreation: string;
}

export class DisposalDataPage extends DataPage{
    content: Disposal[];
}
