import {Sale} from './sale';
import {User} from './user';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';

export class Customerpayment {
  id: number;
  code: string;
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
  creator: User;
  tocreation: string;
}

export class CustomerpaymentDataPage extends DataPage{
    content: Customerpayment[];
}
