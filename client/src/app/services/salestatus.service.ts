import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Salestatus} from '../entities/salestatus';

@Injectable({
  providedIn: 'root'
})
export class SalestatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Salestatus[]>{
    const salestatuses = await this.http.get<Salestatus[]>(ApiManager.getURL('salestatuses')).toPromise();
    return salestatuses.map((salestatus) => Object.assign(new Salestatus(), salestatus));
  }

}
