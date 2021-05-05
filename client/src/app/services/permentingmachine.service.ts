import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Permentingmachine} from '../entities/permentingmachine';

@Injectable({
  providedIn: 'root'
})
export class PermentingmachineService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Permentingmachine[]>{
    const permentingmachines = await this.http.get<Permentingmachine[]>(ApiManager.getURL('permentingmachines')).toPromise();
    return permentingmachines.map((permentingmachine) => Object.assign(new Permentingmachine(), permentingmachine));
  }

}
