import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Packingstatus} from '../entities/packingstatus';

@Injectable({
  providedIn: 'root'
})
export class PackingstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Packingstatus[]>{
    const packingstatuses = await this.http.get<Packingstatus[]>(ApiManager.getURL('packingstatuses')).toPromise();
    return packingstatuses.map((packingstatus) => Object.assign(new Packingstatus(), packingstatus));
  }

}
