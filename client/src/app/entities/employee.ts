import {User} from './user';
import {Gender} from './gender';
import {Nametitle} from './nametitle';
import {Civilstatus} from './civilstatus';
import {Designation} from './designation';
import {DataPage} from '../shared/data-page';
import {Employeestatus} from './employeestatus';

export class Employee {
  id: number;
  code: string;
  nametitle: Nametitle;
  callingname: string;
  fullname: string;
  nic: string;
  dobirth: string;
  gender: Gender;
  civilstatus: Civilstatus;
  employeestatus: Employeestatus;
  mobile: string;
  land: string;
  email: string;
  photo: string;
  address: string;
  designation: Designation;
  dorecruit: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class EmployeeDataPage extends DataPage{
    content: Employee[];
}
