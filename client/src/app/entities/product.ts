import {User} from './user';
import {Grade} from './grade';
import {DataPage} from '../shared/data-page';
import {Productstatus} from './productstatus';
import {Productmaterial} from './productmaterial';

export class Product {
  id: number;
  code: string;
  name: string;
  photo: string;
  productstatus: Productstatus;
  grade: Grade;
  rop: number;
  weight: number;
  price: number;
  description: string;
  productmaterialList: Productmaterial[];
  creator: User;
  tocreation: string;
}

export class ProductDataPage extends DataPage{
    content: Product[];
}
