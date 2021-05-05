import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Dryeringstatus} from '../entities/dryeringstatus';

@Injectable({
  providedIn: 'root'
})
export class DryeringstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Dryeringstatus[]>{
    const dryeringstatuses = await this.http.get<Dryeringstatus[]>(ApiManager.getURL('dryeringstatuses')).toPromise();
    return dryeringstatuses.map((dryeringstatus) => Object.assign(new Dryeringstatus(), dryeringstatus));
  }

}
