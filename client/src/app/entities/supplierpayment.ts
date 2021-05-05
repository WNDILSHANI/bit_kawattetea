import {User} from './user';
import {Deduction} from './deduction';
import {Collection} from './collection';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';

export class Supplierpayment {
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
  collection: Collection;
  description: string;
  deductionList: Deduction[];
  creator: User;
  tocreation: string;
}

export class SupplierpaymentDataPage extends DataPage{
    content: Supplierpayment[];
}
