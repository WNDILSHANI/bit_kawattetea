import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Customertype} from '../entities/customertype';

@Injectable({
  providedIn: 'root'
})
export class CustomertypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Customertype[]>{
    const customertypes = await this.http.get<Customertype[]>(ApiManager.getURL('customertypes')).toPromise();
    return customertypes.map((customertype) => Object.assign(new Customertype(), customertype));
  }

}
