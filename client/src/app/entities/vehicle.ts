import {User} from './user';
import {Vehicletype} from './vehicletype';
import {DataPage} from '../shared/data-page';
import {Vehiclestatus} from './vehiclestatus';

export class Vehicle {
  id: number;
  no: string;
  modal: string;
  brand: string;
  payloadwidth: number;
  payloadlength: number;
  payloadheight: number;
  vehicletype: Vehicletype;
  vehiclestatus: Vehiclestatus;
  photo: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class VehicleDataPage extends DataPage{
    content: Vehicle[];
}
