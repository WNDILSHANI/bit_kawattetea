import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Permentingstatus} from '../entities/permentingstatus';

@Injectable({
  providedIn: 'root'
})
export class PermentingstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Permentingstatus[]>{
    const permentingstatuses = await this.http.get<Permentingstatus[]>(ApiManager.getURL('permentingstatuses')).toPromise();
    return permentingstatuses.map((permentingstatus) => Object.assign(new Permentingstatus(), permentingstatus));
  }

}
