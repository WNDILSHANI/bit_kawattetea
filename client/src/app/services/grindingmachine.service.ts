import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Grindingmachine} from '../entities/grindingmachine';

@Injectable({
  providedIn: 'root'
})
export class GrindingmachineService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Grindingmachine[]>{
    const grindingmachines = await this.http.get<Grindingmachine[]>(ApiManager.getURL('grindingmachines')).toPromise();
    return grindingmachines.map((grindingmachine) => Object.assign(new Grindingmachine(), grindingmachine));
  }

}
