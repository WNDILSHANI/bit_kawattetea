import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Grindingstatus} from '../entities/grindingstatus';

@Injectable({
  providedIn: 'root'
})
export class GrindingstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Grindingstatus[]>{
    const grindingstatuses = await this.http.get<Grindingstatus[]>(ApiManager.getURL('grindingstatuses')).toPromise();
    return grindingstatuses.map((grindingstatus) => Object.assign(new Grindingstatus(), grindingstatus));
  }

}
