import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Tastingstatus} from '../entities/tastingstatus';

@Injectable({
  providedIn: 'root'
})
export class TastingstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Tastingstatus[]>{
    const tastingstatuses = await this.http.get<Tastingstatus[]>(ApiManager.getURL('tastingstatuses')).toPromise();
    return tastingstatuses.map((tastingstatus) => Object.assign(new Tastingstatus(), tastingstatus));
  }

}
