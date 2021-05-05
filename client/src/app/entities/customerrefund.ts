import {Sale} from './sale';
import {User} from './user';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';
import {Customerrefundproduct} from './customerrefundproduct';

export class Customerrefund {
  id: number;
  code: string;
  reason: string;
  date: string;
  amount: number;
  chequeno: string;
  chequebank: string;
  chequebranch: string;
  chequedate: string;
  paymenttype: Paymenttype;
  paymentstatus: Paymentstatus;
  sale: Sale;
  description: string;
  customerrefundproductList: Customerrefundproduct[];
  creator: User;
  tocreation: string;
}

export class CustomerrefundDataPage extends DataPage{
    content: Customerrefund[];
}
