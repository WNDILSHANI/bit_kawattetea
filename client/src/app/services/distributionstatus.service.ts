import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Distributionstatus} from '../entities/distributionstatus';

@Injectable({
  providedIn: 'root'
})
export class DistributionstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Distributionstatus[]>{
    const distributionstatuses = await this.http.get<Distributionstatus[]>(ApiManager.getURL('distributionstatuses')).toPromise();
    return distributionstatuses.map((distributionstatus) => Object.assign(new Distributionstatus(), distributionstatus));
  }

}
