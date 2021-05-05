import {User} from './user';
import {Grade} from './grade';
import {DataPage} from '../shared/data-page';
import {Categorizedmaterial} from './categorizedmaterial';

export class Gradebatch {
  id: number;
  code: string;
  grade: Grade;
  name: string;
  categorizedmaterial: Categorizedmaterial;
  weight: number;
  domanufactured: string;
  doexpire: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class GradebatchDataPage extends DataPage{
    content: Gradebatch[];
}
